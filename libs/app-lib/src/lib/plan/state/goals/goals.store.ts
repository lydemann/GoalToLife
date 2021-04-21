import { Injectable } from '@angular/core';
import { Goal } from '@app/shared/interfaces';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

/**
 * Goals entity state
 *
 * @export
 * @interface GoalsState
 * @extends {EntityState<Goals, string>}
 */
export interface GoalsState extends EntityState<Goal, string> {
  isDeletingGoals: boolean;
}

/**
 * Goals entity store
 *
 * @export
 * @class GoalsStore
 * @extends {Store<GoalsState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'goals' })
export class GoalsStore extends EntityStore<GoalsState> {
  constructor() {
    super();
  }
}
