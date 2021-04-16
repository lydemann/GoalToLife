import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

const exportedDeclarations = [TaskComponent];

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  declarations: [...exportedDeclarations],
  exports: [...exportedDeclarations],
})
export class TaskModule {}
