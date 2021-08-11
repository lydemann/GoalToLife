import { formatDate } from '@angular/common';

import { GoalPeriodType } from '@app/shared/domain';
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
    case GoalPeriodType.QUARTERLY:
      return getQuarterlyGoalPeriodKeyFromDate(date);
    case GoalPeriodType.YEARLY:
      return getYearlyGoalPeriodKey(date.getFullYear());
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

export const getYearlyGoalPeriodKey = (year: number) => {
  return `${year}`;
};

export const getQuarterlyGoalPeriodKey = (year: number, quarter: number) => {
  return `${year}-q${quarter}`;
};

export const getQuarterlyGoalPeriodKeyFromDate = (date: Date) => {
  const quarter = Math.floor((date.getMonth() + 3) / 3);
  return `${date.getFullYear()}-q${quarter}`;
};
