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
} from '@app/shared/interfaces';
import {
  getMonthlyGoalPeriodKey,
  getQuarterlyGoalPeriodKey,
  getYearlyGoalPeriodKey,
} from '@app/shared/utils';
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
  goalPeriods: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$: Observable<boolean>;
  monthlyGoalPeriod$: Observable<GoalPeriod>;
  currentYearGoalPeriod$: Observable<GoalPeriod>;
  quarterGoalPeriods$: Observable<GoalPeriod[]>;

  constructor(
    protected store: GoalPeriodsStore,
    private goalsQuery: GoalsQuery,
    routerQuery: RouterQuery
  ) {
    super(store);

    this.goalPeriods = combineQueries([
      this.selectAll(),
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

    this.currentYearGoalPeriod$ = combineQueries([
      routerQuery.selectParams<string>(YEAR_PARAM_KEY),
      this.selectAll({ asObject: true }),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([year, goalPeriodsEntities, goalEntities]) => {
        const yearDateKey = getYearlyGoalPeriodKey(+year);
        const existingGoalPeriod = goalPeriodsEntities[yearDateKey];
        const currentMonthlyGoalPeriod = {
          goals: [],
          date: yearDateKey,
          type: GoalPeriodType.YEARLY,
          ...existingGoalPeriod,
        } as GoalPeriodStore;

        return this.enrichGoalPeriod(currentMonthlyGoalPeriod, goalEntities);
      })
    );

    this.quarterGoalPeriods$ = combineQueries([
      routerQuery.selectParams<string>(YEAR_PARAM_KEY),
      this.selectAll({ asObject: true }),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([year, goalPeriodsEntities, goalEntities]) => {
        const quarterDateKeys = [1, 2, 3, 4].map((quarter) => [
          getQuarterlyGoalPeriodKey(+year, quarter),
          quarter,
        ]);
        return quarterDateKeys.map(([quarterDateKey, quarter]) => {
          const existingGoalPeriod = goalPeriodsEntities[quarterDateKey];
          const currentMonthlyGoalPeriod = {
            goals: [],
            date: quarterDateKey,
            type: GoalPeriodType.QUARTERLY,
            ...existingGoalPeriod,
          } as GoalPeriodStore;

          return {
            ...this.enrichGoalPeriod(currentMonthlyGoalPeriod, goalEntities),
            calendarDate: this.getFirstDateInQuarter(+year, +quarter),
          };
        });
      })
    );
  }

  private getFirstDateInQuarter(year: number, quarter: number) {
    const month = (quarter - 1) * 3;
    return new Date(year, month, 1);
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
