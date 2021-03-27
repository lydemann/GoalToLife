import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, TaskPeriod } from '@app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppFacadeService {
  tasks$ = new BehaviorSubject([
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
  dailyCategories$: Observable<string[]> = this.tasks$.pipe(
    map((tasks) =>
      tasks.reduce((prev, task) => [...prev, ...task.categories], [])
    ),
    map((categories) => [...new Set(categories)])
  );
  monthlyCategories$ = this.dailyCategories$;
  monthlyTaskPeriods$ = of([
    {
      date: new Date(2021, 3, 27),
      tasks: [
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
      tasks: [
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
      tasks: [
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
      tasks: [
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
  yearlyCategories$: Observable<string[]> = this.quarterlyCategories$

  deleteTask(taskToDelete: Task) {
    const newTasks = this.tasks$.value.filter(
      (task) => taskToDelete.id !== task.id
    );
    this.tasks$.next(newTasks);
  }
}
