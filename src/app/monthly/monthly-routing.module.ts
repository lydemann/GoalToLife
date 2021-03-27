
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MonthlyComponent } from './monthly.component';

const routes: Routes = [
    { path: '', component: MonthlyComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MonthlyRoutingModule {}
