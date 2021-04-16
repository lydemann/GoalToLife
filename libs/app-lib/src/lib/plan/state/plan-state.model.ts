import { GoalPeriod } from '@app/shared/interfaces';

export interface PlanState {
  isAddingGoal: boolean;
  isLoadingGoalPeriods: boolean;
  isAddingTask: boolean;
  isDeletingGoal: boolean;
  goalPeriods: Record<string, GoalPeriod>;
}
