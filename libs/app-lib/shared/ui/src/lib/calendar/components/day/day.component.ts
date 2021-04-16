import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Goal, GoalPeriodType } from '@app/shared/interfaces';

import { getDailyGoalKey } from '../../../utils/goal-utils';
import { DayDate } from '../../classes/day-date';
import { TODOItem } from '../../classes/todo-item';

/*
 * This component is used to render "day" with all the contents
 */
@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['day.component.scss'],
})
export class DayComponent implements OnInit, OnChanges {
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
  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();

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
  constructor() {}

  /*
   * Setting day as active
   */
  setActiveState() {
    this.selected = this._dayDate.date;
  }

  /*
   * Various checks, that are used to style day
   */
  private _isCurrentMonth(): boolean {
    return this._dayDate.date.getMonth() === this._dayDate.month ? true : false;
  }

  private isSelected(): boolean {
    return this._selected === this._dayDate.date ? true : false;
  }

  private isHighlited(): boolean {
    return this._highlited.getTime() === this._dayDate.date.getTime()
      ? true
      : false;
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
    const dailyGoalKey = getDailyGoalKey(this.dayDate.date);
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
  ngOnInit(): void {
    this.currentClasses = {
      currentMonth: this._isCurrentMonth(),
      selectedDay: null,
      highlitedDay: this.isHighlited(),
    };
  }

  /*
   * Listening to changes to set day as current
   */
  ngOnChanges(changes: any): void {
    this.currentClasses['selectedDay'] = this.isSelected();
    this.dayDate.isSelected =
      this.dayDate.date?.getTime() === this.selected?.getTime();
  }
}
