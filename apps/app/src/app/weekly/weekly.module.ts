import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeeklyComponent } from './weekly.component';
import { WeeklyRoutingModule } from './weekly-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    WeeklyRoutingModule
  ],
  declarations: [WeeklyComponent]
})
export class WeeklyModule { }
