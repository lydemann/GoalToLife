import { gql } from 'apollo-server-express';

export const goalSchema = gql`
  type Goal {
    id: ID
    name: String
    scheduledDate: String
    type: String
    completed: Boolean
  }
`;

export const goalQuerySchema = `
    goal(scheduledDate: String): [Goal]
`;

export const goalMutationSchema = `
  addGoal(name: String!, scheduledDate: String): Goal
  deleteGoal(id: String!): String
`;
