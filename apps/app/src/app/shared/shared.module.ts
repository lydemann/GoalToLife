import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

const exportedModules = [CommonModule, IonicModule];

@NgModule({
  declarations: [],
  imports: [...exportedModules],
  exports: [...exportedModules],
  providers: [],
})
export class SharedModule {}
