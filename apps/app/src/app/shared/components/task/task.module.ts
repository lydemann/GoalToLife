import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { IonicModule } from '@ionic/angular';

const exportedDeclarations = [TaskComponent];

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [...exportedDeclarations],
  exports: [...exportedDeclarations]
})
export class TaskModule { }
