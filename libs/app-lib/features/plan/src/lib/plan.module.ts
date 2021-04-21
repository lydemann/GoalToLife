import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/app-lib/shared/ui';

import { PlanRoutingModule } from './plan-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlanRoutingModule,
    SharedModule
  ]
})
export class PlanModule { }
