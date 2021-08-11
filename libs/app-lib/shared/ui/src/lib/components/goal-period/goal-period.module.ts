import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DragAndDropModule } from '../../drag-and-drop/drag-and-drop.module';
import { GoalPeriodComponent } from './goal-period.component';
import { TODOListComponent } from './todolist';

@NgModule({
  imports: [CommonModule, IonicModule, ReactiveFormsModule, DragAndDropModule],
  declarations: [GoalPeriodComponent, TODOListComponent],
  exports: [GoalPeriodComponent],
})
export class GoalPeriodModule {}
