import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from './daily.component';
import { TasksRoutingModule } from './daily-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    TasksRoutingModule,
    IonicModule
  ],
  declarations: [DailyComponent]
})
export class DailyModule { }
