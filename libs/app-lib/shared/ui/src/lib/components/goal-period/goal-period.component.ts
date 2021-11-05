import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import {
  getGoalKey,
  Goal,
  GoalPeriod,
  GoalPeriodType,
} from '@app/shared/domain';
import { TODOItem } from '../../calendar/classes/todo-item';
import { DropContent } from '../../drag-and-drop/directives/drop-content';

export const SAVE_RETRO_FORM_DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-goal-period',
  templateUrl: './goal-period.component.html',
  styleUrls: ['./goal-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalPeriodComponent implements OnChanges, OnDestroy {
  /*
   * date (date + month) - used to define whether day is in currently selected month and for further TODO-list logic
   * selected day - selected day
   * highlighted day - some important day ("today" in our case)
   * trigger to alert that refresh of contained todos is required
   */

  // TODO: select on click
  @Input() isSelected: boolean;
  @Input() goalPeriod: GoalPeriod = { goals: [] } as GoalPeriod;
  get goalPeriodType(): GoalPeriodType {
    return this.goalPeriod.type;
  }
  @Input() date: Date;
  @Input() droppedGoal: Goal;
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();
  blurRetroInput: any;
  retroForm: FormGroup;

  get refreshRequired(): Date {
    return this._refreshRequired;
  }

  set refreshRequired(value: Date) {
    this._refreshRequired = value;
  }

  private _refreshRequired: Date;
  private destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder) {}

  /*
   * PUBLIC VARIABLES to manage interaction
   */

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
   * Handler for onTodoListChange event: used to trigger todolist refresh
   */
  onTodoListChange(event: any): void {
    if (typeof event === 'boolean') {
      this.refreshRequired = new Date();
    }
  }

  onAddTodo(goal: Goal) {
    const goalKey = getGoalKey(this.date, this.goalPeriodType);
    this.addTodo.next({
      ...goal,
      type: this.goalPeriodType,
      scheduledDate: goalKey,
    });
  }

  onDeleteTodo(goal: Goal) {
    this.deleteTodo.next(goal);
  }

  /*
   * Handler, that fires when TODO is dropped on day
   */
  onDropTodo(event: DropContent<Goal>): void {
    this.droppedGoal = event.payload;
  }

  /*
   * Listening to changes to set day as current
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.goalPeriod) {
      this.retroForm = this.formBuilder.group({
        wins: this.goalPeriod.wins,
        obtainedKnowledge: this.goalPeriod.obtainedKnowledge,
        improvementPoints: this.goalPeriod.improvementPoints,
        thoughts: this.goalPeriod.thoughts,
      });
      this.retroForm.valueChanges
        .pipe(
          debounceTime(SAVE_RETRO_FORM_DEBOUNCE_TIME),
          distinctUntilChanged(
            (prev, cur) => JSON.stringify(prev) === JSON.stringify(cur)
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.retroChange.emit({
            ...this.retroForm.value,
            date: getGoalKey(this.date, this.goalPeriodType),
            type: this.goalPeriodType,
          });
        });
    }
  }
}
