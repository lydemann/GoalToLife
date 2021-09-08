import { GoalPeriod } from '@app/shared/domain';

/*
 Class, that describes day (month field is used to decide, whether day is in current month)
 */
export interface CalendarDate {
  date: Date;
  month: number;
  isSelected: boolean;
  goalPeriod: GoalPeriod;
}
