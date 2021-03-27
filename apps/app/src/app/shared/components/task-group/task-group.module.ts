import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskGroupComponent } from './task-group.component';
import { IonicModule } from '@ionic/angular';
import { TaskModule } from '../task/task.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TaskModule,
    RouterModule
  ],
  declarations: [TaskGroupComponent],
  exports: [TaskGroupComponent]
})
export class TaskGroupModule { }
