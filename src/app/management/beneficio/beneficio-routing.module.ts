import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeneficioComponent } from './beneficio.component';
import { SolicitudBcComponent } from './components/solicitud-bc/solicitud-bc.component';
import { CuentaBcComponent } from './components/cuenta-bc/cuenta-bc.component';


const routes: Routes = [
  {
    path: '',
    component: BeneficioComponent,
    children: [
      {
        path: 'cuenta',
        component: CuentaBcComponent,
      },
      {
        path: 'solicitud',
        component: SolicitudBcComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeneficioRoutingModule {}
