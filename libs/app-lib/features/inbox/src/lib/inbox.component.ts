import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { InboxFacadeService } from '@app/app-lib/shared/domain';
import {
  EditGoalModalComponent,
  EditModalComponentProps,
} from '@app/app-lib/shared/ui';
import { Goal, GoalPeriodType } from '@app/shared/domain';
import { ModalController } from '@ionic/angular';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit {
  categories$: Observable<string[]> = of([]);
  goals$!: Observable<Goal[]>;
  isLoadingGoals$ = new BehaviorSubject<boolean>(false);
  todoTextControl!: FormControl;

  constructor(
    private inboxFacade: InboxFacadeService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.goals$ = this.inboxFacade.inboxGoals$.pipe(
      map((inboxGoals) => {
        return inboxGoals;
      })
    );
    this.todoTextControl = new FormControl(null, [Validators.required]);
  }

  onAddGoal(event: Event) {
    this.inboxFacade.addGoal({
      id: uuidv4(),
      name: this.todoTextControl.value,
      type: GoalPeriodType.DAILY,
      scheduledDate: '',
    } as Goal);

    this.todoTextControl.reset();
  }

  onUpdateGoalTodo(goal: Goal) {
    this.inboxFacade.updateGoal(goal);
  }

  onKeydown(event: Event) {
    event.preventDefault();
  }

  onDeleteGoal(task: Goal) {
    this.inboxFacade.deleteGoal(task);
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
      this.inboxFacade.updateGoal(data);
    }
  }
}
