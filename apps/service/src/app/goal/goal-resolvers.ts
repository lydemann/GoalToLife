import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import admin from 'firebase-admin';

import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';

interface GoalPeriodFirebase extends Omit<GoalPeriod, 'goals'> {
  goals: string[];
}

interface GoalsInput {
  scheduledDate: string;
}

const enrichGoalSummary = async (
  goalSummary: GoalPeriodFirebase
): Promise<GoalPeriod> => {
  const goalsPromises = goalSummary.goals.map((goalId) => {
    return (firestoreDB
      .doc(`/users/haOhlwjhAfRIOFGhHuJS/goals/${goalId}`)
      .get() as unknown) as Promise<Goal>;
  });
  const goals = await Promise.all(goalsPromises);
  return {
    ...goalSummary,
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
  // TODO: name goalPeriods
  dailySummaries: createResolver<DailySummariesInput>(
    async (_, { fromDate, toDate }) => {
      const goalSummariesSnapshot = await firestoreDB
        .collection('/users/haOhlwjhAfRIOFGhHuJS/goalSummaries')
        // TODO: get for type
        .where('date', '<=', toDate)
        .where('date', '>=', fromDate)
        .get();

      const goalSummariesFirebase = goalSummariesSnapshot.docs.map(
        (doc) => doc.data() as GoalPeriodFirebase
      );
      const goalSummaries = await Promise.all(
        goalSummariesFirebase.map(async (goalSummary) => {
          return enrichGoalSummary(goalSummary);
        })
      );

      return goalSummaries;
    }
  ),
};

interface AddGoalInput {
  name: string;
  type: GoalPeriodType;
  scheduledDate?: string;
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
  addGoal: createResolver<AddGoalInput>(
    async (_, { name, type, scheduledDate = null, goalIndex = null }) => {
      // TODO: setup security
      const newGoalRef = firestoreDB
        .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
        .doc();
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
          ({ goals: [] } as GoalPeriodFirebase);
        const prevGoals = prevGoalPeriod.goals;
        let updatedGoals = [...prevGoals];
        if (
          goalIndex !== undefined &&
          goalIndex >= 0 &&
          goalIndex <= prevGoals.length
        ) {
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
