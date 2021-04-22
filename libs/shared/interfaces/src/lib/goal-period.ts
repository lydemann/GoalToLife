import { Goal } from './goal';

export enum GoalPeriodType {
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY',
  DAILY = 'DAILY',
  SUBTASK = 'SUBTASK',
}

/*
    A task period represents tasks over a period: eg. week, month, quarter or year
*/
export interface GoalPeriod extends Omit<GoalPeriodStore, 'goals'> {
  goals: Goal[];
}

export interface GoalPeriodStore {
  date: string;
  goals: string[];
  type: GoalPeriodType;
  wins: string;
  improvementPoints: string;
  obtainedKnowledge: string;
  thoughts: string;
}
