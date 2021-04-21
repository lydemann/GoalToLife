import { Injectable } from '@angular/core';
import { getDailyGoalKey } from '@app/app-lib/shared/ui';
import { Goal, GoalPeriod, GoalPeriodType, Task } from '@app/shared/interfaces';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

const getGoalPeriodsQuery = gql`
  query goalGoalPeriodsQuery($fromDate: String, $toDate: String) {
    goalPeriod(fromDate: $fromDate, toDate: $toDate) {
      date
      goals {
        id
        name
        scheduledDate
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class PlanResourceService {
  constructor(private apollo: Apollo) {}

  getMonthlyGoalPeriods(month: number, year: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const fromDate = getDailyGoalKey(firstDay);
    const toDate = getDailyGoalKey(lastDay);

    return this.apollo.query<{ goalPeriod: GoalPeriod[] }>({
      query: getGoalPeriodsQuery,
      variables: {
        fromDate,
        toDate,
      },
    });
  }

  addGoal(goal: Goal) {
    // TODO: use scheduled date form goal
    const mutation = gql`
      mutation addGoal(
        $id: String!
        $name: String!
        $type: String!
        $scheduledDate: String
      ) {
        addGoal(
          id: $id
          name: $name
          type: $type
          scheduledDate: $scheduledDate
        ) {
          id
          name
          scheduledDate
        }
      }
    `;

    return this.apollo.mutate<{ addGoal: Goal }>({
      mutation,
      variables: {
        id: goal.id,
        name: goal.name,
        type: goal.type,
        scheduledDate: goal.scheduledDate,
      } as Goal,
    });
  }

  updateGoal(goal: Goal) {
    const mutation = gql`
      mutation updateGoal(
        $id: String!
        $name: String!
        $type: String!
        $scheduledDate: String
      ) {
        updateGoal(
          id: $id
          name: $name
          type: $type
          scheduledDate: $scheduledDate
        ) {
          id
          name
          scheduledDate
        }
      }
    `;

    return this.apollo.mutate<{ updateGoal: Goal }>({
      mutation,
      variables: {
        id: goal.id,
        name: goal.name,
        type: goal.type,
        scheduledDate: goal.scheduledDate,
      } as Goal,
    });
  }

  deleteGoal(goal: Task) {
    const mutation = gql`
      mutation deleteGoal($id: String!) {
        deleteGoal(id: $id)
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {
        id: goal.id,
      },
    });
  }
}
