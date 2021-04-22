import { Injectable } from '@angular/core';
import { getDailyGoalKey } from '@app/app-lib/shared/ui';
import {
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  Task,
} from '@app/shared/interfaces';
import { Apollo, gql } from 'apollo-angular';

const getGoalPeriodsQuery = gql`
  query goalGoalPeriodsQuery($fromDate: String, $toDate: String) {
    goalPeriod(fromDate: $fromDate, toDate: $toDate) {
      date
      goals {
        id
        name
        scheduledDate
        completed
      }
      wins
      improvementPoints
      obtainedKnowledge
      thoughts
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

  updateGoalPeriod(goalPeriod: GoalPeriodStore) {
    const mutation = gql`
      mutation updateGoalPeriod(
        $date: String
        $type: String
        $wins: [String]
        $improvementPoints: [String]
        $obtainedKnowledge: [String]
        $thoughts: [String]
      ) {
        updateGoalPeriod(
          date: $date
          type: $type
          wins: $wins
          improvementPoints: $improvementPoints
          obtainedKnowledge: $obtainedKnowledge
          thoughts: $thoughts
        ) {
          date
          type
          wins
          improvementPoints
          obtainedKnowledge
          thoughts
        }
      }
    `;

    return this.apollo.mutate<{ addGoal: Goal }>({
      mutation,
      variables: {
        date: goalPeriod.date,
        type: goalPeriod.type,
        wins: goalPeriod.wins,
        improvementPoints: goalPeriod.improvementPoints,
        obtainedKnowledge: goalPeriod.obtainedKnowledge,
        thoughts: goalPeriod.thoughts,
      } as GoalPeriod,
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
        $name: String
        $type: String
        $scheduledDate: String
        $completed: Boolean
      ) {
        updateGoal(
          id: $id
          name: $name
          type: $type
          scheduledDate: $scheduledDate
          completed: $completed
        ) {
          id
          name
          scheduledDate
          completed
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
        completed: goal.completed,
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
