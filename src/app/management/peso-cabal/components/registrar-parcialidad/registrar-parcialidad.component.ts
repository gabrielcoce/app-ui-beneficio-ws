import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IRegistrarParcialidadPc } from 'src/app/management/interfaces/peso-cabal.interface';
import { PesoCabalService } from '../../peso-cabal.service';
import { firstValueFrom } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registrar-parcialidad',
  templateUrl: './registrar-parcialidad.component.html',
  styleUrls: ['./registrar-parcialidad.component.scss'],
})
export class RegistrarParcialidadComponent implements OnInit {
  form!: FormGroup;
  noCuenta: string = '';
  parcialidadId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<RegistrarParcialidadComponent>,
    private formBuilder: FormBuilder,
    private pesoCabalSvc: PesoCabalService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
    this.noCuenta = this.dialogRef.componentInstance.data.noCuenta;
    this.parcialidadId = this.dialogRef.componentInstance.data.parcialidadId;
    this.builForm();
  }

  private builForm() {
    this.form = this.formBuilder.group({
      noCuenta: [{ value: this.noCuenta, disabled: true }],
      parcialidadId: [{ value: this.parcialidadId, disabled: true }],
      pesoRegistrado: [
        '',
        { validators: [Validators.minLength(1), Validators.required] },
      ],
    });
  }
  cerrar() {
    this.dialogRef.close();
  }

  async enviar() {
    const noCuenta = this.transformUpper(this.form.get('noCuenta')?.value);
    const parcialidadId = this.transformLower(
      this.form.get('parcialidadId')?.value
    );
    const pesoRegistrado = this.form.get('pesoRegistrado')?.value;
    const data: IRegistrarParcialidadPc = {
      noCuenta,
      parcialidadId,
      pesoRegistrado,
    };
    this.spinner.show();
    const data$ = this.pesoCabalSvc.registrarParcialidadSvc(data);
    await firstValueFrom(data$)
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
      .catch(async (error) => {
        this.spinner.hide();
        await this.showMessage('error', error);
      });
  }

  private transformUpper(str: string) {
    if (!str) return str;
    return str.toUpperCase();
  }

  private transformLower(str: string) {
    if (!str) return str;
    return str.toLowerCase();
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
      text: text.toUpperCase(),
    });
  }
}
