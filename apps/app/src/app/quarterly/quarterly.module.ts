import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuarterlyComponent } from './quarterly.component';
import { QuarterlyRoutingModule } from './quarterly-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    QuarterlyRoutingModule
  ],
  declarations: [QuarterlyComponent]
})
export class QuarterlyModule { }
