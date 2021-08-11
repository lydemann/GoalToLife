import { Injectable } from '@angular/core';
import { Goal, GoalPeriod, GoalPeriodStore } from '@app/shared/domain';
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

  addGoalPeriod(goalPeriod: OrArray<GoalPeriod>) {
    let goals: Goal[] = [];

    if (goalPeriod instanceof Array) {
      // TODO: handle nested goals
      goals = goalPeriod.reduce((prev, cur) => [...prev, ...cur.goals], []);
      const goalPeriodStore = goalPeriod.map((goalP) => ({
        ...goalP,
        goals: goalP.goals.map((goal) => goal.id),
      }));
      super.set(goalPeriodStore);
    } else {
      goals = [...goalPeriod.goals];
      super.add({
        ...goalPeriod,
        goals: goals.map((goal) => goal.id),
      });
    }

    this.goalsStore.upsertMany(goals);
  }

  addGoal(goal: Goal) {
    const goalPeriod =
      this.getValue().entities[goal.scheduledDate] ||
      ({
        goals: [],
        date: goal.scheduledDate,
        type: goal.type,
      } as GoalPeriodStore);
    const updatedGoalPeriod = produce(goalPeriod, (draft) => {
      draft.goals = [...draft.goals, goal.id];
      return draft;
    });
    this.upsert(goalPeriod.date, updatedGoalPeriod);
    this.goalsStore.add(goal);
  }

  deleteGoal(goal: Goal) {
    const updatedGoals = this.getValue().entities[
      goal.scheduledDate
    ]?.goals.filter((goalId) => goalId !== goal.id);
    this.update(goal.scheduledDate, { goals: updatedGoals });
    this.goalsStore.remove(goal.id);
  }
}
