import {
  goalMutationSchema,
  goalQuerySchema,
  goalSchema,
} from './goal-period/goal-period.schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    ${goalQuerySchema}
  }
  type Mutation {
    ${goalMutationSchema}
  }
`;

export const typeDefs = [schema, goalSchema];
