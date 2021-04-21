import { Injectable } from '@angular/core';
import { Goal, GoalPeriod } from '@app/shared/interfaces';
import { EntityStore, OrArray, StoreConfig } from '@datorama/akita';
import produce from 'immer';

import { GoalsStore } from '../goals/goals.store';
import { GoalPeriodsState } from './goal-periods.model';

/**
 * Create initial state
 */
export function createInitialState(): GoalPeriodsState {
  return {};
}

/**
 * GoalPeriods store
 *
 * @export
 * @class GoalPeriodsStore
 * @extends {EntityStore<GoalPeriodsState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'goal-periods', idKey: 'date' })
export class GoalPeriodsStore extends EntityStore<GoalPeriodsState> {
  constructor(private goalsStore: GoalsStore) {
    super(createInitialState());
  }

  add(goalPeriod: OrArray<GoalPeriod>) {
    super.add(goalPeriod);

    let goals = [];

    if (goalPeriod instanceof Array) {
      // TODO: handle nested goals
      goals = goalPeriod.reduce((prev, cur) => [...prev, ...cur.goals], []);
    } else {
      goals = [...goalPeriod.goals];
    }

    this.goalsStore.upsertMany(goals);
  }

  addGoal(goal: Goal) {
    const goalPeriod = this.getValue().entities[goal.scheduledDate];
    const updatedGoalPeriod = produce(goalPeriod, (draft) => {
      draft.goals.push(goal);
      return draft;
    });
    this.update(goalPeriod.date, updatedGoalPeriod);
    this.goalsStore.add(goal);
  }

  deleteGoal(goal: Goal) {
    const updatedGoals = this.getValue().entities[
      goal.scheduledDate
    ]?.goals.filter((goalStore) => goalStore.id !== goal.id);
    this.update(goal.scheduledDate, { goals: updatedGoals });
    this.goalsStore.remove(goal.id);
  }
}
