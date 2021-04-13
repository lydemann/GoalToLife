import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

/*
 * This component is used to render header with month name and buttons to change month.
 * It emits event with new month.
 */
@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit {
  /*
   * PRIVATE VARIABLES
   * currently selected date/month (used to show month and year) in header
   * button parameters
   * month and year for UI
   */
  private _calendarDate : Date;

  private _month : string;
  private _year : number;

  /*
   * Getters for month and year
   */

  get month(): string {
    return this._month;
  }

  get year(): number {
    return this._year;
  }

  /*
   * PUBLIC VARIABLES to manage interaction
   */

  FORWARD : string = 'FORWARD';
  BACK : string = 'BACK';

  /*
   * Input: calendar date for root component + getter
   */
  @Input()
  set calendarDate ( calendarDate : Date ) {
    this._calendarDate = calendarDate;
  }

  get calendarDate () : Date {
    return this._calendarDate;
  }

  /*
   * Output to emit event on month change
   */
  @Output('onMonthChange') monthChange = new EventEmitter<Date>();

  /*
   * CONSTRUCTOR
   * does nothing special
   */
  constructor() {

  }

  // setting month and year to display (month - in english, year - full 4-digit)
  private setMonthDisplay () : void {
    this._month = this.calendarDate.toLocaleString('en-us', <DateTimeFormatOptions>{month: 'long'});
  }

  private setYearDisplay () : void {
    this._year = this.calendarDate.getFullYear();
  }

  // handler for button clicks: changing months forward (+1) and backward (-1)
  onDirectionClick (direction : string) : void {
    // changing month
    let newMonth = this.calendarDate.getMonth();
    switch (direction) {
      case this.FORWARD: {
        if (++newMonth > 11) {
          this.calendarDate.setFullYear(this.calendarDate.getFullYear()+1);
          newMonth = 0;
        }
        this.calendarDate.setMonth(newMonth);
        break;
      }
      case this.BACK: {
        if (--newMonth < 0) {
          this.calendarDate.setFullYear(this.calendarDate.getFullYear()-1);
          newMonth = 11;
        }
        this.calendarDate.setMonth(newMonth);
        break;
      }
    }

    // displaying month and year
    this.setMonthDisplay();
    this.setYearDisplay();

    // done
    this.monthChange.emit(this.calendarDate);
  }

  // initializing and displaying month and year in header of calendar
  ngOnInit() : void {
    this.setMonthDisplay();
    this.setYearDisplay();
  }

}
