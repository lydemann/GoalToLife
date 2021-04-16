import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlanState } from './plan-state.model';

@Injectable({
  providedIn: 'root',
})
export class PlanStateService {
  private stateSubject = new BehaviorSubject<PlanState>({
    goalPeriods: {},
    isAddingGoal: false,
    isAddingTask: false,
    isLoadingGoalPeriods: false,
    isDeletingGoal: false
  });
  state$ = this.stateSubject.asObservable();

  get state() {
    return this.stateSubject.value;
  };

  isAddingGoal$ = this.state$.pipe(map((state) => state.isAddingGoal));
  goalPeriods$ = this.state$.pipe(map((state) => state.goalPeriods));
  isLoadingGoalPeriods$ = this.state$.pipe(map((state) => state.isLoadingGoalPeriods));

  constructor() {}

  setState(state: Partial<PlanState>) {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...state,
    });
  }
}
