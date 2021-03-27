import { Component, OnInit } from '@angular/core';
import { Day } from '../interfaces/day';
import { Goal } from '../interfaces/goal';
import { Task } from '../interfaces/task';

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

  days: Day[] = [
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
    } as Day,
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
    } as Day,
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
    } as Day,
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
    } as Day,
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
    } as Day,
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
    } as Day,
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
    } as Day,
  ];

  weeklyGoalsTrackBy(goal: Goal, idx) {
    return goal.id;
  }

  constructor() {}

  ngOnInit() {}
}
