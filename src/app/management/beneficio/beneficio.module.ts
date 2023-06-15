import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficioComponent } from './beneficio.component';
import { BeneficioRoutingModule } from './beneficio-routing.module';
import { CuentaBcComponent } from './components/cuenta-bc/cuenta-bc.component';
import { SolicitudBcComponent } from './components/solicitud-bc/solicitud-bc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CerrarConfirmarCuentaComponent } from './components/cerrar-confirmar-cuenta/cerrar-confirmar-cuenta.component';
import { MatTableComponent } from '../mat-table/mat-table.component';


@NgModule({
  declarations: [
    BeneficioComponent,
    CuentaBcComponent,
    SolicitudBcComponent,
    CerrarConfirmarCuentaComponent,
  ],
  imports: [
    CommonModule,
    BeneficioRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    MatTableComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BeneficioModule {}
