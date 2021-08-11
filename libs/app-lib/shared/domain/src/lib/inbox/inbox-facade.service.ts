import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Goal } from '@app/shared/domain';
import { Apollo } from 'apollo-angular';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

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
  inboxGoals$: Observable<
    ApolloQueryResult<{
      inboxGoals: Goal[];
    }>
  >;

  constructor(private apollo: Apollo) {
    this.inboxGoals$ = this.apollo.query<{ inboxGoals: Goal[] }>({
      query: inboxGoalsQuery,
    });
  }
}
