
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { YearlyComponent } from './yearly.component';

const routes: Routes = [
    { path: '', component: YearlyComponent }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class YearlyRoutingModule {}
