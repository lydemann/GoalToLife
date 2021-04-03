export enum GoalType {
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  SUBTASK = 'SUBTASK',
}

/**
 * Represents a goal for eg. a year, quarter, month or week
 */
export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  subGoals: Goal[];
  categories: string[];
  scheduledDate?: string; // eg. 2021, 2021/q2, 2021/04, 2021/w13, 2021/04/04
  parentGoal: Goal;
  completed: boolean;
  lastUpdated: Date;
  createdAt: Date;
}
