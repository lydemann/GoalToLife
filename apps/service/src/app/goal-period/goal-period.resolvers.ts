import { ApolloError } from 'apollo-server-express';
import firebase from 'firebase';

import {
  GetGoalPeriodsInput,
  Goal,
  GoalPeriod,
  GoalPeriodType,
  getWeeklyGoalKeyFromWeekNumber,
  GoalPeriodDB,
} from '@app/shared/domain';
import { getWeekNumber } from '@app/shared/util';
import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';
interface GoalsInput {
  scheduledDate: string;
}

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
  inboxGoals: createResolver<null>(async (_, args, { auth: { uid } }) => {
    // TODO: setup security
    const snapshot = await firestoreDB.collection(`/users/${uid}/goals`).get();

    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Goal))
      .filter((goal) => {
        return !goal.scheduledDate;
      });
  }),
  goalPeriod: createResolver<GetGoalPeriodsInput>(
    async (_, { fromDate, toDate, dates }, { auth: { uid } }) => {
      const goalPeriods = [];

      if (!!toDate || !!fromDate) {
        const weeks = getWeeksBetweenDates(fromDate, toDate);
        const weekDateKeys = weeks.map((week) =>
          getWeeklyGoalKeyFromWeekNumber(week.year, week.weekNumber)
        );
        // eslint-disable-next-line no-console
        // console.log(weekDateKeys);
        const goalPeriodSnapshotrangeWeeksProm = firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          .where('date', 'in', weekDateKeys)
          .get();

        const goalPeriodSnapshotrangeDaysProm = firestoreDB
          .collection(`/users/${uid}/goalPeriods`)
          .where('date', '<=', toDate)
          .where('date', '>=', fromDate)
          .get();

        const [goalPeriodSnapshotrangeWeeks, goalPeriodSnapshotrangeDays] =
          await Promise.all([
            goalPeriodSnapshotrangeWeeksProm,
            goalPeriodSnapshotrangeDaysProm,
          ]);

        const goalPeriodsFromRangeWeeks = goalPeriodSnapshotrangeWeeks.docs.map(
          (doc) => doc.data() as GoalPeriodDB
        );

        const goalPeriodsFromRangeDays = goalPeriodSnapshotrangeDays.docs.map(
          (doc) => doc.data() as GoalPeriodDB
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
          goalPeriods.push(goalPeriodSnapshot.docs[0].data() as GoalPeriodDB);
        }
      }

      return goalPeriods;
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
  scheduledDate: string;
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
        completed: false,
        type,
        createdAt: JSON.stringify(Date.now()),
      } as Goal;
      await newGoalRef.set(newGoal);

      await updateGoalPeriod(scheduledDate, uid, newGoal, type, goalIndex);

      return newGoal;
    }
  ),
  updateGoal: createResolver<Goal>(async (_, payload, { auth: { uid } }) => {
    // TODO: if no goal date, add to inbox
    await updateGoalPeriod(payload.scheduledDate, uid, payload, payload.type);
    return payload;
  }),
  deleteGoal: createResolver<DeleteGoalInput>(
    async (_, { id, scheduledDate }, { auth: { uid } }) => {
      const goalRef = firestoreDB.doc(`/users/${uid}/goals/${id}`);
      await goalRef.delete();

      if (scheduledDate) {
        const goalPeriodRef = firestoreDB.doc(
          `/users/${uid}/goalPeriods/${scheduledDate}`
        );
        const goalPeriodSnap = await goalPeriodRef.get();
        const goalPeriod = (await goalPeriodSnap.data()) as GoalPeriodDB;
        const updatedGoals = goalPeriod.goals?.filter((goal) => goal.id !== id);
        goalPeriodRef.update({ goals: updatedGoals } as GoalPeriodDB);
      }

      return 'Goal deleted';
    }
  ),
};
async function updateGoalPeriod(
  scheduledDate: string,
  uid: string,
  goal: Goal,
  type: GoalPeriodType,
  goalIndex?: number
) {
  if (scheduledDate) {
    const goalPeriodRef = firestoreDB
      .collection(`/users/${uid}/goalPeriods`)
      .doc(scheduledDate);

    const prevGoalPeriodSnap = await goalPeriodRef.get();
    const prevGoalPeriod: GoalPeriodDB =
      (prevGoalPeriodSnap.data() as GoalPeriodDB) ||
      ({ date: scheduledDate, goals: [] } as GoalPeriodDB);
    const prevGoals = prevGoalPeriod.goals;
    let updatedGoals = [...prevGoals];
    const existingGoalIndex = prevGoalPeriod.goals.findIndex(
      (goal) => goal.id === goal.id
    );
    // TODO: move goal from existing index to new index
    // const goalShouldBeMoved =
    //   goalIndex !== null && goalIndex >= 0 && goalIndex <= prevGoals.length;
    // if (goalShouldBeMoved) {
    //   updatedGoals.splice(goalIndex, 0, goal);
    // }
    if (goalIndex !== -1) {
      updatedGoals = [...prevGoalPeriod.goals, goal];
    } else {
      updatedGoals.splice(existingGoalIndex, 1, goal);
    }

    await goalPeriodRef.set({
      ...prevGoalPeriod,
      type,
      goals: updatedGoals,
    } as GoalPeriodDB);
  }
}

async function addGoalPeriod(
  scheduledDate: string,
  uid: string,
  goal: Goal,
  type: GoalPeriodType,
  goalIndex?: number
) {
  if (scheduledDate) {
    const goalPeriodRef = firestoreDB
      .collection(`/users/${uid}/goalPeriods`)
      .doc(scheduledDate);

    const prevGoalPeriodSnap = await goalPeriodRef.get();
    const prevGoalPeriod: GoalPeriodDB =
      (prevGoalPeriodSnap.data() as GoalPeriodDB) ||
      ({ date: scheduledDate, goals: [] } as GoalPeriodDB);
    const prevGoals = prevGoalPeriod.goals;
    let updatedGoals = [...prevGoals];
    const goalShouldBeMoved =
      goalIndex !== null && goalIndex >= 0 && goalIndex <= prevGoals.length;
    if (goalShouldBeMoved) {
      updatedGoals.splice(goalIndex, 0, goal);
    }
    goalIndex = prevGoalPeriod.goals.findIndex((goal) => goal.id === goal.id);
    if (goalIndex !== -1) {
      updatedGoals = [...prevGoalPeriod.goals, goal];
    } else {
      updatedGoals.splice(goalIndex, 0, goal);
    }

    await goalPeriodRef.set({
      ...prevGoalPeriod,
      type,
      goals: updatedGoals,
    } as GoalPeriodDB);
  }
}

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
