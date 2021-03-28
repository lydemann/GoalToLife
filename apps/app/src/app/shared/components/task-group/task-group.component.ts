import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
} from '@angular/core';
import { Task } from '@app/shared/interfaces';

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
  @Input() titleLink: string;

  constructor() {}

  ngOnInit() {}

  tasksTrackBy(task: Task, idx) {
    return task.id;
  }
}
