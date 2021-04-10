import { Goal } from '@app/shared/interfaces';
import { createSecureServer } from 'http2';

import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';

interface GoalsInput {
  scheduledDate: string;
}

export const goalQueryResolvers = {
  goal: createResolver<GoalsInput>(async (_, { scheduledDate }) => {
    // TODO: setup security
    const snapshot = await firestoreDB
      .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
      .where('scheduledDate', '==', scheduledDate)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Goal));
  }),
};

interface AddGoalInput {
  name: string;
  scheduledDate?: string;
}

interface DeleteGoalInput {
  id: string;
}
export const goalMutationResolvers = {
  addGoal: createResolver<AddGoalInput>(
    async (_, { name, scheduledDate = null }) => {
      // TODO: setup security
      const newGoalRef = firestoreDB
        .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
        .doc();

      const newGoal = {
        id: newGoalRef.id,
        name,
        scheduledDate,
      } as Goal;
      await newGoalRef.set(newGoal);

      return newGoal;
    }
  ),
  deleteGoal: createResolver<DeleteGoalInput>(async (_, { id }) => {
    await firestoreDB.doc(`/users/haOhlwjhAfRIOFGhHuJS/goals/${id}`).delete();
    return 'Deleted goal';
  }),
};
