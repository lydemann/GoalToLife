import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Task } from '@app/shared/interfaces';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent implements OnInit {
  @Input() task: Task;
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
