import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';
import { MonthComponent } from './components/month/month.component';
import { DayComponent } from './components/day/day.component';
import { TODOListComponent } from './components/todolist/todolist.component';

import { MakeDraggable } from './directives/make-draggable.directive';
import { MakeDroppable } from './directives/make-droppable.directive';
import { CommonModule } from '@angular/common';
import { TaskModule } from '../components/task/task.module';

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
    TaskModule
  ],
  providers: [],
  exports: [CalendarHeaderComponent, MonthComponent],
})
export class CalendarModule {}
