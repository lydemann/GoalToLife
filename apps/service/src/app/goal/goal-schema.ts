import { gql } from 'apollo-server-express';

export const goalSchema = gql`
  type Goal {
    id: ID
    name: String
    scheduledDate: String
    type: String
    completed: Boolean
  }

  type GoalSummary {
    date: String
    goals: [Goal]
  }
`;

export const goalQuerySchema = `
    goal(scheduledDate: String): [Goal]
    dailySummaries(month: Int, fromDate: String, toDate: String): [GoalSummary]
`;

export const goalMutationSchema = `
  addGoal(name: String!, type: String!, scheduledDate: String, goalIndex: Int): Goal
  deleteGoal(id: String!): String
`;
