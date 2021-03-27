import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TaskModule } from './components/task/task.module';
import { HeaderModule } from './components/header/header.module';
import { TaskGroupModule } from './components/task-group/task-group.module';

const exportedModules = [
  CommonModule,
  IonicModule,
  TaskModule,
  HeaderModule,
  TaskGroupModule,
];

@NgModule({
  declarations: [],
  imports: [...exportedModules],
  exports: [...exportedModules],
  providers: [],
})
export class SharedModule {}
