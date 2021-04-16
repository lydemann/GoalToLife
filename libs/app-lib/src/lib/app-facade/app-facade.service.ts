import { Injectable } from '@angular/core';
import { getDailyGoalKey } from '@app/app-lib/shared/ui';
import { Goal, GoalPeriod, GoalPeriodType, Task } from '@app/shared/interfaces';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pluck, startWith } from 'rxjs/operators';

import { createInCache, removeFromCache } from '../graphql/graphql-helpers';

const getGoalsQuery = gql`
  query getGoalsQuery($scheduledDate: String!) {
    goal(scheduledDate: $scheduledDate) {
      id
      name
      scheduledDate
    }
  }
`;

const getGoalPeriodsQuery = gql`
  query goalGoalPeriodsQuery($fromDate: String, $toDate: String) {
    goalPeriod(fromDate: $fromDate, toDate: $toDate) {
      date
      goals {
        name
      }
    }
  }
`;
@Injectable({
  providedIn: 'root',
})
export class AppFacadeService {
  constructor(private apollo: Apollo) {}

  monthlyGoalPeriods$: Observable<Record<string, GoalPeriod>>;
  dailyTasks$ = new BehaviorSubject([
    {
      id: '1',
      name: 'Do laundry',
      categories: [],
    } as Task,
    {
      id: '2',
      name: 'Buy milk',
      categories: ['groceries'],
    } as Task,
    {
      id: '3',
      name: 'Run 10k',
      categories: ['fitness'],
    } as Task,
  ]);
  taskInbox$ = this.dailyTasks$;
  dailyCategories$: Observable<string[]> = this.dailyTasks$.pipe(
    map((tasks) =>
      tasks.reduce((prev, task) => [...prev, ...task.categories], [])
    ),
    map((categories) => [...new Set(categories)])
  );
  monthlyCategories$ = this.dailyCategories$;

  quarterlyCategories$ = this.monthlyCategories$;
  quarterlyTaskPeriods$ = of();

  yearlyTaskPeriods$ = this.quarterlyTaskPeriods$;
  yearlyCategories$: Observable<string[]> = this.quarterlyCategories$;

  isAddingTask$: Observable<boolean>;

  private isAddingGoalSubject = new BehaviorSubject(false);
  isAddingGoal$ = this.isAddingGoalSubject.asObservable();

  private isLoadingGoalsSubject = new BehaviorSubject(false);
  isLoadingGoals$ = this.isLoadingGoalsSubject.asObservable();

  getMonthlyGoalPeriods(month: number, year: number): Observable<Record<string, GoalPeriod>> {
    const date = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const fromDate = getDailyGoalKey(firstDay);
    const toDate = getDailyGoalKey(lastDay);

    return this.apollo
      .query<{goalPeriod: GoalPeriod[]}>({
        query: getGoalPeriodsQuery,
        variables: {
          fromDate,
          toDate,
        },
      })
      .pipe(
        map(({ data }) => {
          const goaPeriodMap = data.goalPeriod.reduce((prev, goalPeriod) => ({
            ...prev,
            [goalPeriod.date]: goalPeriod,
          }), {});
          return goaPeriodMap;
        }),
        startWith({})
      )
  }

  getGoals(scheduledDate: string, type: GoalPeriodType) {
    this.isLoadingGoalsSubject.next(true);
    return this.apollo
      .watchQuery<{ goal: Goal[] }>({
        query: getGoalsQuery,
        variables: { scheduledDate },
      })
      .valueChanges.pipe(
        map(({ data }) => {
          this.isLoadingGoalsSubject.next(false);
          return data.goal;
        })
      );
  }

  addGoal(goal: Goal) {
    this.isAddingGoalSubject.next(true);
    // TODO: use scheduled date form goal
    const mutation = gql`
      mutation addGoal($name: String!, $type: String!, $scheduledDate: String) {
        addGoal(name: $name, type: $type, scheduledDate: $scheduledDate) {
          name
          scheduledDate
        }
      }
    `;

    this.apollo
      .mutate<{ addGoal: Goal }>({
        mutation,
        variables: {
          name: goal.name,
          type: goal.type,
          scheduledDate: goal.scheduledDate,
          // scheduledDate: goal.scheduledDate,
        } as Goal,
        update(cache, { data }) {
          createInCache(
            data.addGoal,
            {
              readQuery: getGoalsQuery,
              variables: { scheduledDate: '2021' },
            },
            cache,
            'goal'
          );
        },
      })
      .pipe(
        map(
          ({ data }) => {
            this.isAddingGoalSubject.next(false);
          },
          catchError(() => {
            this.isAddingGoalSubject.next(false);
            return of();
          })
        )
      )
      .subscribe();
  }

  deleteGoal(goal: Task) {
    const mutation = gql`
      mutation deleteGoal($id: String!) {
        deleteGoal(id: $id)
      }
    `;

    return this.apollo
      .mutate({
        mutation,
        variables: {
          id: goal.id,
        },
        update(cache, { data }) {
          removeFromCache(
            goal,
            {
              readQuery: getGoalsQuery,
              variables: { scheduledDate: '2021' },
            },
            cache,
            'goal'
          );
        },
      })
      .subscribe();
  }
}
