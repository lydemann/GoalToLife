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
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import { getDailyGoalKey } from '@app/app-lib';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { CalendarDate } from '../../classes/day-date';
import { TODOItem } from '../../classes/todo-item';

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
  private _dayDate: CalendarDate;
  private _selected: Date;
  private _highlited: Date;
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

  @Input() set calendarDate(calendarDate: CalendarDate) {
    this._dayDate = calendarDate;
  }

  get calendarDate(): CalendarDate {
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

  /*
   * PUBLIC VARIABLES to manage interaction
   */
  currentClasses = {};
  droppedTodo: TODOItem;

  /*
   * CONSTRUCTOR
   * nothing interesting here
   */
  constructor(private host: ElementRef<HTMLElement>) {}

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

  private isSelected(): boolean {
    return this._selected === this._dayDate.dateDate ? true : false;
  }

  private isHighlited(): boolean {
    const highLightedTime = this._highlited.getTime();
    const dayTime = this._dayDate.dateDate.getTime();
    return highLightedTime === dayTime ? true : false;
  }

  onAddTodo(goal: Goal) {
    const dailyGoalKey = getDailyGoalKey(this.calendarDate.dateDate);
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

  private _isCurrentMonth(): boolean {
    return this._dayDate.dateDate.getMonth() === this._dayDate.month
      ? true
      : false;
  }

  /*
   * Listening to changes to set day as current
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.currentClasses['selectedDay'] = this.isSelected();
    this.calendarDate.isSelected =
      this.calendarDate.dateDate?.getTime() === this.selected?.getTime();
    if (changes['calendarDate']) {
      const isCurrentDay = this.isHighlited();
      this.currentClasses = {
        currentMonth: this._isCurrentMonth(),
        selectedDay: null,
        highlightedDay: isCurrentDay,
      };
    }
  }
}
