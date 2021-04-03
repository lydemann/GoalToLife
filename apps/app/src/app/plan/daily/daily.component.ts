import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Goal, Task } from '@app/shared/interfaces';
import { Observable } from 'rxjs';
import { AppFacadeService } from '@app/app-lib';
import { map } from 'rxjs/operators';
import {
  TaskComponent,
  tempIdPrefix,
} from '../../shared/components/task/task.component';
@Component({
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss'],
})
export class DailyComponent implements OnInit {
  @ViewChildren(TaskComponent) taskComponents: QueryList<TaskComponent>;

  tasks$: Observable<Task[]>;
  categories$: Observable<string[]>;
  tempTask: Goal;

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit(): void {
    this.tasks$ = this.appFacadeService.dailyTasks$;
    this.categories$ = this.appFacadeService.dailyCategories$;
  }

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }

  onDelete(task: Task) {
    this.appFacadeService.deleteTask(task);
  }

  createTempTask() {
    const tempTask = {
      id: `${tempIdPrefix}-${Date.now()}`,
      name: '',
    } as Goal;

    this.tasks$ = this.tasks$.pipe(map((tasks) => [...tasks, tempTask]));
    // wait for temp task to be created in dom
    setTimeout(() => {
      this.taskComponents.last.onFocus();
    }, 50);
  }
}
