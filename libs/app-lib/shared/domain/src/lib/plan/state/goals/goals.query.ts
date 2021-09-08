import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';

import { GoalsState, GoalsStore } from './goals.store';

/**
 * Goals query
 *
 * @export
 * @class GoalsQuery
 * @extends {QueryEntity<GoalsState>}
 */
@Injectable({ providedIn: 'root' })
export class GoalsQuery extends QueryEntity<GoalsState> {
  constructor(protected store: GoalsStore) {
    super(store);
  }
}
