import { gql } from 'apollo-server-express';
import {
  goalMutationSchema,
  goalQuerySchema,
  goalSchema,
} from './goal-period/goal-period.schema';

const schema = gql`
  type Query {
    ${goalQuerySchema}
  }
  type Mutation {
    ${goalMutationSchema}
  }
`;

export const typeDefs = [schema, goalSchema];
