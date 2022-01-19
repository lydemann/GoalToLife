import { formatDate } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import {
  getGoalKey,
  Goal,
  GoalPeriod,
  GoalPeriodType,
} from '@app/shared/domain';
import { getWeekNumber } from '@app/shared/util';
import { CalendarDate } from '../../classes/day-date';
import { DropContent } from '../../../drag-and-drop/directives/drop-content';

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
export class DayComponent implements OnChanges, OnDestroy, AfterViewInit {
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
  isSelected: boolean;
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

  private _isWeek: boolean;
  public get isWeek(): boolean {
    return this._isWeek;
  }
  @Input()
  public set isWeek(isWeek: boolean) {
    this._isWeek = isWeek;
    this.goalPeriodType = isWeek ? GoalPeriodType.WEEKLY : GoalPeriodType.DAILY;
  }

  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();
  @Output() replaceGoal = new EventEmitter<DropContent<Goal>>();
  blurRetroInput: any;

  /*
   * PUBLIC VARIABLES to manage interaction
   */
  currentClasses = {};
  goalPeriodType: GoalPeriodType = GoalPeriodType.DAILY;
  formattedDate: string;

  /*
   * CONSTRUCTOR
   * nothing interesting here
   */
  constructor(private host: ElementRef<HTMLElement>) {
    // TODO: handle clicked outside deselect
  }

  ngAfterViewInit(): void {
    const isCurrentDay = this.isHighlighted();
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

  @HostListener('document:click', ['$event'])
  clickOutside(event) {
    if (!this.host.nativeElement.contains(event.target)) {
      this.isSelected = false;
    }
  }

  /*
   * Setting day as active
   */
  setActiveState() {
    this.isSelected = true;
  }

  private getIsSelected(): boolean {
    return this._selected === this._dayDate.date ? true : false;
  }

  private isHighlighted(): boolean {
    const highLightedTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    ).getTime();
    const dayTime = this._dayDate.date.getTime();
    return highLightedTime === dayTime ? true : false;
  }

  onAddTodo(goal: Goal) {
    const goalKey = getGoalKey(this.calendarDate.date, this.goalPeriodType);
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
    this.replaceGoal.next(event);
  }

  private _isCurrentMonth(): boolean {
    return this._dayDate.date.getMonth() === this._dayDate.month ? true : false;
  }

  /*
   * Listening to changes to set day as current
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isWeek) {
      const weekNumber = getWeekNumber(this.calendarDate.date);
      this.formattedDate = `Week: ${weekNumber}`;
    } else {
      this.formattedDate = formatDate(this.calendarDate.date, 'dd', 'en');
    }

    this.currentClasses['selectedDay'] = this.getIsSelected();
    this.calendarDate.isSelected =
      this.calendarDate.date?.getTime() === this.selected?.getTime();
    if (changes['calendarDate']) {
      const isCurrentDay = this.isHighlighted();
      this.currentClasses = {
        currentMonth: this._isCurrentMonth(),
        selectedDay: null,
        highlightedDay: isCurrentDay,
        week: this.isWeek,
      };
    }
  }
}
