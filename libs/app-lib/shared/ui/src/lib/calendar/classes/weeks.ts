import { CalendarDate } from './day-date';

export interface Week extends CalendarDate {
  weekNumber: number;
  days: CalendarDate[];
}
