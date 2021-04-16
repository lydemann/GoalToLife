import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { TaskComponent } from '@app/app-lib/shared/ui';
import { Goal, GoalPeriodType, Task } from '@app/shared/interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss'],
})
export class DailyComponent implements OnInit {
  @ViewChildren(TaskComponent) taskComponents: QueryList<TaskComponent>;

  categories$: Observable<string[]>;
  hasTempTask$: Observable<boolean>;
  goals$: Observable<Goal[]>;
  isLoadingGoals$: Observable<boolean>;

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit(): void {
    this.categories$ = this.appFacadeService.dailyCategories$;
    this.isLoadingGoals$ = this.appFacadeService.isLoadingGoals$;
    this.goals$ = this.appFacadeService.getGoals('2021', GoalPeriodType.DAILY);
  }

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }

  onDelete(task: Task) {
    this.goals$ = this.goals$.pipe(
      map((tasks) => tasks.filter((task) => !!task.id))
    );

    this.appFacadeService.deleteGoal(task);
  }

  onAdd(task: Task) {
    this.goals$ = this.goals$.pipe(
      map((tasks) => tasks.filter((task) => !!task.id))
    );

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
