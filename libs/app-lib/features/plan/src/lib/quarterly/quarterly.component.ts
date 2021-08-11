import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib/shared/domain';
import { Goal, GoalPeriod } from '@app/shared/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quarterly',
  templateUrl: './quarterly.component.html',
  styleUrls: ['./quarterly.component.scss'],
})
export class QuarterlyComponent implements OnInit {
  taskPeriods$: Observable<GoalPeriod[]>;
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
    this.categories$ = this.appFacadeService.quarterlyCategories$;
    // this.taskPeriods$ = this.appFacadeService.quarterlyTaskPeriods$;
  }
}
