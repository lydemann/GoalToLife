import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/app-lib/shared/ui';

import { WeeklyRoutingModule } from './weekly-routing.module';
import { WeeklyComponent } from './weekly.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WeeklyRoutingModule
  ],
  declarations: [WeeklyComponent]
})
export class WeeklyModule { }
