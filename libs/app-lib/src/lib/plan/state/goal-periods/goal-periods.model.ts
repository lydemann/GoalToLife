import { GoalPeriod } from '@app/shared/interfaces';
import { EntityState } from '@datorama/akita';

/**
 * GoalPeriods state
 *
 * @export
 * @interface GoalPeriodsState
 */
export interface GoalPeriodsState extends EntityState<GoalPeriod, string> {}
