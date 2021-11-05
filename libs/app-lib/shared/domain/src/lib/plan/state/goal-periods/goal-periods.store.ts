import { Injectable } from '@angular/core';
import { Goal, GoalPeriod, GoalPeriodStore } from '@app/shared/domain';
import {
  arrayAdd,
  arrayRemove,
  EntityStore,
  OrArray,
  StoreConfig,
} from '@datorama/akita';
import produce from 'immer';

import { GoalsStore } from '../goals/goals.store';
import { GoalPeriodsState } from './goal-periods.model';

/**
 * Create initial state
 */
export function createInitialState(): GoalPeriodsState {
  return {
    filteredCategories: [],
  };
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
      super.upsertMany(goalPeriodStore);
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

  setFilteredCategories(categories: string[]) {
    this.update({ filteredCategories: categories });
  }

  moveGoal(orgGoalPeriodId: string, destGoalPeriodId: string, goalId: string) {
    const entities = this.getValue().entities;
    const orgGoals = entities[orgGoalPeriodId]?.goals || [];
    const orgUpdatedGoals = arrayRemove(orgGoals, [goalId]);
    this.update(orgGoalPeriodId, (entity) => ({
      ...entity,
      goals: orgUpdatedGoals,
    }));

    const destGoals = entities[destGoalPeriodId]?.goals || [];
    const destUpdatedGoals = arrayAdd(destGoals, [goalId]);
    this.update(orgGoalPeriodId, (entity) => ({
      ...entity,
      date: destGoalPeriodId,
      goals: destUpdatedGoals,
    }));

    this.goalsStore.update(
      goalId,
      (entity) => ({ ...entity, scheduledDate: destGoalPeriodId } as Goal)
    );
  }
}
