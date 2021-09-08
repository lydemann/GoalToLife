import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EditGoalModalComponent } from './edit-goal-modal.component';

@NgModule({
  imports: [CommonModule, TagInputModule, IonicModule, ReactiveFormsModule],
  declarations: [EditGoalModalComponent],
})
export class EditGoalModalModule {}
