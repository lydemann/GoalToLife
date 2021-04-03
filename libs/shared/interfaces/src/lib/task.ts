import { Goal } from './goal';

/**
 * Represents a task
 * TODO: remove, everything is goals
 */
export interface Task extends Goal {
  id: string;
  name: string;
  subGoals: Goal[];
  categories: string[];
  completed: boolean;
  lastUpdated: Date;
  createdAt: Date;
}
