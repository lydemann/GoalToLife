import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox.component';
import { InboxResolver } from './inbox.resolver';

const routes: Routes = [
  { path: '', component: InboxComponent, resolve: [InboxResolver] },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
