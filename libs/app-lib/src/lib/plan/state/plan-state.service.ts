// import { Injectable } from '@angular/core';
// import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
// import { BehaviorSubject } from 'rxjs';
// import { map } from 'rxjs/operators';

// import { initialEntityState } from './entity-state.model';
// import { PlanState } from './plan-state.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class PlanStateService {
//   private stateSubject = new BehaviorSubject<PlanState>({
//     goalPeriods: {},
//     isAddingGoal: false,
//     isUpdatingGoal: false,
//     goalsState: initialEntityState,
//     isAddingTask: false,
//     isLoadingGoalPeriods: false,
//     isDeletingGoal: false
//   });
//   state$ = this.stateSubject.asObservable();

//   get state() {
//     return this.stateSubject.value;
//   };

//   isAddingGoal$ = this.state$.pipe(map((state) => state.isAddingGoal));
//   goalPeriods$ = this.state$.pipe(map((state) => {
//     const goalPeriods: Record<string, GoalPeriod> = {};
//     for (const goalPeriodId in state.goalPeriods) {
//       if (Object.prototype.hasOwnProperty.call(state.goalPeriods, goalPeriodId)) {
//         const goalPeriod = state.goalPeriods[goalPeriodId];

//         const hydratedGoalPeriod = {
//           ...goalPeriod,
//           goals: goalPeriod.goals.map((goalId) => state.goalsState.entities[goalId]).filter((goal) => !!goal)
//         } as GoalPeriod
//         goalPeriods[goalPeriodId] = hydratedGoalPeriod;
//       }
//     }
//   }));
//   isLoadingGoalPeriods$ = this.state$.pipe(map((state) => state.isLoadingGoalPeriods));

//   constructor() {}

//   addGoal(goal: Goal) {
//     const updatedGoalsState = upsertEntity(goal, this.state.goalsState);
//   }

//   setState(state: Partial<PlanState>) {
//     this.stateSubject.next({
//       ...this.stateSubject.value,
//       ...state,
//     });
//   }
// }
