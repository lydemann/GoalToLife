import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MONTH_PARAM_KEY, YEAR_PARAM_KEY } from '@app/app-lib';

import { RedirectToCurrentMonthResolver } from './monthly/redirect-to-current-month.resolver';

export const planRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'daily',
        loadChildren: () =>
          import('./daily/daily.module').then((m) => m.DailyModule),
      },
      {
        path: 'weekly',
        loadChildren: () =>
          import('./weekly/weekly.module').then((m) => m.WeeklyModule),
      },
      {
        path: 'monthly',
        resolve: [RedirectToCurrentMonthResolver],
      },
      {
        path: `monthly/:${YEAR_PARAM_KEY}/:${MONTH_PARAM_KEY}`,
        loadChildren: () =>
          import('./monthly/monthly.module').then((m) => m.MonthlyModule),
      },
      {
        path: 'quarterly',
        loadChildren: () =>
          import('./quarterly/quarterly.module').then((m) => m.QuarterlyModule),
      },
      {
        path: 'yearly',
        loadChildren: () =>
          import('./yearly/yearly.module').then((m) => m.YearlyModule),
      },
      {
        path: '',
        redirectTo: 'monthly',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(planRoutes)],
  exports: [RouterModule],
})
export class PlanRoutingModule {}
