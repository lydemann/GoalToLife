import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Goal } from '@app/shared/domain';
import { ModalController } from '@ionic/angular';

export interface EditModalComponentProps {
  goal: Goal;
}

@Component({
  selector: 'app-edit-goal-modal',
  templateUrl: './edit-goal-modal.component.html',
  styleUrls: ['./edit-goal-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditGoalModalComponent implements OnInit, EditModalComponentProps {
  @Input() goal: Goal;

  formGroup: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: [this.goal.name, Validators.required],
      completed: this.goal.completed,
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    this.modalController.dismiss({
      id: this.goal.id,
      name: this.formGroup.value.name,
      completed: this.formGroup.value.completed,
    } as Goal);
  }
}
