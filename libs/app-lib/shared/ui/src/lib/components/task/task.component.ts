import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Goal } from '@app/shared/domain';
import { IonInput } from '@ionic/angular';

export const tempIdPrefix = 'temp';
@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnInit {
  private _task: Goal;
  public get task(): Goal {
    return this._task;
  }
  @Input()
  public set task(v: Goal) {
    this._task = v;
    this.isTempTask = this._task.id?.startsWith(tempIdPrefix);
  }

  isTempTask = false;

  @Output() edit = new EventEmitter<Goal>();
  @Output() add = new EventEmitter<Goal>();
  @Output() delete = new EventEmitter<Goal>();

  taskNameControl: FormControl;

  @ViewChild('input') inputElm: IonInput;

  constructor() {}

  ngOnInit() {
    this.taskNameControl = new FormControl(
      this.task?.name,
      Validators.required
    );
  }

  @HostListener('document:keydown.enter', ['$event'])
  onAdd() {
    if (this.task.id) {
      return;
    }

    const taskToAdd = {
      ...this.task,
      name: this.taskNameControl.value,
    } as Goal;
    this.add.emit(taskToAdd);
  }

  onFocus() {
    this.inputElm.setFocus();
  }
}
