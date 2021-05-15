import {
  goalMutationResolvers,
  goalQueryResolvers,
} from './goal-period/goal-period.resolvers';

export const resolvers = {
  Query: {
    ...goalQueryResolvers,
  },
  Mutation: {
    ...goalMutationResolvers,
  },
};
