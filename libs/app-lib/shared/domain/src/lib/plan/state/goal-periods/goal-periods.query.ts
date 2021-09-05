import { Injectable } from '@angular/core';
import { combineQueries, HashMap, QueryEntity } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  GoalPeriodType,
} from '@app/shared/domain';
import {
  getMonthlyGoalPeriodKey,
  getQuarterlyGoalPeriodKey,
  getYearlyGoalPeriodKey,
} from '@app/shared/util';
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
  goalPeriodEntities$: Observable<Record<string, GoalPeriod>>;
  goalPeriods$: Observable<GoalPeriod[]>;
  isLoadingGoalPeriods$!: Observable<boolean>;
  monthlyGoalPeriod$: Observable<GoalPeriod>;
  currentYearGoalPeriod$: Observable<GoalPeriod>;
  quarterGoalPeriods$: Observable<GoalPeriod[]>;
  goalPeriodsWithFilteredGoals$!: Observable<Record<string, GoalPeriod>>;
  categories$: Observable<string[]>;

  constructor(
    protected store: GoalPeriodsStore,
    private goalsQuery: GoalsQuery,
    routerQuery: RouterQuery
  ) {
    super(store);

    this.goalPeriodEntities$ = combineQueries([
      this.selectAll(),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([goalPeriods, goalEntities]) => {
        return this.getEnrichedGoalPeriods(goalPeriods, goalEntities);
      }),
      filter((goalPeriods) => !!goalPeriods)
    );

    this.goalPeriods$ = this.goalPeriodEntities$.pipe(
      map((goalPeriodEntities) => {
        const ids = this.getValue().ids || [];
        return ids.map((id) => goalPeriodEntities[id]);
      })
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
            ...this.enrichGoalPeriod(
              currentMonthlyGoalPeriod,
              goalEntities as any
            ),
            calendarDate: this.getFirstDateInQuarter(+year, +quarter),
          };
        });
      })
    );

    this.categories$ = this.goalPeriods$.pipe(
      map((goalPeriods) => {
        const categories = goalPeriods
          .reduce((prevTotalCategories: string[], cur) => {
            const categoriesForGoalPeriod = cur.goals.reduce(
              (prev: string[], cur) => [...prev, ...(cur.categories || [])],
              []
            );

            return [...prevTotalCategories, ...categoriesForGoalPeriod];
          }, [])
          .filter((category) => !!category);

        return [...new Set(categories)];
      })
    );

    this.goalPeriodsWithFilteredGoals$ = combineQueries([
      this.goalPeriodEntities$,
      this.select((state) => state.filteredCategories),
      this.categories$,
    ]).pipe(
      map(([goalPeriodEntities, filteredCategories, categories]) => {
        const filteredGoalPeriodEntities: Record<string, GoalPeriod> = {};
        for (const key in goalPeriodEntities) {
          if (Object.prototype.hasOwnProperty.call(goalPeriodEntities, key)) {
            const goalPeriod = goalPeriodEntities[key];
            if (
              filteredCategories?.length > 0 &&
              categories.length !== filteredCategories.length
            ) {
              const goals = goalPeriod.goals.filter((goal) =>
                goal.categories?.some((category) =>
                  filteredCategories.includes(category)
                )
              );
              filteredGoalPeriodEntities[goalPeriod.date] = {
                ...goalPeriod,
                goals,
              };
            } else {
              filteredGoalPeriodEntities[goalPeriod.date] = goalPeriod;
            }
          }
        }
        return filteredGoalPeriodEntities;
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
    goalPeriods: GoalPeriodStore[],
    goalEntities: Record<string, Goal>
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
