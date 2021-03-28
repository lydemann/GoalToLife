import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YearlyComponent } from './yearly.component';
import { YearlyRoutingModule } from './yearly-routing.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    YearlyRoutingModule,
    SharedModule
  ],
  declarations: [YearlyComponent]
})
export class YearlyModule { }
