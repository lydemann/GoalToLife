import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Goal, GoalPeriodType } from '@app/shared/domain';
import { getDailyGoalKey } from '@app/shared/util';
import { ModalController } from '@ionic/angular';

export interface EditModalComponentProps {
  goal: Goal;
}

@Component({
  templateUrl: './edit-goal-modal.component.html',
  styleUrls: ['./edit-goal-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditGoalModalComponent implements OnInit, EditModalComponentProps {
  @Input() goal: Goal;
  @Input() allCategories: string[];

  formGroup: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this.goal.name, Validators.required],
      completed: this.goal.completed,
      scheduledDate: this.goal.scheduledDate || GoalPeriodType.DAILY,
      categories: [this.goal.categories],
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    let scheduledDate = null;
    if (this.formGroup.value.scheduledDate) {
      const date = new Date(this.formGroup.value.scheduledDate);
      scheduledDate = getDailyGoalKey(date);
    }
    this.modalController.dismiss({
      id: this.goal.id,
      name: this.formGroup.value.name,
      completed: this.formGroup.value.completed,
      categories:
        this.formGroup.value.categories instanceof Array
          ? this.formGroup.value.categories
          : [this.formGroup.value.categories],
      type: this.goal.type,
      scheduledDate,
    } as Goal);
  }
}
