import { Injectable } from '@angular/core';
import { GoalPeriod, GoalPeriodStore } from '@app/shared/interfaces';
import { combineQueries, QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { GoalsQuery } from '../goals/goals.query';
import { GoalsStore } from '../goals/goals.store';
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
export class GoalPeriodsQuery extends QueryEntity<
  GoalPeriodsState,
  GoalPeriodStore
> {
  entities$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$: Observable<boolean>;

  constructor(
    protected store: GoalPeriodsStore,
    private goalsQuery: GoalsQuery
  ) {
    super(store);

    this.entities$ = combineQueries([
      this.selectAll(),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([goalPeriods, goalEntities]) => {
        return goalPeriods.reduce(
          (prev, goalPeriod) => ({
            ...prev,
            [goalPeriod.date]: {
              ...goalPeriod,
              goals: goalPeriod.goals.map((goalId) => goalEntities[goalId]),
            },
          }),
          {}
        );
      }),
      startWith({})
    );
  }
}
