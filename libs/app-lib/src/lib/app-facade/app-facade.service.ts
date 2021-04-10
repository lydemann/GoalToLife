import { Injectable } from '@angular/core';
import { Goal, GoalType, Task, TaskPeriod } from '@app/shared/interfaces';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, pluck } from 'rxjs/operators';

import { createInCache } from '../graphql/graphql-helpers';

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
  monthlyTaskPeriods$ = of([
    {
      date: new Date(2021, 3, 27),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
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
        },
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 27),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
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
        },
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 27),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
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
        },
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 27),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
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
        },
      ],
    } as TaskPeriod,
  ]);

  quarterlyCategories$ = this.monthlyCategories$;
  quarterlyTaskPeriods$ = this.monthlyTaskPeriods$;

  yearlyTaskPeriods$ = this.quarterlyTaskPeriods$;
  yearlyCategories$: Observable<string[]> = this.quarterlyCategories$;

  isAddingTask$: Observable<boolean>;

  private getGoalsQuery = gql`
    query getGoalsQuery($scheduledDate: String!) {
      goals(scheduledDate: $scheduledDate) {
        id
        name
        scheduledDate
      }
    }
  `;

  private isAddingGoalSubject = new BehaviorSubject(false);
  isAddingGoal$ = this.isAddingGoalSubject.asObservable();

  private isLoadingGoalsSubject = new BehaviorSubject(false);
  isLoadingGoals$ = this.isLoadingGoalsSubject.asObservable();

  getGoals(scheduledDate: string, type: GoalType) {
    this.isLoadingGoalsSubject.next(true);
    return this.apollo
      .query<{ goals: Goal[] }>({
        query: this.getGoalsQuery,
        variables: { scheduledDate },
      })
      .pipe(
        map(({ data }) => {
          this.isLoadingGoalsSubject.next(false);
          return data.goals;
        })
      );
  }

  addGoal(goal: Goal) {
    this.isAddingGoalSubject.next(true);
    const mutation = gql`
      mutation addGoal {
        addTask(task: Task)
      }
    `;

    this.apollo
      .mutate({
        mutation,
        update(cache, { data }) {
          createInCache(goal, { readQuery: this.getGoalsQuery }, cache, 'goal');
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
      );
  }

  deleteTask(taskToDelete: Task) {
    const newTasks = this.dailyTasks$.value.filter(
      (task) => taskToDelete.id !== task.id
    );
    this.dailyTasks$.next(newTasks);
  }
}
