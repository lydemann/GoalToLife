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
import { Goal, GoalPeriodType, Task } from '@app/shared/interfaces';

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
  @Input() tasks: Task[];
  @Input() date: string;
  @Input() titleLink: string;
  @Output() addGoal = new EventEmitter<Goal>();
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
      type: GoalPeriodType.MONTHLY,
      scheduledDate: this.date,
    } as Goal);
    this.todoTextControl.reset();
  }
  onKeydown(event) {
    event.preventDefault();
  }
}
