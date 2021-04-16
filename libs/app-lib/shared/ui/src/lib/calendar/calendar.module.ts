import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TaskModule } from '../components/task/task.module';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { DayComponent } from './components/day/day.component';
import { MonthComponent } from './components/month/month.component';
import { TODOListComponent } from './components/todolist/todolist.component';
import { MakeDraggable } from './directives/make-draggable.directive';
import { MakeDroppable } from './directives/make-droppable.directive';

@NgModule({
  declarations: [
    CalendarHeaderComponent,
    MonthComponent,
    DayComponent,
    TODOListComponent,
    MakeDraggable,
    MakeDroppable,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TaskModule,
    IonicModule,
  ],
  providers: [],
  exports: [CalendarHeaderComponent, MonthComponent],
})
export class CalendarModule {}
