import { Component, OnInit } from '@angular/core';
import { PlanFacadeService } from '@app/app-lib';
import {
  EditGoalModalComponent,
  EditModalComponentProps,
} from '@app/app-lib/shared/ui';
import { Goal, GoalPeriod, GoalPeriodStore } from '@app/shared/interfaces';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-monthly',
  templateUrl: './monthly.component.html',
  styleUrls: ['./monthly.component.scss'],
})
export class MonthlyComponent implements OnInit {
  isLoading$: Observable<boolean>;
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

  constructor(
    private planFacadeService: PlanFacadeService,
    private modalController: ModalController
  ) {}

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

    this.isLoading$ = this.planFacadeService.isLoading$;
  }

  monthChanges(changeResult: any): void {
    this.calendarDate = new Date(changeResult);
    this.planFacadeService.fetchMonthlyGoalPeriods(
      this.calendarDate.getMonth(),
      this.calendarDate.getFullYear()
    );
  }

  onAddTodo(goal: Goal) {
    this.planFacadeService.addGoal({ ...goal, id: uuidv4() });
  }

  onDeleteTodo(goal: Goal) {
    this.planFacadeService.deleteGoal(goal);
  }

  async onEditTodo(goal: Goal) {
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

  onRetroChange(goalPeriod: GoalPeriodStore) {
    this.planFacadeService.updateGoalPeriod(goalPeriod);
  }
}
