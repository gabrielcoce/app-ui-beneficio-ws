import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.scss'],
})
export class CrearCuentaComponent {
  constructor(
    private dialogRef: MatDialogRef<CrearCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}
  cerrar() {
    this.dialogRef.close();
  }
}
