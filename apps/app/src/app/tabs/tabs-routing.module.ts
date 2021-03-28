import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'plan',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../plan/daily/daily.module').then((m) => m.DailyModule),
          },
          {
            path: 'weekly',
            loadChildren: () =>
              import('../plan/weekly/weekly.module').then((m) => m.WeeklyModule),
          },
          {
            path: 'monthly',
            loadChildren: () =>
              import('../plan/monthly/monthly.module').then((m) => m.MonthlyModule),
          },
          {
            path: 'quarterly',
            loadChildren: () =>
              import('../plan/quarterly/quarterly.module').then((m) => m.QuarterlyModule),
          },
          {
            path: 'yearly',
            loadChildren: () =>
              import('../plan/yearly/yearly.module').then((m) => m.YearlyModule),
          },
        ],
      },
      {
        path: 'inbox',
        loadChildren: () => import('../inbox/inbox.module').then((m) => m.InboxModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then((m) => m.SettingsModule)
      },
      {
        path: '',
        redirectTo: '/plan',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/plan',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
