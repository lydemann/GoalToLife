import { Injectable } from '@angular/core';
import { combineQueries, HashMap, QueryEntity } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import {
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  GoalPeriodType,
} from '@app/shared/domain';
import { getMonthlyGoalPeriodKey } from '../../../goal-utils';
import { MONTH_PARAM_KEY, YEAR_PARAM_KEY } from '../../plan.constants';
import { GoalsQuery } from '../goals/goals.query';
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
  dailyGoalPeriods$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$!: Observable<boolean>;
  monthlyGoalPeriod$: Observable<GoalPeriod>;

  constructor(
    protected store: GoalPeriodsStore,
    private goalsQuery: GoalsQuery,
    routerQuery: RouterQuery
  ) {
    super(store);

    this.dailyGoalPeriods$ = combineQueries([
      this.selectAll().pipe(
        map((goalPeriods) =>
          goalPeriods.filter(
            (goalPeriod) => goalPeriod.type === GoalPeriodType.DAILY
          )
        )
      ),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([goalPeriods, goalEntities]) => {
        return this.getEnrichedGoalPeriods(goalPeriods, goalEntities);
      }),
      startWith({})
    );

    this.monthlyGoalPeriod$ = combineQueries([
      routerQuery.selectParams<string>(YEAR_PARAM_KEY),
      routerQuery.selectParams<string>(MONTH_PARAM_KEY),
      this.selectAll({ asObject: true }),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([year, month, goalPeriodsEntities, goalEntities]) => {
        const monthDateKey = getMonthlyGoalPeriodKey(+year, +month);
        const existingGoalPeriod = goalPeriodsEntities[monthDateKey];
        const currentMonthlyGoalPeriod = {
          goals: [],
          date: monthDateKey,
          type: GoalPeriodType.MONTHLY,
          ...existingGoalPeriod,
        } as GoalPeriodStore;

        return this.enrichGoalPeriod(currentMonthlyGoalPeriod, goalEntities);
      })
    );
  }

  private enrichGoalPeriod(
    goalPeriod: GoalPeriodStore,
    goalEntities: HashMap<Goal>
  ): GoalPeriod {
    return {
      ...goalPeriod,
      goals: goalPeriod?.goals?.map((goalId) => goalEntities[goalId]),
    };
  }

  private getEnrichedGoalPeriods(
    goalPeriods,
    goalEntities
  ): Record<string, GoalPeriod> {
    return goalPeriods.reduce(
      (prev, goalPeriod) => ({
        ...prev,
        [goalPeriod.date]: this.enrichGoalPeriod(goalPeriod, goalEntities),
      }),
      {}
    );
  }
}
