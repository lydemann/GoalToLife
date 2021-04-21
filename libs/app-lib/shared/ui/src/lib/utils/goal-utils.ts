import { formatDate } from '@angular/common';

export const dailyGoalKeyFormat = 'YYYY-MM-dd';

export const getDailyGoalKey = (date: Date) => {
  return formatDate(date, dailyGoalKeyFormat, 'en');
};
