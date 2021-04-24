import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { TaskModule } from '../task/task.module';
import { TaskGroupComponent } from './task-group.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TaskModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  declarations: [TaskGroupComponent],
  exports: [TaskGroupComponent],
})
export class TaskGroupModule {}
