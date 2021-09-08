import { EntityState } from '@datorama/akita';

import { Goal, GoalPeriodStore } from '@app/shared/domain';

export interface PlanState {
  goalsState: EntityState<Goal>;
  isAddingGoal: boolean;
  isUpdatingGoal: boolean;
  isLoadingGoalPeriods: boolean;
  isAddingTask: boolean;
  isDeletingGoal: boolean;
  goalPeriods: Record<string, GoalPeriodStore>;
}
