import { Injectable } from '@angular/core';
import { combineQueries, Query } from '@datorama/akita';
import { map, startWith } from 'rxjs/operators';
import { GoalsQuery } from '../../plan/state/goals/goals.query';
import { GoalsStore } from '../../plan/state/goals/goals.store';
import { InboxState } from './inbox.model';
import { InboxStore } from './inbox.store';

/**
 * Inbox query
 *
 * @export
 * @class InboxQuery
 * @extends {Query<InboxState>}
 */
@Injectable({ providedIn: 'root' })
export class InboxQuery extends Query<InboxState> {
  constructor(protected store: InboxStore, private goalsQuery: GoalsQuery) {
    super(store);
  }

  selectInboxGoals() {
    return combineQueries([
      this.select((state) => state.inboxGoalIds),
      this.goalsQuery.select((state) => state.entities),
    ]).pipe(
      map(([inboxGoalIds, goalEntities = {}]) => {
        const goals = inboxGoalIds.map(
          (inboxGoalId) => goalEntities[inboxGoalId]
        );
        return goals.filter((goal) => !goal?.scheduledDate);
      }),
      startWith([])
    );
  }
}
