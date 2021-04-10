import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Goal, GoalType, Task } from '@app/shared/interfaces';
import { Observable, of } from 'rxjs';
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

  categories$: Observable<string[]>;
  tempTask: Goal;
  goals$: Observable<Goal[]>;
  isLoadingGoals$: Observable<boolean>;

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit(): void {
    this.categories$ = this.appFacadeService.dailyCategories$;
    this.isLoadingGoals$ = this.appFacadeService.isLoadingGoals$;
    this.goals$ = this.appFacadeService.getGoals('2021', GoalType.DAILY);
  }

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }

  onDelete(task: Task) {
    if (!task.id) {
      this.goals$ = this.goals$.pipe(
        map((tasks) => tasks.filter((task) => !!task.id))
      );
    }

    this.appFacadeService.deleteTask(task);
  }

  onAdd(task: Task) {
    this.appFacadeService.addGoal(task);
  }

  createTempTask() {
    const tempTask = {
      id: null,
      name: '',
    } as Goal;

    this.goals$ = this.goals$.pipe(map((tasks) => [...tasks, tempTask]));
    // wait for temp task to be created in dom
    setTimeout(() => {
      this.taskComponents.last.onFocus();
    }, 50);
  }
}
