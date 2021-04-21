import {
  goalMutationResolvers,
  goalQueryResolvers,
} from './goal/goal-resolvers';

export const resolvers = {
  Query: {
    ...goalQueryResolvers,
  },
  Mutation: {
    ...goalMutationResolvers,
  },
};
