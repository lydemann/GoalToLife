import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { InboxFacadeService } from '@app/app-lib/shared/domain';
import { Goal } from '@app/shared/domain';
import { Observable, BehaviorSubject, of } from 'rxjs';
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

  constructor(private inboxFacade: InboxFacadeService) {}

  ngOnInit() {
    this.goals$ = this.inboxFacade.inboxGoals$.pipe(
      map(({ loading, data }) => {
        this.isLoadingGoals$.next(loading);
        return data.inboxGoals;
      })
    );
    this.todoTextControl = new FormControl(null, [Validators.required]);
  }

  onAddTodo(goal: Goal) {}

  onKeydown(event: Event) {
    event.preventDefault();
  }

  onDelete(task: Goal) {
    // this.inboxFacade.deleteGoal(task);
  }
}
