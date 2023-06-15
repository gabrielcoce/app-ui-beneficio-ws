import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PesoCabalComponent } from './peso-cabal.component';
import { PesoCabalRoutingModule } from './peso-cabal-routing.module';
import { ParcialidadPcComponent } from './components/parcialidad-pc/parcialidad-pc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTableComponent } from '../mat-table/mat-table.component';
import { RegistrarParcialidadComponent } from './components/registrar-parcialidad/registrar-parcialidad.component';
import { ParcialidadesRegistradasComponent } from './components/parcialidades-registradas/parcialidades-registradas.component';

@NgModule({
  declarations: [PesoCabalComponent, ParcialidadPcComponent, RegistrarParcialidadComponent, ParcialidadesRegistradasComponent],
  imports: [
    CommonModule,
    PesoCabalRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    MatTableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PesoCabalModule {}
