import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { GoalPeriodModule } from '../components/goal-period/goal-period.module';
import { TaskModule } from '../components/task/task.module';
import { DragAndDropModule } from '../drag-and-drop/drag-and-drop.module';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { DayComponent } from './components/day/day.component';
import { MonthComponent } from './components/month/month.component';
import { WeekComponent } from './components/week/week.component';

@NgModule({
  declarations: [
    CalendarHeaderComponent,
    MonthComponent,
    DayComponent,
    WeekComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskModule,
    IonicModule,
    GoalPeriodModule,
    DragAndDropModule,
  ],
  providers: [],
  exports: [CalendarHeaderComponent, MonthComponent],
})
export class CalendarModule {}
