import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

import {
  GetGoalPeriodsInput,
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  getDailyGoalKey,
  getMonthlyGoalPeriodKey,
  getQuarterlyGoalPeriodKey,
  getYearlyGoalPeriodKey,
} from '@app/shared/domain';

const getGoalPeriodsQuery = gql`
  query goalGoalPeriodsQuery(
    $fromDate: String
    $toDate: String
    $dates: [String]
  ) {
    goalPeriod(fromDate: $fromDate, toDate: $toDate, dates: $dates) {
      date
      type
      goals {
        id
        name
        type
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

  getYearlyGoalPeriods(year: number) {
    const yearlyGoalPeriodKey = getYearlyGoalPeriodKey(year);
    const quarterlyGoalPeriodKeys = [1, 2, 3, 4].map((quarter) =>
      getQuarterlyGoalPeriodKey(year, quarter)
    );
    const dates = [yearlyGoalPeriodKey, ...quarterlyGoalPeriodKeys];
    return this.apollo.query<{ goalPeriod: GoalPeriod[] }>({
      query: getGoalPeriodsQuery,
      variables: {
        dates,
      } as GetGoalPeriodsInput,
    });
  }

  getMonthlyGoalPeriods(month: number, year: number) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const monthlyGoalPeriodKey = getMonthlyGoalPeriodKey(year, month);
    const dates = [monthlyGoalPeriodKey];
    const fromDate = getDailyGoalKey(firstDay);
    const toDate = getDailyGoalKey(lastDay);

    return this.apollo.query<{ goalPeriod: GoalPeriod[] }>({
      query: getGoalPeriodsQuery,
      variables: {
        fromDate,
        toDate,
        dates,
      } as GetGoalPeriodsInput,
    });
  }

  updateGoalPeriod(goalPeriod: GoalPeriodStore) {
    const mutation = gql`
      mutation updateGoalPeriod(
        $date: String
        $type: String
        $wins: String
        $improvementPoints: String
        $obtainedKnowledge: String
        $thoughts: String
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
          type
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
        $categories: [String]
      ) {
        updateGoal(
          id: $id
          name: $name
          type: $type
          scheduledDate: $scheduledDate
          completed: $completed
          categories: $categories
        ) {
          id
          name
          scheduledDate
          completed
          categories
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
        categories: goal.categories,
      } as Goal,
    });
  }

  deleteGoal(goal: Goal) {
    const mutation = gql`
      mutation deleteGoal($id: String!, $scheduledDate: String) {
        deleteGoal(id: $id, scheduledDate: $scheduledDate)
      }
    `;

    return this.apollo.mutate({
      mutation,
      variables: {
        id: goal.id,
        scheduledDate: goal.scheduledDate,
      },
    });
  }

  moveGoal(orgGoalPeriodId: string, destGoalPeriodId: string, goalId: string) {}
}
