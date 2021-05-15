import { EntityState } from '@datorama/akita';

import { Goal, GoalPeriodStore } from '@app/shared/interfaces';

export interface PlanState {
  goalsState: EntityState<Goal>;
  isAddingGoal: boolean;
  isUpdatingGoal: boolean;
  isLoadingGoalPeriods: boolean;
  isAddingTask: boolean;
  isDeletingGoal: boolean;
  goalPeriods: Record<string, GoalPeriodStore>;
}
