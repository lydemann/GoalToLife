import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Goal, GoalPeriodType, Task } from '@app/shared/domain';

@Component({
  selector: 'app-task-group',
  templateUrl: './task-group.component.html',
  styleUrls: ['./task-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskGroupComponent implements OnInit {
  @Input() title: string;
  @HostBinding('class.main')
  @Input()
  isMain: boolean;
  @Input() tasks: Goal[];
  @Input() date: string;
  @Input() goalPeriodType: GoalPeriodType;
  @Input() titleLink: string;
  @Output() addGoal = new EventEmitter<Goal>();
  @Output() deleteGoal = new EventEmitter<Goal>();
  @Output() editGoal = new EventEmitter<Goal>();
  todoTextControl: FormControl;

  constructor() {}

  ngOnInit() {
    this.todoTextControl = new FormControl(null, [Validators.required]);
  }

  tasksTrackBy(idx: number, task: Task) {
    return task.id;
  }

  onAddTODO(event: Event): void {
    event.preventDefault();

    // TODO: check if valid, using require validator
    if (this.todoTextControl.invalid) {
      return;
    }

    this.addGoal.emit({
      name: this.todoTextControl.value,
      type: this.goalPeriodType,
      scheduledDate: this.date,
    } as Goal);
    this.todoTextControl.reset();
  }

  onKeydown(event) {
    event.preventDefault();
  }
}
