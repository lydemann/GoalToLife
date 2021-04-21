import { gql } from 'apollo-server-express';

export const goalSchema = gql`
  type Goal {
    id: ID
    name: String
    scheduledDate: String
    type: String
    completed: Boolean
  }

  type GoalPeriod {
    date: String
    goals: [Goal]
  }
`;

export const goalQuerySchema = `
    goal(scheduledDate: String): [Goal]
    goalPeriod(fromDate: String, toDate: String): [GoalPeriod]
`;

export const goalMutationSchema = `
  addGoal(id: String!, name: String!, type: String!, scheduledDate: String, goalIndex: Int): Goal
  updateGoal(id: String!, name: String, type: String, scheduledDate: String, goalIndex: Int, completed: Boolean): Goal
  deleteGoal(id: String!): String
`;
