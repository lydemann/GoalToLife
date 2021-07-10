import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@app/app-lib/shared/ui';
import { YearlyRoutingModule } from './yearly-routing.module';
import { YearlyComponent } from './yearly.component';

@NgModule({
  imports: [CommonModule, YearlyRoutingModule, SharedModule],
  declarations: [YearlyComponent],
})
export class YearlyModule {}
