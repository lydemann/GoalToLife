import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { TaskPeriod, Goal, Task } from '@app/shared/interfaces';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-weekly',
  templateUrl: './weekly.component.html',
  styleUrls: ['./weekly.component.scss'],
})
export class WeeklyComponent implements OnInit {
  weeklyGoals: Goal[] = [
    {
      id: 'weekly-goal-1',
      name: 'Finish feature xyz',
    } as Goal,
    {
      id: 'weekly-goal-2',
      name: 'Finish feature xyz 2',
    } as Goal,
  ];

  days: TaskPeriod[] = [
    {
      date: new Date(2021, 3, 15),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 16),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 17),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 18),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 19),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 20),
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
        } as Task,
      ],
    } as TaskPeriod,
    {
      date: new Date(2021, 3, 21),
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
        } as Task,
      ],
    } as TaskPeriod,
  ];
  categories$: Observable<string[]>;

  weeklyGoalsTrackBy(goal: Goal, idx) {
    return goal.id;
  }

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit() {
    this.categories$ = this.appFacadeService.dailyCategories$;
  }
}
