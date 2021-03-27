import { Component, OnInit } from '@angular/core';
import { Task } from '@app/shared/interfaces';
import { Observable } from 'rxjs';
import { AppFacadeService } from '@app/app-lib';
@Component({
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss'],
})
export class DailyComponent implements OnInit {

  tasks$: Observable<Task[]>;
  categories$: Observable<string[]>;

  constructor(private appFacadeService: AppFacadeService) {
  }

  ngOnInit(): void {
    this.tasks$ = this.appFacadeService.tasks$;
    this.categories$ = this.appFacadeService.dailyCategories$;
  }

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }

  onDelete(task: Task) {
    this.appFacadeService.deleteTask(task);
  }
}
