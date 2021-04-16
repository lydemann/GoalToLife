
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuarterlyComponent } from './quarterly.component';

const routes: Routes = [
    { path: '', component: QuarterlyComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class QuarterlyRoutingModule {}
