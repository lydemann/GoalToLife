import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuarterlyComponent } from './quarterly.component';
import { QuarterlyRoutingModule } from './quarterly-routing.module';

@NgModule({
  imports: [
    CommonModule,
    QuarterlyRoutingModule
  ],
  declarations: [QuarterlyComponent]
})
export class QuarterlyModule { }
