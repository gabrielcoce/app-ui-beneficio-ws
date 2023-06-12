import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearCuentaComponent } from '../modals/crear-cuenta/crear-cuenta.component';


@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
})
export class CuentaComponent {
  constructor(private dialog: MatDialog) {}

  openCrearCuenta() {
    this.dialog.open(CrearCuentaComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }
}
