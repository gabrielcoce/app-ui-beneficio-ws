import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PesoCabalComponent } from './peso-cabal.component';
import { ParcialidadPcComponent } from './components/parcialidad-pc/parcialidad-pc.component';

const routes: Routes = [
  {
    path: '',
    component: PesoCabalComponent,
    children: [
      {
        path: 'parcialidad',
        component: ParcialidadPcComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesoCabalRoutingModule {}
