import { Component, OnInit } from '@angular/core';
import { AppFacadeService, PlanFacadeService } from '@app/app-lib';
import { Goal, GoalPeriod } from '@app/shared/interfaces';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit {
  goalPeriods$: Observable<Record<string, GoalPeriod>>;
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
  private _currentDate: Date;
  set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }

  get currentDate(): Date {
    return this._currentDate;
  }

  constructor(private planFacadeService: PlanFacadeService) {}

  ngOnInit() {
    this.currentDate = new Date();
    this.calendarDate = new Date(this._currentDate.setHours(0, 0, 0, 0));
    this.calendarDate.setMonth(this.calendarDate.getMonth(), 1); // avoiding problems with 29th,30th,31st days

    this.categories$ = this.planFacadeService.monthlyCategories$;

    this.goalPeriods$ = this.planFacadeService.goalPeriods$;

    this.planFacadeService.fetchMonthlyGoalPeriods(
      this.calendarDate.getMonth(),
      this.calendarDate.getFullYear()
    );
  }

  monthChanges(changeResult: any): void {
    this.calendarDate = new Date(changeResult);
    this.planFacadeService.fetchMonthlyGoalPeriods(
      this.calendarDate.getMonth(),
      this.calendarDate.getFullYear()
    );
  }

  onAddTodo(goal: Goal) {
    this.planFacadeService.addGoal({...goal, id: uuidv4()});
  }

  onDeleteTodo(goal: Goal) {
    this.planFacadeService.deleteGoal(goal);
  }
}
