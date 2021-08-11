import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { CalendarModule } from './calendar/calendar.module';
import { GoalPeriodModule } from './components/goal-period/goal-period.module';
import { HeaderModule } from './components/header/header.module';
import { TaskGroupModule } from './components/task-group/task-group.module';
import { TaskModule } from './components/task/task.module';

const exportedModules = [
  CommonModule,
  IonicModule,
  TaskModule,
  HeaderModule,
  TaskGroupModule,
  CalendarModule,
  GoalPeriodModule,
];

@NgModule({
  declarations: [],
  imports: [...exportedModules],
  exports: [...exportedModules],
  providers: [],
})
export class SharedModule {}
