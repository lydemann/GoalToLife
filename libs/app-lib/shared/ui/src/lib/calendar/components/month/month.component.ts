import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';

import { getDailyGoalKey } from '@app/app-lib';
import { Goal, GoalPeriod, GoalPeriodType } from '@app/shared/interfaces';
import { CalendarDate } from '../../classes/day-date';
import { Week } from '../../classes/weeks';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthComponent implements OnInit, OnChanges {
  /*
   * PRIVATE variables
   * current date - day today
   * calendar date - used to define which month is currently selected
   */
  private _calendarDate: Date;
  private _currentDate: Date;

  @Input() swapAxis = true;

  /*
   * Getters, setters and inputs
   */

  @Input() goalPeriods: Record<string, GoalPeriod> = {};

  @Input() set calendarDate(calendarDate: Date) {
    this._calendarDate = calendarDate;
  }

  get calendarDate() {
    return this._calendarDate;
  }

  @Input() set currentDate(currentDate: Date) {
    this._currentDate = currentDate;
  }

  @Output() addTodo = new EventEmitter<Goal>();
  @Output() deleteTodo = new EventEmitter<Goal>();
  @Output() editTodo = new EventEmitter<Goal>();
  @Output() toggleComplete = new EventEmitter<Goal>();
  @Output() retroChange = new EventEmitter<Partial<GoalPeriod>>();

  get currentDate() {
    return this._currentDate;
  }

  /*
   * PUBLIC VARIABLES to manage interaction and render UI
   */
  weeks: Week[];
  days: CalendarDate[];
  selected: Date;
  highlited: Date;
  dayHeaders: string[];

  /*
   * CONSTRUCTOR
   * initializing headers of day (week: Monday -> Sunday)
   */
  constructor() {
    this.dayHeaders = ['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    this.weeks = [];
  }

  weeksTrackBy(idx, item: Week) {
    return item.weekNumber;
  }
  daysTrackBy(idx, item: CalendarDate) {
    return item.date;
  }

  /*
   * Helper method to add days to some date
   */
  private _addDays(date: Date, days: number = 1): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /*
   * Helper method to build week: generates sequence of days and sets their attributes
   */
  private _buildWeek(start: Date, month: number): CalendarDate[] {
    const days: CalendarDate[] = [];
    let date: Date = new Date(start.setHours(0, 0, 0, 0));
    for (let i = 0; i < 7; i++) {
      const dailyGoalKey = getDailyGoalKey(date);
      const goalPeriod =
        this.goalPeriods[dailyGoalKey] ||
        ({ type: GoalPeriodType.DAILY, goals: [] } as GoalPeriod);
      const isSelected = date?.getTime() === this.selected?.getTime();
      days.push({
        ...goalPeriod,
        dateDate: date,
        month,
        isSelected,
      });
      date = this._addDays(date, 1);
    }
    return days;
  }

  private getWeekNumber(date: Date) {
    /* For a given date, get the ISO week number
     *
     * Based on information at:
     *
     *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
     *
     * Algorithm is to find nearest thursday, it's year
     * is the year of the week number. Then get weeks
     * between that date and the first day of that year.
     *
     * Note that dates in one year can be weeks of previous
     * or next year, overlap is up to 3 days.
     *
     * e.g. 2014/12/29 is Monday in week  1 of 2015
     *      2012/1/1   is Sunday in week 52 of 2011
     */
    // Copy date so don't modify original
    date = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(((+date - +yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    return weekNo;
  }

  /*
   * Helper method to build month of weeks: generates sequence of weeks and sets their attributes
   */
  private _buildMonth(): void {
    const month: number = this._calendarDate.getMonth();
    let firstDay: Date = this._calendarDate;

    /* getting start date of month (weird part):
       not calendar one, but 35-cell one - not necessary this is 1st of, e.g., January
    */
    while (firstDay.getDay() === 0 ? 7 : firstDay.getDay() >= 1) {
      if (firstDay.getDay() === 1) {
        break;
      } else {
        firstDay = this._addDays(firstDay, -1);
      }
    }

    // there are max 48 cells (6 weeks) in our monthly calendar (checked against various apps and tested against Jan-2017)
    for (let i = 0; i < 6; i++) {
      this.weeks.push({
        weekNumber: this.getWeekNumber(firstDay),
        days: this._buildWeek(firstDay, month),
      });
      firstDay = this._addDays(firstDay, 7);
    }

    // Removing last week if it does not belong to current month (checking only 1st day)
    const weekRemoveException = new Error(
      'Error occured while removing last week of month.'
    );
    try {
      if (
        this.weeks[5]['days'][0].month !==
        new Date(this.weeks[5]['days'][0].date).getMonth()
      ) {
        this.weeks.splice(5, 1);
      }
    } catch (weekRemoveException) {
      // exception handler intentionally left blank
    }
  }

  // handle click on day - set day as "selected"
  onDayClick(calendarDate: Date): void {
    this.selected = calendarDate;
  }

  // highlighting "today" day
  ngOnInit(): void {
    this.highlited = this._currentDate;
  }

  // listening to change of month to refresh calendar
  ngOnChanges(changes: any): void {
    this.weeks = [];
    this._buildMonth();
  }

  onAddTodo(goal: Goal) {
    this.addTodo.next(goal);
  }

  onDeleteTodo(goal: Goal) {
    this.deleteTodo.next(goal);
  }
}
