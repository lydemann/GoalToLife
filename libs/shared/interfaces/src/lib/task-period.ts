import { Task } from './task';

export interface TaskPeriod {
    date: Date;
    tasks: Task[];
    wins: string[];
    improvementPoints: string[];
    obtainedKnowledge: string[];
    thoughts: string[];
}
