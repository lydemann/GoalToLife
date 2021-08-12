import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Goal } from '@app/shared/domain';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { arrayAdd, arrayRemove, StateHistoryPlugin } from '@datorama/akita';
import { GoalsStore } from '../plan/state/goals/goals.store';
import { PlanResourceService } from '../plan/resource/plan-resource.service';
import { GoalsQuery } from '../plan/state/goals/goals.query';
import { InboxQuery } from './state/inbox.query';
import { InboxStore } from './state/inbox.store';
import { GoalsState } from './../plan/state/goals/goals.store';

const inboxGoalsQuery = gql`
  query inboxGoals {
    inboxGoals {
      id
      name
      type
      scheduledDate
      completed
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InboxFacadeService {
  inboxGoals$: Observable<Goal[]>;
  goalStateHistory: StateHistoryPlugin<GoalsState>;

  constructor(
    private apollo: Apollo,
    inboxQuery: InboxQuery,
    private inboxStore: InboxStore,
    private goalsStore: GoalsStore,
    private goalsQuery: GoalsQuery,
    private planResourceService: PlanResourceService
  ) {
    this.inboxGoals$ = inboxQuery.selectInboxGoals();
    this.goalStateHistory = new StateHistoryPlugin(this.goalsQuery);
  }

  fetchInboxGoals() {
    this.apollo
      .query<{ inboxGoals: Goal[] }>({
        query: inboxGoalsQuery,
      })
      .subscribe((inboxGoals) => {
        this.goalsStore.upsertMany(inboxGoals.data.inboxGoals);
        this.inboxStore.update((state) => {
          return {
            inboxGoalIds: inboxGoals.data.inboxGoals.map((goal) => goal.id),
          };
        });
      });
  }

  addGoal(goal: Goal) {
    this.goalsStore.add(goal);
    this.inboxStore.update((state) => {
      return {
        inboxGoalIds: arrayAdd(state.inboxGoalIds, goal.id),
      };
    });

    this.inboxStore.setLoading(true);
    this.planResourceService.addGoal(goal).subscribe(({ errors }) => {
      this.inboxStore.setLoading(false);
      if (errors) {
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  updateGoal(goal: Goal) {
    this.goalsStore.upsert(goal.id, goal);
    this.planResourceService.updateGoal(goal).subscribe(({ errors }) => {
      if (errors) {
        this.goalStateHistory.undo();
        this.goalsStore.setError(errors[0]);
        return;
      }
    });
  }

  deleteGoal(goal: Goal) {
    this.inboxStore.update((state) => {
      return {
        inboxGoalIds: arrayRemove(state.inboxGoalIds, [goal.id]),
      };
    });
    this.goalsStore.remove(goal.id);
  }
}
