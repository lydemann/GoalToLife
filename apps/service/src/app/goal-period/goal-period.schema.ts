import { gql } from 'apollo-server-express';

export const goalSchema = gql`
  type Goal {
    id: ID
    name: String
    scheduledDate: String
    type: String
    completed: Boolean
    categories: [String]
  }

  type GoalPeriod {
    date: String
    goals: [Goal]
    type: String
    wins: String
    improvementPoints: String
    obtainedKnowledge: String
    thoughts: String
  }
`;

export const goalQuerySchema = `
    goal(scheduledDate: String): [Goal]
    goalPeriod(fromDate: String, toDate: String, dates: [String]): [GoalPeriod]
    inboxGoals: [Goal]
`;

export const goalMutationSchema = `
  updateGoalPeriod(
    date: String,
    type: String,
    wins: String,
    improvementPoints: String,
    obtainedKnowledge: String,
    thoughts: String
  ): GoalPeriod

  addGoal(id: String!, name: String!, type: String!, scheduledDate: String, goalIndex: Int): Goal
  updateGoal(id: String!, name: String, type: String, scheduledDate: String, goalIndex: Int, completed: Boolean, categories: [String]): Goal
  deleteGoal(id: String!, scheduledDate: String): String
`;
