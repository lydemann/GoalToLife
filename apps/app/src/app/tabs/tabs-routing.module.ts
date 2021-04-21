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
        loadChildren: () => import('@app/app-lib/features/plan').then(m => m.PlanModule)
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
