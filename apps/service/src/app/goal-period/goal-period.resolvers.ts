import { ApolloError } from 'apollo-server-express';
import firebase from 'firebase';

import {
  GetGoalPeriodsInput,
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  GoalPeriodType,
} from '@app/shared/interfaces';
import {
  getWeeklyGoalKeyFromWeekumber,
  getWeekNumber,
} from '@app/shared/utils';
import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';
interface GoalsInput {
  scheduledDate: string;
}

const enrichGoalPeriod = async (
  goalPeriod: GoalPeriodStore,
  uid: string
): Promise<GoalPeriod> => {
  if (!goalPeriod.goals) {
    return Promise.resolve({ ...goalPeriod, goals: [] } as GoalPeriod);
  }

  const goalsPromises = goalPeriod.goals.map(async (goalId) => {
    const snap = await firestoreDB.doc(`/users/${uid}/goals/${goalId}`).get();
    return { id: snap.id, ...snap.data() } as Goal;
  });
  const goals = await Promise.all(goalsPromises);
  return {
    ...goalPeriod,
    goals,
  } as GoalPeriod;
};

export const goalQueryResolvers = {
  goal: createResolver<GoalsInput>(
    async (_, { scheduledDate }, { auth: { uid } }) => {
      // TODO: setup security
      const snapshot = await firestoreDB
        .collection(`/users/${uid}/goals`)
        .where('scheduledDate', '==', scheduledDate)
        .get();

      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Goal)
      );
    }
  ),
  goalPeriod: createResolver<GetGoalPeriodsInput>(
    async (_, { fromDate, toDate, dates }, { auth: { uid } }) => {
      const goalPeriods = [];

      if (!!toDate || !!fromDate) {
        const weeks = getWeeksBetweenDates(fromDate, toDate);
        const weekDateKeys = weeks.map((week) =>
          getWeeklyGoalKeyFromWeekumber(week.year, week.weekNumber)
        );
        console.log(weekDateKeys);
        const goalPeriodSnapshotrangeWeeks = await firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          .where('date', 'in', weekDateKeys)
          .get();
        const goalPeriodsFromRangeWeeks = goalPeriodSnapshotrangeWeeks.docs.map(
          (doc) => doc.data() as GoalPeriodStore
        );

        const goalPeriodSnapshotrangeDays = await firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          .where('date', '<=', toDate)
          .where('date', '>=', fromDate)
          .get();
        const goalPeriodsFromRangeDays = goalPeriodSnapshotrangeDays.docs.map(
          (doc) => doc.data() as GoalPeriodStore
        );

        goalPeriods.push(
          ...goalPeriodsFromRangeWeeks,
          ...goalPeriodsFromRangeDays
        );
      }

      if (dates) {
        const goalPeriodSnapshot = await firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          // TODO: get for type
          .where('date', 'in', dates)
          .get();

        if (goalPeriodSnapshot.docs[0]) {
          goalPeriods.push(
            goalPeriodSnapshot.docs[0].data() as GoalPeriodStore
          );
        }
      }

      const enrichedGoalPeriods = await Promise.all(
        goalPeriods.map(async (goalPeriod) => {
          return enrichGoalPeriod(goalPeriod, uid);
        })
      );

      return enrichedGoalPeriods;
    }
  ),
};

interface AddGoalInput {
  id: string;
  name: string;
  type: GoalPeriodType;
  scheduledDate?: string;
  goalIndex?: number;
}

interface UpdateGoalInput extends Partial<Goal> {
  goalIndex?: number;
}
interface DeleteGoalInput {
  id: string;
}

