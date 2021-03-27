import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { Goal, TaskPeriod } from '@app/shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html',
  styleUrls: ['./yearly.component.scss']
})
export class YearlyComponent implements OnInit {
  taskPeriods$: Observable<TaskPeriod[]>;
  goalsForPeriod: Goal[] = [
    {
      id: 'quarterly-goal-1',
      name: 'Finish feature xyz',
    } as Goal,
    {
      id: 'quarterly-goal-2',
      name: 'Finish feature xyz 2',
    } as Goal,
  ];
  categories$: Observable<string[]>;

  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit() {
    this.categories$ = this.appFacadeService.yearlyCategories$;
    this.taskPeriods$ = this.appFacadeService.yearlyTaskPeriods$;
  }
}
