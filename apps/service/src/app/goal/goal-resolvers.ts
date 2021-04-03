import { createResolver } from '../utils/create-resolver';
import { firestoreDB } from '../firestore';

interface GoalsInput {
  scheduledDate: string;
}

export const goalQueryResolvers = {
  goals: createResolver<GoalsInput>(async (_, { scheduledDate }) => {
    const snapshot = await firestoreDB
      .collection('/users/haOhlwjhAfRIOFGhHuJS/goals')
      .where('scheduledDate', '==', scheduledDate)
      .get();

    return snapshot.docs.map((doc) => doc.data());
  }),
};
