import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgricultorComponent } from './agricultor.component';

const routes: Routes = [
  {
    path: '',
    component: AgricultorComponent,
  },
];
@NgModule({
  declarations: [AgricultorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AgricultorModule {}
