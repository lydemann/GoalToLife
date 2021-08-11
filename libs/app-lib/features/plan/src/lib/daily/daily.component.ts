import {
  Component,
  OnInit,
  QueryList,
  TrackByFunction,
  ViewChildren,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacadeService } from '@app/app-lib/shared/domain';
import { TaskComponent } from '@app/app-lib/shared/ui';
import { Goal, GoalPeriodType, Task } from '@app/shared/domain';

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

  tasksTrackBy: TrackByFunction<Goal> = (idx: number, goal: Goal) => {
    return goal.id;
  };

  onDelete(task: Task) {
    this.goals$ = this.goals$.pipe(
      map((tasks) => tasks.filter((goal) => !!goal.id))
    );

    this.appFacadeService.deleteGoal(task);
  }

  onAdd(task: Task) {
    this.goals$ = this.goals$.pipe(
      map((tasks) => tasks.filter((goal) => !!goal.id))
    );

    this.appFacadeService.addGoal(task);
  }

  createTempTask() {
    const tempTask = {
      id: null,
      name: '',
    } as Goal;

    this.goals$ = this.goals$.pipe(map((goals) => [...goals, tempTask]));
    // wait for temp task to be created in dom
    setTimeout(() => {
      this.taskComponents.last.onFocus();
    }, 50);
  }
}
