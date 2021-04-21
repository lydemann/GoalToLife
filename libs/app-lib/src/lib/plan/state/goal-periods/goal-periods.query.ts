import { Injectable } from '@angular/core';
import { GoalPeriod } from '@app/shared/interfaces';
import * as akita from '@datorama/akita';
import { Observable } from 'rxjs';

import { GoalPeriodsState } from './goal-periods.model';
import { GoalPeriodsStore } from './goal-periods.store';

/**
 * GoalPeriods query
 *
 * @export
 * @class GoalPeriodsQuery
 * @extends {QueryEntity<GoalPeriodsState>}
 */
@Injectable({ providedIn: 'root' })
export class GoalPeriodsQuery extends akita.QueryEntity<
  GoalPeriodsState,
  GoalPeriod
> {
  entities$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$: Observable<boolean>;

  constructor(protected store: GoalPeriodsStore) {
    super(store);
    this.entities$ = this.select((state) => state.entities);
  }
}
