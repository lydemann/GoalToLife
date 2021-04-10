import { Goal } from '@app/shared/interfaces';

import { firestoreDB } from '../firestore';
import { createResolver } from '../utils/create-resolver';

interface GoalsInput {
  scheduledDate: string;
}

export const goalQueryResolvers = {
  goals: createResolver<GoalsInput>(async (_, { scheduledDate }) => {
    const snapshot = await firestoreDB
      .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
      .where('scheduledDate', '==', scheduledDate)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Goal));
  }),
};
