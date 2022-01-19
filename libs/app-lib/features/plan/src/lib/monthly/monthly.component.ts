import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  MONTH_PARAM_KEY,
  PlanFacadeService,
  YEAR_PARAM_KEY,
} from '@app/app-lib/shared/domain';
import {
  DropContent,
  EditGoalModalComponent,
  EditModalComponentProps,
} from '@app/app-lib/shared/ui';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/domain';

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

  private _currentDate: Date;
  monthDate: string;

  private _calendarDate: Date;
  public get calendarDate(): Date {
    return this._calendarDate;
  }
  public set calendarDate(v: Date) {
    this._calendarDate = v;
    this.monthDate = formatDate(this._calendarDate, 'MMMM YYYY', 'en-us');
  }

  set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }

  get currentDate(): Date {
    return this._currentDate;
  }

  constructor(
    private planFacadeService: PlanFacadeService,
    private modalController: ModalController,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    const year = params[YEAR_PARAM_KEY];
    const month = params[MONTH_PARAM_KEY];
    const dateOfMonth = new Date().getDate();
    this.currentDate = new Date(year, month, dateOfMonth);
    this.calendarDate = new Date(this._currentDate.setHours(0, 0, 0, 0));
    this.calendarDate.setMonth(this.calendarDate.getMonth(), 1); // avoiding problems with 29th,30th,31st days

    this.categories$ = this.planFacadeService.categories$;

    this.goalPeriods$ = this.planFacadeService.goalPeriodsWithFilteredGoals$;

    this.currentMonthGoalPeriod$ =
      this.planFacadeService.currentMonthGoalPeriod$;

    this.isLoading$ = this.planFacadeService.isLoading$;
  }

  monthChanges(changeResult: any): void {
    this.calendarDate = new Date(changeResult);
    const year = this.calendarDate.getFullYear();
    const month = this.calendarDate.getMonth();
    this.planFacadeService.fetchMonthlyGoalPeriods(month, year);
    // this.navController.navigateForward(['plan', 'monthly', year, month], {
    //   replaceUrl: true,
    //   animated: false,
    // });

    // change url without reloading
    const url = this.router
      .createUrlTree(['../..', year, month], {
        relativeTo: this.activatedRoute,
      })
      .toString();
    this.location.go(url);
  }

  onCategoriesChange(categories: string[]) {
    this.planFacadeService.onCategoriesChange(categories);
  }

  onAddGoal(goal: Goal) {
    this.planFacadeService.addGoal({ ...goal, id: uuidv4() });
  }

  onDeleteGoal(goal: Goal) {
    this.planFacadeService.deleteGoal(goal);
  }

  onReplaceGoal(dropContext: DropContent<Goal>) {
    this.planFacadeService.replaceGoal(
      dropContext.payload.scheduledDate,
      dropContext.context,
      dropContext.payload.id
    );
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

    if (data) {
      this.planFacadeService.updateGoal(data);
    }
  }

  onToggleComplete(goal: Goal) {
    this.planFacadeService.updateGoal(goal);
  }

  onRetroChange(goalPeriod: Partial<GoalPeriod>) {
    this.planFacadeService.updateGoalPeriod(goalPeriod);
  }
}
