import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppFacadeService } from '@app/app-lib';
import { Task } from '@app/shared/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InboxComponent implements OnInit {

  categories$: Observable<string[]>;
  tasks$: Observable<Task[]>;

  constructor(private appFacade: AppFacadeService) { }

  ngOnInit() {
    this.tasks$ = this.appFacade.taskInbox$;
  }

  onDelete(task: Task) {
    this.appFacade.deleteTask(task);
  }
}
