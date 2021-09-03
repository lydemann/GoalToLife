import { Injectable } from '@angular/core';
import { combineQueries, StateHistoryPlugin } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Goal, GoalPeriod, GoalPeriodStore } from '@app/shared/domain';
import { PlanResourceService } from './resource/plan-resource.service';
import { GoalPeriodsState } from './state/goal-periods/goal-periods.model';
import { GoalPeriodsQuery } from './state/goal-periods/goal-periods.query';
import { GoalPeriodsStore } from './state/goal-periods/goal-periods.store';
import { GoalsQuery } from './state/goals/goals.query';
import { GoalsStore } from './state/goals/goals.store';

@Injectable({
  providedIn: 'root',
})
export class PlanFacadeService {
  monthlyCategories$!: Observable<string[]>;
  goalPeriods$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$!: Observable<boolean>;
  goalPeriodsStateHistory: StateHistoryPlugin<GoalPeriodsState>;
  isLoading$: Observable<boolean>;
  currentMonthGoalPeriod$: Observable<GoalPeriod>;
  currentYearGoalPeriod$: Observable<GoalPeriod>;
  quarterGoalPeriods$: Observable<GoalPeriod[]>;

  constructor(
    private planResourceService: PlanResourceService,
    private goalsStore: GoalsStore,
    private goalPeriodsStore: GoalPeriodsStore,
    private goalPeriodsQuery: GoalPeriodsQuery,
    private goalsQuery: GoalsQuery
  ) {
    this.goalPeriods$ = this.goalPeriodsQuery.goalPeriodEntities$;
    this.isLoading$ = combineQueries([
      this.goalPeriodsQuery.selectLoading(),
      this.goalsQuery.selectLoading(),
    ]).pipe(
      map(
        ([goalPeriodsLoading, goalsIsLoading]) =>
          goalPeriodsLoading || goalsIsLoading
      )
    );
    this.goalPeriodsStateHistory = new StateHistoryPlugin(
      this.goalPeriodsQuery
    );
    this.currentMonthGoalPeriod$ = this.goalPeriodsQuery.monthlyGoalPeriod$;
    this.currentYearGoalPeriod$ = this.goalPeriodsQuery.currentYearGoalPeriod$;
    this.quarterGoalPeriods$ = this.goalPeriodsQuery.quarterGoalPeriods$;

    this.monthlyCategories$ = this.goalPeriodsQuery.goalPeriods$.pipe(
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
  }

  fetchYearlyAndQuarterlyGoalPeriods(year: number) {
    this.goalPeriodsStore.setLoading(true);
    this.planResourceService
      .getYearlyGoalPeriods(year)
      .subscribe(({ data }) => {
        this.goalPeriodsStore.setLoading(false);
        this.goalPeriodsStore.addGoalPeriod(data.goalPeriod);
      });
  }

  fetchMonthlyGoalPeriods(month: number, year: number) {
    this.goalPeriodsStore.setLoading(true);
    this.planResourceService
      .getMonthlyGoalPeriods(month, year)
      .subscribe(({ data }) => {
        this.goalPeriodsStore.setLoading(false);
        this.goalPeriodsStore.addGoalPeriod(data.goalPeriod);
      });
  }

  addGoal(goal: Goal) {
    this.goalPeriodsStore.addGoal(goal);
    this.goalsStore.setLoading(true);
    this.planResourceService.addGoal(goal).subscribe(({ errors }) => {
      this.goalsStore.setLoading(false);
      if (errors) {
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  updateGoalPeriod(goalPeriod: Partial<GoalPeriod>) {
    this.goalPeriodsStore.upsert(
      goalPeriod.date as string,
      {
        goals: [],
        ...this.goalPeriodsQuery.getEntity(goalPeriod.date as string),
        ...goalPeriod,
      } as GoalPeriodStore
    );
    this.goalPeriodsStore.setLoading(true);
    this.planResourceService
      .updateGoalPeriod(goalPeriod as unknown as GoalPeriodStore)
      .subscribe(({ errors }) => {
        if (errors) {
          this.goalPeriodsStateHistory.undo();
          this.goalPeriodsStore.setError(errors[0]);
          this.goalPeriodsStore.setLoading(false);
          return;
        }
        this.goalPeriodsStore.setLoading(false);
      });
  }

  updateGoal(goal: Goal) {
    this.goalsStore.upsert(goal.id, goal);
    this.planResourceService.updateGoal(goal).subscribe(({ errors }) => {
      if (errors) {
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  deleteGoal(goal: Goal) {
    this.goalPeriodsStore.deleteGoal(goal);
    this.planResourceService.deleteGoal(goal).subscribe(({ errors }) => {
      if (errors) {
        // TODO: revert
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }
}
