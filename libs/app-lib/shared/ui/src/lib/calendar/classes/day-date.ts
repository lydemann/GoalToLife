import { GoalPeriod } from '@app/shared/interfaces';

/*
 Class, that describes day (month field is used to decide, whether day is in current month)
 */
export interface CalendarDate extends Partial<GoalPeriod> {
  dateDate: Date;
  month: number;
  isSelected: boolean;
}
