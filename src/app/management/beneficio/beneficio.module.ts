import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficioComponent } from './beneficio.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BeneficioComponent,
  },
];

@NgModule({
  declarations: [BeneficioComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BeneficioModule {}
