import { GoalPeriodStore } from '@app/shared/domain';
import { EntityState } from '@datorama/akita';

/**
 * GoalPeriods state
 *
 * @export
 * @interface GoalPeriodsState
 */
export interface GoalPeriodsState
  extends EntityState<GoalPeriodStore, string> {}
