import { Injectable } from '@angular/core';
import { Goal, GoalPeriod, GoalPeriodStore } from '@app/shared/interfaces';
import { produce } from 'immer';
import { Observable } from 'rxjs';

import { PlanResourceService } from './resource/plan-resource.service';
import { GoalPeriodsQuery } from './state/goal-periods/goal-periods.query';
import { GoalPeriodsStore } from './state/goal-periods/goal-periods.store';
import { GoalsQuery } from './state/goals/goals.query';
import { GoalsStore } from './state/goals/goals.store';

@Injectable({
  providedIn: 'root',
})
export class PlanFacadeService {
  monthlyCategories$: Observable<string[]>;
  goalPeriods$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$: Observable<boolean>;

  constructor(
    private planResourceService: PlanResourceService,
    private goalsStore: GoalsStore,
    private goalPeriodsStore: GoalPeriodsStore,
    private goalPeriodsQuery: GoalPeriodsQuery
  ) {
    this.goalPeriods$ = this.goalPeriodsQuery.select((state) => state.entities);
    this.isLoadingGoalPeriods$ = this.goalPeriodsQuery.selectLoading();
  }

  fetchMonthlyGoalPeriods(month: number, year: number) {
    this.goalPeriodsStore.setLoading(true);
    this.planResourceService
      .getMonthlyGoalPeriods(month, year)
      .subscribe(({ data }) => {
        this.goalPeriodsStore.add(data.goalPeriod);
        this.goalPeriodsStore.setLoading(false);
      });
  }

  addGoal(goal: Goal) {
    this.goalPeriodsStore.addGoal(goal);
    this.planResourceService.addGoal(goal).subscribe(({ errors, data }) => {
      if (!!errors) {
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  updateGoal(goal: Goal) {
    this.goalsStore.upsert(goal.id, goal);
    this.planResourceService.updateGoal(goal).subscribe(({ errors, data }) => {
      if (!!errors) {
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  deleteGoal(goal: Goal) {
    this.goalPeriodsStore.deleteGoal(goal);
    this.planResourceService.deleteGoal(goal).subscribe(({ errors }) => {
      if (!!errors) {
        // TODO: revert
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }
}
