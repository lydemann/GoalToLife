import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/app-lib/shared/ui';
import { ReactiveFormsModule } from '@angular/forms';
import { InboxComponent } from './inbox.component';
import { SettingsRoutingModule } from './inbox-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [InboxComponent],
})
export class InboxModule {}
