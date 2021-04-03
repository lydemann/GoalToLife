import { Goal } from './goal';

/*
    A task period represents tasks over a period: eg. week, month, quarter or year
*/
export interface TaskPeriod {
  date: Date;
  goals: Goal[];
  wins: string[];
  improvementPoints: string[];
  obtainedKnowledge: string[];
  thoughts: string[];
}
