import { formatDate } from '@angular/common';

import { GoalPeriodType } from '@app/shared/interfaces';
import { getWeekNumber } from './get-weekly-number';

export const dailyGoalKeyFormat = 'YYYY-MM-dd';

export const getGoalKey = (date: Date, goalPeriodType: GoalPeriodType) => {
  switch (goalPeriodType) {
    case GoalPeriodType.DAILY:
      return getDailyGoalKey(date);
    case GoalPeriodType.WEEKLY:
      return getWeeklyGoalKey(date);
    case GoalPeriodType.MONTHLY:
      return getMonthlyGoalPeriodKey(date.getFullYear(), date.getMonth());
  }
};

export const getDailyGoalKey = (date: Date) => {
  return formatDate(date, dailyGoalKeyFormat, 'en');
};

export const getWeeklyGoalKey = (date: Date) => {
  const weekNumber = getWeekNumber(date);
  return `${date.getFullYear()}-w${weekNumber}`;
};

export const getWeeklyGoalKeyFromWeekumber = (
  year: number,
  weekNumber: number
) => {
  return `${year}-w${weekNumber}`;
};

export const getMonthlyGoalPeriodKey = (year: number, month: number) => {
  return `${year}-${month}`;
};
