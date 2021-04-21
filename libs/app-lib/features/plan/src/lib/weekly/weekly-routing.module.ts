
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WeeklyComponent } from './weekly.component';

const routes: Routes = [
    { path: '', component: WeeklyComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WeeklyRoutingModule {}
