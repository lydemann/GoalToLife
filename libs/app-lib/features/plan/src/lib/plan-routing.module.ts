import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
        pathMatch: 'full',
        redirectTo: 'monthly',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanRoutingModule {}
