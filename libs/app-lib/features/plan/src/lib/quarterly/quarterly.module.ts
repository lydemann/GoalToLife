import { NgModule } from '@angular/core';
import { SharedModule } from '@app/app-lib/shared/ui';
import { QuarterlyRoutingModule } from './quarterly-routing.module';
import { QuarterlyComponent } from './quarterly.component';

@NgModule({
  imports: [
    SharedModule,
    QuarterlyRoutingModule
  ],
  declarations: [QuarterlyComponent]
})
export class QuarterlyModule { }
