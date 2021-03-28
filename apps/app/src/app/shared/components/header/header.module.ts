import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }
