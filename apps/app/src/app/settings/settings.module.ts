import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/app-lib/shared/ui';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, SettingsRoutingModule],
  declarations: [SettingsComponent],
})
export class SettingsModule {}
