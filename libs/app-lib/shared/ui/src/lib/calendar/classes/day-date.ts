import { Goal } from '@app/shared/interfaces';

/*
 Class, that describes day (month field is used to decide, whether day is in current month)
 */
export class DayDate {
  date : Date;
  month : number;
  goals: Goal[]
  isSelected: boolean;
}
