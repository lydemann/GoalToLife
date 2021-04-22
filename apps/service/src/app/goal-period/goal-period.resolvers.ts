import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { ApolloError, UserInputError } from 'apollo-server-express';
import firebase from 'firebase';
import admin, { firestore } from 'firebase-admin';

import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';

interface GoalPeriodFirebase extends Omit<GoalPeriod, 'goals'> {
  goals: string[];
}

interface GoalsInput {
  scheduledDate: string;
}

const enrichGoalPeriod = async (
  goalPeriod: GoalPeriodFirebase
): Promise<GoalPeriod> => {
  if (!goalPeriod.goals) {
    return Promise.resolve({ ...goalPeriod, goals: [] } as GoalPeriod);
  }

  const goalsPromises = goalPeriod.goals.map(async (goalId) => {
    const snap = await firestoreDB
      .doc(`/users/haOhlwjhAfRIOFGhHuJS/goals/${goalId}`)
      .get();
    return { id: snap.id, ...snap.data() } as Goal;
  });
  const goals = await Promise.all(goalsPromises);
  return {
    ...goalPeriod,
    goals,
  } as GoalPeriod;
};

export const goalQueryResolvers = {
  goal: createResolver<GoalsInput>(async (_, { scheduledDate }) => {
    // TODO: setup security
    const snapshot = await firestoreDB
      .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
      .where('scheduledDate', '==', scheduledDate)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Goal));
  }),
  goalPeriod: createResolver<DailySummariesInput>(
    async (_, { fromDate, toDate }) => {
      const goalPeriodSnapshot = await firestoreDB
        .collection('/users/haOhlwjhAfRIOFGhHuJS/goalPeriods')
        // TODO: get for type
        .where('date', '<=', toDate)
        .where('date', '>=', fromDate)
        .get();

      const goalPeriodFirebase = goalPeriodSnapshot.docs.map(
        (doc) => doc.data() as GoalPeriodFirebase
      );
      const goalPeriods = await Promise.all(
        goalPeriodFirebase.map(async (goalPeriod) => {
          return enrichGoalPeriod(goalPeriod);
        })
      );

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

interface DailySummariesInput {
  month: number;
  fromDate: string;
  toDate: String;
}

interface DeleteGoalInput {
  id: string;
}

export const goalMutationResolvers = {
  updateGoalPeriod: createResolver<GoalPeriod>(async (_, goalPeriod) => {
    const newGoalPeriodRef = firestoreDB
      .collection('/users/haOhlwjhAfRIOFGhHuJS/goalPeriods')
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
  }),
  addGoal: createResolver<AddGoalInput>(
    async (_, { id, name, type, scheduledDate = null, goalIndex = null }) => {
      // TODO: setup security
      const newGoalRef = firestoreDB
        .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
        .doc(id);
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
          .collection('/users/haOhlwjhAfRIOFGhHuJS/goalPeriods')
          .doc(scheduledDate);

        const prevGoalPeriodSnap = await goalPeriodRef.get();
        const prevGoalPeriod: GoalPeriodFirebase =
          (prevGoalPeriodSnap.data() as GoalPeriodFirebase) ||
          ({ date: scheduledDate, goals: [] } as GoalPeriodFirebase);
        const prevGoals = prevGoalPeriod.goals;
        let updatedGoals = [...prevGoals];
        const hasExistingGoalPeriod =
          goalIndex !== null && goalIndex >= 0 && goalIndex <= prevGoals.length;
        if (hasExistingGoalPeriod) {
          updatedGoals.splice(goalIndex, 0, newGoalRef.id);
        } else {
          updatedGoals = [...prevGoalPeriod.goals, newGoalRef.id];
        }
        await goalPeriodRef.set({
          ...prevGoalPeriod,
          goals: updatedGoals,
        } as GoalPeriodFirebase);
      }

      return newGoal;
    }
  ),
  updateGoal: createResolver<UpdateGoalInput>(async (_, payload) => {
    const goalRef = firestoreDB.doc(
      `/users/haOhlwjhAfRIOFGhHuJS/goals/${payload.id}`
    );

    const goalSnapShot = await goalRef.get();
    if (!goalSnapShot.exists) {
      throw new ApolloError("Goal doesn't exist");
    }

    await goalRef.update(payload);
    return await goalSnapShot.data();
  }),
  deleteGoal: createResolver<DeleteGoalInput>(async (_, { id }) => {
    const goalRef = firestoreDB.doc(`/users/haOhlwjhAfRIOFGhHuJS/goals/${id}`);
    const goalSnap = await goalRef.get();
    const goalToDelete = goalSnap.data() as Goal;

    if (!goalToDelete) {
      return 'No goal with id found';
    }
    goalRef.delete();

    if (goalToDelete.scheduledDate) {
      const goalPeriodRef = firestoreDB.doc(
        `/users/haOhlwjhAfRIOFGhHuJS/goalPeriods/${goalToDelete.scheduledDate}`
      );
      const goalPeriodSnap = await goalPeriodRef.get();
      const goalPeriod = (await goalPeriodSnap.data()) as GoalPeriodFirebase;
      const updatedGoals = goalPeriod.goals.filter((goal) => goal !== id);
      goalPeriodRef.update({ goals: updatedGoals } as GoalPeriodFirebase);
    }

    return 'Goal deleted';
  }),
};
