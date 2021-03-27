import { Component, OnInit } from '@angular/core';
import { Task } from '../interfaces/task';



@Component({
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements OnInit {

  tasks: Task[] = [
    {
      id: '1',
      name: 'Do laundry',
    } as Task,
    {
      id: '2',
      name: 'Buy milk',
      categories: ['groceries']
    } as Task,
    {
      id: '3',
      name: 'Run 10k',
      categories: ['fitness']
    } as Task
  ];
  ngOnInit(): void {
  }

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }

}
