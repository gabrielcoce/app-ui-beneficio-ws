import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeneficioComponent } from './beneficio.component';
import { BeneficioRoutingModule } from './beneficio-routing.module';
import { CuentaBcComponent } from './components/cuenta-bc/cuenta-bc.component';
import { SolicitudBcComponent } from './components/solicitud-bc/solicitud-bc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [BeneficioComponent, CuentaBcComponent, SolicitudBcComponent],
  imports: [
    CommonModule,
    BeneficioRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BeneficioModule {}