export const goalMutationResolvers = {
  updateGoalPeriod: createResolver<GoalPeriod>(
    async (_, goalPeriod, { auth: { uid } }) => {
      const newGoalPeriodRef = firestoreDB
        .collection(`/users/${uid}/goalPeriods`)
        .doc(goalPeriod.date);

      const updatedGoalPeriodSnapShot = await newGoalPeriodRef.get();

      const updatedGoalPeriod = {
        goals: [],
        ...updatedGoalPeriodSnapShot.data(),
        ...goalPeriod,
        lastUpdated: firebase.database.ServerValue.TIMESTAMP,
      };
      await newGoalPeriodRef.set(updatedGoalPeriod);

      return updatedGoalPeriod;
    }
  ),
  addGoal: createResolver<AddGoalInput>(
    async (
      _,
      {
        id,
        name,
        scheduledDate,
        type = GoalPeriodType.DAILY,
        goalIndex = null,
      },
      { auth: { uid } }
    ) => {
      // TODO: setup security
      const newGoalRef = firestoreDB.collection(`/users/${uid}/goals`).doc(id);
      const newGoal = {
        id: newGoalRef.id,
        name,
        scheduledDate,
        type,
        createdAt: JSON.stringify(Date.now()),
      } as Goal;
      await newGoalRef.set(newGoal);

      if (!!scheduledDate) {
        const goalPeriodRef = firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          .doc(scheduledDate);

        const prevGoalPeriodSnap = await goalPeriodRef.get();
        const prevGoalPeriod: GoalPeriodStore =
          (prevGoalPeriodSnap.data() as GoalPeriodStore) ||
          ({ date: scheduledDate, goals: [] } as GoalPeriodStore);
        const prevGoals = prevGoalPeriod.goals;
        let updatedGoals = [...prevGoals];
        const hasExistingGoalPeriod =
          goalIndex !== null && goalIndex >= 0 && goalIndex <= prevGoals.length;
        if (hasExistingGoalPeriod) {
          updatedGoals.splice(goalIndex, 0, newGoalRef.id);
        } else {
          updatedGoals = [...prevGoalPeriod.goals, newGoalRef.id];
        }
        console.log(prevGoalPeriod);

        await goalPeriodRef.set({
          ...prevGoalPeriod,
          type,
          goals: updatedGoals,
        } as GoalPeriodStore);
      }

      return newGoal;
    }
  ),
  updateGoal: createResolver<UpdateGoalInput>(
    async (_, payload, { auth: { uid } }) => {
      const goalRef = firestoreDB.doc(`/users/${uid}/goals/${payload.id}`);

      const goalSnapShot = await goalRef.get();
      if (!goalSnapShot.exists) {
        throw new ApolloError("Goal doesn't exist");
      }

      await goalRef.update(payload);
      return await goalSnapShot.data();
    }
  ),
  deleteGoal: createResolver<DeleteGoalInput>(
    async (_, { id }, { auth: { uid } }) => {
      const goalRef = firestoreDB.doc(`/users/${uid}/goals/${id}`);
      const goalSnap = await goalRef.get();
      const goalToDelete = goalSnap.data() as Goal;

      if (!goalToDelete) {
        return 'No goal with id found';
      }
      goalRef.delete();

      if (goalToDelete.scheduledDate) {
        const goalPeriodRef = firestoreDB.doc(
          `/users/${uid}/goalPeriods/${goalToDelete.scheduledDate}`
        );
        const goalPeriodSnap = await goalPeriodRef.get();
        const goalPeriod = (await goalPeriodSnap.data()) as GoalPeriodStore;
        const updatedGoals = goalPeriod.goals.filter((goal) => goal !== id);
        goalPeriodRef.update({ goals: updatedGoals } as GoalPeriodStore);
      }

      return 'Goal deleted';
    }
  ),
};
function getWeeksBetweenDates(fromDate: string, toDate: string) {
  const weekNumbersBetweenDates: { weekNumber: number; year: number }[] = [];
  const from = new Date(fromDate);
  const to = new Date(toDate);
  while (from < to || (fromDate && !toDate)) {
    const weekNumber = getWeekNumber(from);
    weekNumbersBetweenDates.push({ weekNumber, year: from.getFullYear() });
    from.setDate(from.getDate() + 7);
  }
  return weekNumbersBetweenDates;
}
