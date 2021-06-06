import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { getGoalKey } from '@app/app-lib';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { CalendarDate } from '../../calendar/classes/day-date';
import { TODOItem } from '../../calendar/classes/todo-item';

export const SAVE_RETRO_FORM_DEBOUNCE_TIME = 500;

@Component({
  selector: 'app-goal-period',
  templateUrl: './goal-period.component.html',
  styleUrls: ['./goal-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalPeriodComponent implements OnInit, OnChanges, OnDestroy {
  /*
   * PRIVATE variables
   * date (date + month) - used to define whether day is in currently selected month and for further TODO-list logic
   * selected day - selected day
   * highlighted day - some important day ("today" in our case)
   * trigger to alert that refresh of contained todos is required
   */
  private _dayDate: CalendarDate;
  private _refreshRequired: Date;
  private destroy$ = new Subject();
  retroForm: FormGroup;
  @Input() goalPeriodType: GoalPeriodType = GoalPeriodType.DAILY;
  @Input() selected: boolean;
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();
  blurRetroInput: any;

  /*
   * Getters, setters
   */

  @Input() set calendarDate(calendarDate: CalendarDate) {
    this._dayDate = calendarDate;
  }

  get calendarDate(): CalendarDate {
    return this._dayDate;
  }

  get refreshRequired(): Date {
    return this._refreshRequired;
  }

  set refreshRequired(value: Date) {
    this._refreshRequired = value;
  }

  constructor(private formBuilder: FormBuilder) {}

  /*
   * PUBLIC VARIABLES to manage interaction
   */
  droppedTodo: TODOItem;

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
    const goalKey = getGoalKey(this.calendarDate.dateDate, this.goalPeriodType);
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
  onDropTodo(event: any): void {
    this.droppedTodo = event.payload;
  }

  /*
   * initializing component's UI
   */
  ngOnInit(): void {}

  /*
   * Listening to changes to set day as current
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['calendarDate']) {
      this.retroForm = this.formBuilder.group({
        wins: this.calendarDate.wins,
        obtainedKnowledge: this.calendarDate.obtainedKnowledge,
        improvementPoints: this.calendarDate.improvementPoints,
        thoughts: this.calendarDate.thoughts,
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
            date: getGoalKey(this.calendarDate.dateDate, this.goalPeriodType),
            type: this.goalPeriodType,
          });
        });
    }
  }
}
