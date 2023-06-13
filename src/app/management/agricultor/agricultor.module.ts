import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgricultorComponent } from './agricultor.component';
import { MaterialModule } from 'src/app/material.module';
import { SolicitudComponent } from './components/solicitud/solicitud.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';
import { ParcialidadComponent } from './components/parcialidad/parcialidad.component';
import { AgricultorRoutingModule } from './agricultor-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableComponent } from '../mat-table/mat-table.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CrearCuentaComponent } from '../beneficio/components/modals/crear-cuenta/crear-cuenta.component';
import { CrearSolicitudComponent } from './components/modals/crear-solicitud/crear-solicitud.component';
import { CrearParcialidadComponent } from './components/modals/crear-parcialidad/crear-parcialidad.component';


@NgModule({
  declarations: [
    AgricultorComponent,
    SolicitudComponent,
    CuentaComponent,
    ParcialidadComponent,
    CrearCuentaComponent,
    CrearSolicitudComponent,
    CrearParcialidadComponent,
    //MatTableComponent,
  ],
  imports: [
    CommonModule,
    AgricultorRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AgricultorModule {}
