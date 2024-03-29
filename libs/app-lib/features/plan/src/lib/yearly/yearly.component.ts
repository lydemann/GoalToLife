import { Component, OnInit } from '@angular/core';
import {
  AppFacadeService,
  PlanFacadeService,
  YEAR_PARAM_KEY,
} from '@app/app-lib/shared/domain';
import { Goal, GoalPeriod } from '@app/shared/domain';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import {
  EditGoalModalComponent,
  EditModalComponentProps,
} from '@app/app-lib/shared/ui';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-yearly',
  templateUrl: './yearly.component.html',
  styleUrls: ['./yearly.component.scss'],
})
export class YearlyComponent implements OnInit {
  taskPeriods$: Observable<GoalPeriod[]>;
  categories$: Observable<string[]>;
  quarters = [1, 2, 3, 4];
  currentYearGoalPeriod$: Observable<GoalPeriod>;
  quarterGoalPeriods$: Observable<GoalPeriod[]>;
  date: Date = new Date();
  selectedQuarter: number;

  constructor(
    private appFacadeService: AppFacadeService,
    private activatedRoute: ActivatedRoute,
    private planFacadeService: PlanFacadeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.categories$ = this.appFacadeService.yearlyCategories$;
    const params = this.activatedRoute.snapshot.params;
    const year = params[YEAR_PARAM_KEY];
    this.planFacadeService.fetchYearlyAndQuarterlyGoalPeriods(year);
    this.currentYearGoalPeriod$ = this.planFacadeService.currentYearGoalPeriod$;
    this.quarterGoalPeriods$ = this.planFacadeService.quarterGoalPeriods$;
    this.date = new Date(year, 0);
  }

  setSelectedQuarter(quarter: number) {
    this.selectedQuarter = quarter;
  }

  getIsSelectedQuarter(quarter: number) {
    return quarter === this.selectedQuarter;
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
