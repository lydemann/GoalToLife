import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { GoalSummary, Goal, Task } from '@app/shared/interfaces';
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

  days: GoalSummary[] = [
    {
      date: new Date(2021, 3, 15),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 16),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 17),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 18),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 19),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 20),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
    {
      date: new Date(2021, 3, 21),
      goals: [
        {
          id: '1',
          name: 'Do laundry',
        } as Goal,
        {
          id: '2',
          name: 'Buy milk',
          categories: ['groceries'],
        } as Goal,
        {
          id: '3',
          name: 'Run 10k',
          categories: ['fitness'],
        } as Goal,
      ],
    } as GoalSummary,
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
