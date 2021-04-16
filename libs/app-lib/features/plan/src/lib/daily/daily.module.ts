import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyComponent } from './daily.component';
import { TasksRoutingModule } from './daily-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@app/app-lib/shared/ui';

@NgModule({
  imports: [
    CommonModule,
    TasksRoutingModule,
    IonicModule,
    SharedModule
  ],
  declarations: [DailyComponent]
})
export class DailyModule { }
