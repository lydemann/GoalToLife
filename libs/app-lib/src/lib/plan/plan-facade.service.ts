import { Injectable } from '@angular/core';
import { Goal, GoalPeriod } from '@app/shared/interfaces';
import { produce } from 'immer';
import { Observable } from 'rxjs';

import { PlanResourceService } from './resources/plan-resource.service';
import { PlanStateService } from './state/plan-state.service';

@Injectable({
  providedIn: 'root',
})
export class PlanFacadeService {
  monthlyCategories$: Observable<string[]>;
  goalPeriods$: Observable<Record<string, GoalPeriod>>;
  isLoadingGoalPeriods$: Observable<boolean>;

  constructor(
    private planResourceService: PlanResourceService,
    private planStateService: PlanStateService
  ) {
    this.goalPeriods$ = this.planStateService.goalPeriods$;
    this.isLoadingGoalPeriods$ = this.planStateService.isLoadingGoalPeriods$;
  }

  fetchMonthlyGoalPeriods(month: number, year: number) {
    this.planResourceService
      .getMonthlyGoalPeriods(month, year)
      .subscribe((goalPeriods) => {
        this.planStateService.setState({ goalPeriods });
      });
  }

  addGoal(goal: Goal) {
    const goalPeriods = this.planStateService.state.goalPeriods;
    const updatedGoalPeriods = produce(goalPeriods, (draft) => {
      const goalPeriod =
        draft[goal.scheduledDate] || ({ goals: [] } as GoalPeriod);
      draft[goal.scheduledDate] = {
        ...goalPeriod,
        goals: [...goalPeriod.goals, goal ],
      } as GoalPeriod;

      return draft;
    });
    this.planStateService.setState({
      goalPeriods: updatedGoalPeriods,
      isAddingGoal: true,
    });

    this.planResourceService.addGoal(goal).subscribe((newGoal) => {
      this.planStateService.setState({
        isAddingGoal: false,
      });
    });
  }

  deleteGoal(goal: Goal) {
    const goalPeriods = this.planStateService.state.goalPeriods;
    const updatedGoalPeriods = produce(goalPeriods, (draft) => {
      const goalPeriod =
        draft[goal.scheduledDate] || ({ goals: [] } as GoalPeriod);
      draft[goal.scheduledDate] = {
        ...goalPeriod,
        goals: goalPeriod.goals.filter(
          (existingGoal) => existingGoal.id !== goal.id
        ),
      } as GoalPeriod;

      return draft;
    });
    this.planStateService.setState({
      isDeletingGoal: true,
      goalPeriods: updatedGoalPeriods,
    });
    this.planResourceService.deleteGoal(goal).subscribe(() => {
      this.planStateService.setState({ isDeletingGoal: false });
    });
  }
}
