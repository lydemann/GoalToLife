import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  MONTH_PARAM_KEY,
  PlanFacadeService,
  YEAR_PARAM_KEY,
} from '@app/app-lib';
import {
  EditGoalModalComponent,
  EditModalComponentProps,
} from '@app/app-lib/shared/ui';
import {
  Goal,
  GoalPeriod,
  GoalPeriodStore,
  GoalPeriodType,
} from '@app/shared/interfaces';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit {
  isLoading$: Observable<boolean>;
  goalPeriods$: Observable<Record<string, GoalPeriod>>;
  currentMonthGoalPeriod$: Observable<GoalPeriod>;
  categories$: Observable<string[]>;
  monthlyGoalPeriodType = GoalPeriodType.MONTHLY;

  calendarDate: Date;
  private _currentDate: Date;
  set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }

  get currentDate(): Date {
    return this._currentDate;
  }

  constructor(
    private planFacadeService: PlanFacadeService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    const year = params[YEAR_PARAM_KEY];
    const month = params[MONTH_PARAM_KEY];
    const dateOfMonth = new Date().getDate();
    this.currentDate = new Date(year, month, dateOfMonth);
    this.calendarDate = new Date(this._currentDate.setHours(0, 0, 0, 0));
    this.calendarDate.setMonth(this.calendarDate.getMonth(), 1); // avoiding problems with 29th,30th,31st days

    this.categories$ = this.planFacadeService.monthlyCategories$;

    this.goalPeriods$ = this.planFacadeService.goalPeriods$;

    this.planFacadeService.fetchMonthlyGoalPeriods(
      this.calendarDate.getMonth(),
      this.calendarDate.getFullYear()
    );
    this.currentMonthGoalPeriod$ = this.planFacadeService.currentMonthGoalPeriod$;

    this.isLoading$ = this.planFacadeService.isLoading$;
  }

  monthChanges(changeResult: any): void {
    this.calendarDate = new Date(changeResult);
    this.planFacadeService.fetchMonthlyGoalPeriods(
      this.calendarDate.getMonth(),
      this.calendarDate.getFullYear()
    );
    // TODO: update path params on month change
  }

  onAddGoal(goal: Goal) {
    this.planFacadeService.addGoal({ ...goal, id: uuidv4() });
  }

  onDeleteGoal(goal: Goal) {
    this.planFacadeService.deleteGoal(goal);
  }

  async onEditGoal(goal: Goal) {
    const modal = await this.modalController.create({
      component: EditGoalModalComponent,
      componentProps: {
        goal,
      } as EditModalComponentProps,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss<Goal>();

    this.planFacadeService.updateGoal(data);
  }

  onToggleComplete(goal: Goal) {
    this.planFacadeService.updateGoal(goal);
  }

  onRetroChange(goalPeriod: Partial<GoalPeriod>) {
    this.planFacadeService.updateGoalPeriod(goalPeriod);
  }
}
