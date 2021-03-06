import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/app-lib/shared/ui';

import { MonthlyRoutingModule } from './monthly-routing.module';
import { MonthlyComponent } from './monthly.component';

@NgModule({
  imports: [CommonModule, MonthlyRoutingModule, RouterModule, SharedModule],
  declarations: [MonthlyComponent],
})
export class MonthlyModule {}
