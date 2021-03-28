import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { Goal, TaskPeriod } from '@app/shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit {
  taskPeriods$: Observable<TaskPeriod[]>;
  goalsForPeriod: Goal[] = [
    {
      id: 'weekly-goal-1',
      name: 'Finish feature xyz',
    } as Goal,
    {
      id: 'weekly-goal-2',
      name: 'Finish feature xyz 2',
    } as Goal,
  ];
  categories$: Observable<string[]>;

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit() {
    this.categories$ = this.appFacadeService.monthlyCategories$;
    this.taskPeriods$ = this.appFacadeService.monthlyTaskPeriods$;
  }
}
