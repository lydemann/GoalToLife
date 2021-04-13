import { Injectable } from '@angular/core';
import { Goal, GoalSummary, GoalType, Task } from '@app/shared/interfaces';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';

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
@Injectable({
  providedIn: 'root',
})
export class AppFacadeService {
  constructor(private apollo: Apollo) {}
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
  monthlyTaskPeriods$ = of({
    '2021-04-12': {
      goals: [
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
        {
          id: '1',
          name: 'some goal alal 2',
        } as Goal,
      ],
    } as GoalSummary,
  } as Record<string, GoalSummary>);

  quarterlyCategories$ = this.monthlyCategories$;
  quarterlyTaskPeriods$ = this.monthlyTaskPeriods$;

  yearlyTaskPeriods$ = this.quarterlyTaskPeriods$;
  yearlyCategories$: Observable<string[]> = this.quarterlyCategories$;

  isAddingTask$: Observable<boolean>;

  private isAddingGoalSubject = new BehaviorSubject(false);
  isAddingGoal$ = this.isAddingGoalSubject.asObservable();

  private isLoadingGoalsSubject = new BehaviorSubject(false);
  isLoadingGoals$ = this.isLoadingGoalsSubject.asObservable();

  getGoals(scheduledDate: string, type: GoalType) {
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
      mutation addGoal($name: String!) {
        addGoal(name: $name, scheduledDate: "2021") {
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
