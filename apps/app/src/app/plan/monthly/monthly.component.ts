import { Component, OnInit } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { Goal, GoalSummary } from '@app/shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit {
  dailySummaries$: Observable<Record<string, GoalSummary>>;
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

  calendarDate: Date;
  private _currentDate : Date;
  set currentDate ( currentDate : Date ) {
    this._currentDate = currentDate;
  }

  get currentDate () : Date {
    return this._currentDate;
  }


  constructor(private appFacadeService: AppFacadeService) {}

  ngOnInit() {
    this.currentDate = new Date ();
    this.calendarDate = new Date (this._currentDate.setHours(0, 0, 0, 0));
    this.calendarDate.setMonth(this.calendarDate.getMonth(), 1); // avoiding problems with 29th,30th,31st days

    this.categories$ = this.appFacadeService.monthlyCategories$;
    this.dailySummaries$ = this.appFacadeService.monthlyTaskPeriods$;
  }

  monthChanges (changeResult : any) : void {
    this.calendarDate = new Date (changeResult);
  }
}
