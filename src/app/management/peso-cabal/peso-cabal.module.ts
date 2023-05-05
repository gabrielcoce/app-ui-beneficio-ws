import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PesoCabalComponent } from './peso-cabal.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PesoCabalComponent,
  },
];

@NgModule({
  declarations: [PesoCabalComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PesoCabalModule {}
