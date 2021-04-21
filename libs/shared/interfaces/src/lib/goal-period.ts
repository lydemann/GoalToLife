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
export interface GoalPeriod {
  date: string;
  goals: Goal[];
  wins: string[];
  type: GoalPeriodType;
  improvementPoints: string[];
  obtainedKnowledge: string[];
  thoughts: string[];
}

export interface GoalPeriodStore {
  date: string;
  goals: string[];
  wins: string[];
  type: GoalPeriodType;
  improvementPoints: string[];
  obtainedKnowledge: string[];
  thoughts: string[];
}
