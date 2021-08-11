import { GoalPeriodStore } from '@app/shared/domain';
import { EntityState } from '@datorama/akita';

/**
 * GoalPeriods state
 *
 * @export
 * @interface GoalPeriodsState
 */
export type GoalPeriodsState = EntityState<GoalPeriodStore, string>;
