import { Task } from './task';

export interface Day {
    date: Date;
    tasks: Task[];
    wins: string[];
    improvementPoints: string[];
    obtainedKnowledge: string[];
    thoughts: string[];
}
