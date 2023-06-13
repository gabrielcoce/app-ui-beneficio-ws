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
const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;
@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.scss'],
})
export class CrearSolicitudComponent {
  // userName: string = localStorage.getItem(USER_NAME_KEY)!;
  form!: FormGroup;
  // tipoSolicitud: ITipoSolicitud[] = [
  //   { id: 10, nombre: 'CREAR CUENTA' },
  //   { id: 11, nombre: 'CREAR PILOTO' },
  //   { id: 12, nombre: 'CREAR TRANSPORTE' },
  //   { id: 13, nombre: 'ACTIVAR PILOTO' },
  //   { id: 14, nombre: 'INACTIVAR PILOTO' },
  //   { id: 15, nombre: 'ACTIVAR TRANSPORTE' },
  //   { id: 16, nombre: 'INACTIVAR TRANSPORTE' },
  // ];
  constructor(
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrearSolicitudComponent>,
    private agricultorSvc: AgricultorService
  ) {
    this.buildForm();
  }
  cerrar() {
    this.dialogRef.close();
  }
  private buildForm() {
    this.form = this.formBuilder.group({
      tipoSolicitud: [{ value: 'CREAR CUENTA', disabled: true }],
      pesoTotal: ['', { validators: [Validators.required] }],
      cantidadParcialidades: ['', { validators: [Validators.required] }],
    });
  }

  async enviar() {
    if (this.form.invalid) return;
    const tipoSolicitud = this.form.get('tipoSolicitud')?.value;
    const pesoTotal = this.form.get('pesoTotal')?.value;
    const cantidadParcialidades = this.form.get('cantidadParcialidades')?.value;
    const data: ICrearSolicitud = {
      tipoSolicitud,
      usuarioSolicita: userName,
      pesoTotal,
      cantidadParcialidades,
    };
    //console.log('data', data);
    const data$ = this.agricultorSvc.crearSolicitudSvc(data);
    await firstValueFrom(data$)
      .then(async (consulta) => {
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        this.cerrar();
      })
      .catch((error) => {
        //console.error(error);
      });
  }

  // private stringToNumber(str: string) {
  //   if (!str) return 0;
  //   return Number(str);
  // }

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
