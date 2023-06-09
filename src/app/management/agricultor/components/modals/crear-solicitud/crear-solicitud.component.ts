import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {
  ICrearSolicitud,
  ITipoSolicitud,
} from 'src/app/management/interfaces/agricultor.interface';
import { firstValueFrom } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AgricultorService } from '../../../agricultor.service';
import { NgxSpinnerService } from 'ngx-spinner';
const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;
@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss'],
})
export class CrearSolicitudComponent {
  form!: FormGroup;
  constructor(
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrearSolicitudComponent>,
    private agricultorSvc: AgricultorService,
    private spinner: NgxSpinnerService
  ) {
    this.buildForm();
  }
  cerrar() {
    this.dialogRef.close();
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      tipoSolicitud: [{ value: 'CREAR CUENTA', disabled: true }],
      pesoTotal: [
        '',
        { validators: [Validators.minLength(1), Validators.required] },
      ],
      cantidadParcialidades: [
        '',
        { validators: [Validators.minLength(1), Validators.required] },
      ],
    });
  }

  async enviar() {
    if (this.form.invalid) return;
    const tipoSolicitud = 10;
    const pesoTotal = this.form.get('pesoTotal')?.value;
    const cantidadParcialidades = this.form.get('cantidadParcialidades')?.value;
    const data: ICrearSolicitud = {
      tipoSolicitud,
      usuarioSolicita: userName,
      pesoTotal,
      cantidadParcialidades,
    };
    this.spinner.show();
    const data$ = this.agricultorSvc.crearSolicitudSvc(data);
    await firstValueFrom(data$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        this.cerrar();
      })
      .catch(() => {
        this.spinner.hide();
        //console.error(error);
      });
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
}
