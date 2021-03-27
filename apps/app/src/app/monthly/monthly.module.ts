import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthlyComponent } from './monthly.component';
import { MonthlyRoutingModule } from './monthly-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MonthlyRoutingModule,
    SharedModule
  ],
  declarations: [MonthlyComponent]
})
export class MonthlyModule { }
