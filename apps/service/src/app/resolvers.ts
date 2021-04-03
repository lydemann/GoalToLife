import { goalQueryResolvers } from './goal/goal-resolvers';

export const resolvers = {
  Query: {
    ...goalQueryResolvers,
  },
  // Mutation: {},
};
