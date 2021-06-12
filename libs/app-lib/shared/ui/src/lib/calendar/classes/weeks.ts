import { GoalPeriod } from '@app/shared/interfaces';
import { CalendarDate } from './day-date';

export interface Week extends CalendarDate, Partial<GoalPeriod> {
  weekNumber: number;
  days: CalendarDate[];
  dateDate: Date;
  isSelected: boolean;
}
