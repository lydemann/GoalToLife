import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppFacadeService } from '@app/app-lib/shared/domain';
import { Task } from '@app/shared/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxComponent implements OnInit {
  categories$: Observable<string[]>;
  tasks$: Observable<Task[]>;

  constructor(private appFacade: AppFacadeService) {}

  ngOnInit() {
    this.tasks$ = this.appFacade.taskInbox$;
  }

  onDelete(task: Task) {
    this.appFacade.deleteGoal(task);
  }
}
