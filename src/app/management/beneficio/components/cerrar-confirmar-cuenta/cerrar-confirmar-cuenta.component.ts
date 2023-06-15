import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { BeneficioService } from '../../beneficio.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cerrar-confirmar-cuenta',
  templateUrl: './cerrar-confirmar-cuenta.component.html',
  styleUrls: ['./cerrar-confirmar-cuenta.component.scss'],
})
export class CerrarConfirmarCuentaComponent implements OnInit {
  form!: FormGroup;
  title: string = '';
  origen: boolean = true;
  constructor(
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CerrarConfirmarCuentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private beneficioSvc: BeneficioService
  ) {
    this.builForm();
  }
  ngOnInit(): void {
    this.origen = this.dialogRef.componentInstance.data.origen;
    this.title = this.origen ? 'Cerrar' : 'Confirmar';
    const nocuenta = this.dialogRef.componentInstance.data.noCuenta;
    this.form.get('noCuenta')?.setValue(nocuenta);
  }
  private builForm() {
    this.form = this.formBuilder.group({
      noCuenta: [
        '',
        {
          validators: [
            Validators.minLength(20),
            Validators.maxLength(25),
            Validators.required,
          ],
        },
      ],
    });
  }
  cerrar() {
    this.dialogRef.close();
  }
  async cerrarCuenta() {
    if (this.form.invalid) return;
    const confirmed = await this.confirmMessage(
      'question',
      '¿Desea cerrar la cuenta?'
    );
    if (!confirmed) return;
    const noCuenta = this.transformUpper(this.form.get('noCuenta')?.value);
    this.spinner.show();
    const consulta$ = this.beneficioSvc.putCerrarCuentaSvc(noCuenta);
    await firstValueFrom(consulta$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        this.dialogRef.close('success');
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  async confirmarCuenta() {
    if (this.form.invalid) return;
    const confirmed = await this.confirmMessage(
      'question',
      '¿Desea confirmar la cuenta?'
    );
    if (!confirmed) return;
    const noCuenta = this.transformUpper(this.form.get('noCuenta')?.value);
    this.spinner.show();
    const consulta$ = this.beneficioSvc.putConfirmarCuentaSvc(noCuenta);
    await firstValueFrom(consulta$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        this.dialogRef.close('success');
      })
      .catch(() => {
        this.spinner.hide();
      });
  }

  private transformUpper(str: string) {
    if (!str) return str;
    return str.toUpperCase();
  }
  private async showMessage(icon: SweetAlertIcon, text: string) {
    const Toast = Swal.mixin({
      //toast: true,
      //position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      backdrop: true,
      allowOutsideClick: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    await Toast.fire({
      icon,
      text: text ? text.toUpperCase() : text,
    });
  }
  private async confirmMessage(icon: SweetAlertIcon, text: string) {
    return await Swal.fire({
      icon,
      text: text.toUpperCase(),
      confirmButtonColor: '#1369A0',
      confirmButtonText: 'ACEPTAR',
      cancelButtonColor: '#E63946',
      cancelButtonText: 'CANCELAR',
      showCancelButton: true,
      reverseButtons: true,
      backdrop: true,
      allowOutsideClick: false,
    }).then((result) => result.isConfirmed);
  }
}
