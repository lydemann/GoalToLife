import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { getDailyGoalKey } from '../../../utils/goal-utils';
import { DayDate } from '../../classes/day-date';
import { TODOItem } from '../../classes/todo-item';

export const SAVE_RETRO_FORM_DEBOUNCE_TIME = 500;

/*
 * This component is used to render "day" with all the contents
 */
@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DayComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  /*
   * PRIVATE variables
   * date (date + month) - used to define whether day is in currently selected month and for further TODO-list logic
   * selected day - selected day
   * highlighted day - some important day ("today" in our case)
   * trigger to alert that refresh of contained todos is required
   */
  private _dayDate: DayDate;
  private _selected: Date;
  private _highlited: Date;
  private _refreshRequired: Date;
  private destroy$ = new Subject();
  retroForm: FormGroup;
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();
  blurRetroInput: any;

  /*
   * Getters, setters and inputs
   */

  @Input() set dayDate(dayDate: DayDate) {
    this._dayDate = dayDate;
  }

  get dayDate(): DayDate {
    return this._dayDate;
  }

  @Input() set selected(selected: Date) {
    this._selected = selected;
  }

  get selected() {
    return this._selected;
  }

  @Input() set highlited(highlited: Date) {
    this._highlited = highlited;
  }

  get refreshRequired(): Date {
    return this._refreshRequired;
  }

  set refreshRequired(value: Date) {
    this._refreshRequired = value;
  }

  /*
   * PUBLIC VARIABLES to manage interaction
   */
  currentClasses = {};
  droppedTodo: TODOItem;

  /*
   * CONSTRUCTOR
   * nothing interesting here
   */
  constructor(
    private formBuilder: FormBuilder,
    private host: ElementRef<HTMLElement>
  ) {}

  ngAfterViewInit(): void {
    const isCurrentDay = this.isHighlited();
    if (isCurrentDay) {
      setTimeout(() => {
        this.host.nativeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'center',
        });
      }, 300);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
   * Setting day as active
   */
  setActiveState() {
    this.selected = this._dayDate.dateDate;
  }

  /*
   * Various checks, that are used to style day
   */
  private _isCurrentMonth(): boolean {
    return this._dayDate.dateDate.getMonth() === this._dayDate.month
      ? true
      : false;
  }

  private isSelected(): boolean {
    return this._selected === this._dayDate.dateDate ? true : false;
  }

  private isHighlited(): boolean {
    const highLightedTime = this._highlited.getTime();
    const dayTime = this._dayDate.dateDate.getTime();
    return highLightedTime === dayTime ? true : false;
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
    const dailyGoalKey = getDailyGoalKey(this.dayDate.dateDate);
    this.addTodo.next({
      ...goal,
      type: GoalPeriodType.DAILY,
      scheduledDate: dailyGoalKey,
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
    this.currentClasses['selectedDay'] = this.isSelected();
    this.dayDate.isSelected =
      this.dayDate.dateDate?.getTime() === this.selected?.getTime();

    if (changes['dayDate']) {
      this.retroForm = this.formBuilder.group({
        wins: this.dayDate.wins,
        obtainedKnowledge: this.dayDate.obtainedKnowledge,
        improvementPoints: this.dayDate.improvementPoints,
        thoughts: this.dayDate.thoughts,
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
            date: getDailyGoalKey(this.dayDate.dateDate),
            type: GoalPeriodType.DAILY,
          });
        });

      const isCurrentDay = this.isHighlited();
      this.currentClasses = {
        currentMonth: this._isCurrentMonth(),
        selectedDay: null,
        highlightedDay: isCurrentDay,
      };
    }
  }
}
