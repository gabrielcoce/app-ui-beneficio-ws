import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgricultorComponent } from './agricultor.component';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { ParcialidadComponent } from './components/parcialidad/parcialidad.component';

const routes: Routes = [
  {
    path: '',
    component: AgricultorComponent,
    children: [
      {
        path: 'solicitud',
        component: SolicitudComponent,
      },
      {
        path: 'cuenta',
        component: CuentaComponent,
      },
      {
        path: 'parcialidad',
        component: ParcialidadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgricultorRoutingModule {}
