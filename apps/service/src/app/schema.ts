import { goalQuerySchema, goalSchema } from './goal/goal-schema';

const { gql } = require('apollo-server-express');

const schema = gql`
  type Query {
    ${goalQuerySchema}
  }
`;

export const typeDefs = [schema, goalSchema];
