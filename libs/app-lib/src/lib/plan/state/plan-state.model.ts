import { Goal, GoalPeriodStore } from '@app/shared/interfaces';

import { EntityState } from './entity-state.model';

export interface PlanState {
  goalsState: EntityState<Goal>;
  isAddingGoal: boolean;
  isUpdatingGoal: boolean;
  isLoadingGoalPeriods: boolean;
  isAddingTask: boolean;
  isDeletingGoal: boolean;
  goalPeriods: Record<string, GoalPeriodStore>;
}
