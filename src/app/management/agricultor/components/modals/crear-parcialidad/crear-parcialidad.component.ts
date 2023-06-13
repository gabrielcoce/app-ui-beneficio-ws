import { firstValueFrom } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AgricultorService } from '../../../agricultor.service';
import {
  ICrearParcialidad,
  IPiloto,
  ITransporte,
} from 'src/app/management/interfaces/agricultor.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
// const USER_NAME_KEY = 'user_name';
// const userName = localStorage.getItem(USER_NAME_KEY)!;

@Component({
  selector: 'app-crear-parcialidad',
  templateUrl: './crear-parcialidad.component.html',
  styleUrls: ['./crear-parcialidad.component.scss'],
})
export class CrearParcialidadComponent implements OnInit {
  form!: FormGroup;
  pilotos: IPiloto[] = [];
  transportes: ITransporte[] = [];
  constructor(
    private readonly formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CrearParcialidadComponent>,
    private agricultorSvc: AgricultorService,
    private spinner: NgxSpinnerService
  ) {
    this.buildForm();
  }
  async ngOnInit(): Promise<void> {
    try {
      this.spinner.show();
      this.pilotos = await this.getPilotos();
      this.transportes = await this.getTransportes();
      this.spinner.hide();
    } catch (error) {
      console.error('error', error);
      this.spinner.hide();
    }
  }

  private buildForm() {
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
      pesoIngresado: [
        '',
        { validators: [Validators.minLength(1), Validators.required] },
      ],
      licenciaPiloto: [
        '',
        {
          validators: [
            Validators.minLength(13),
            Validators.maxLength(13),
            Validators.required,
          ],
        },
      ],
      placaTransporte: [
        '',
        {
          validators: [
            Validators.minLength(7),
            Validators.maxLength(7),
            Validators.required,
          ],
        },
      ],
    });
  }
  cerrar() {
    this.dialogRef.close();
  }
  async enviar() {
    if (this.form.invalid) return;
    const noCuenta = this.form.get('noCuenta')?.value;
    const pesoIngresado = this.form.get('pesoIngresado')?.value;
    const licenciaPiloto = this.form.get('licenciaPiloto')?.value;
    const placaTransporte = this.form.get('placaTransporte')?.value;
    const data: ICrearParcialidad = {
      noCuenta,
      pesoIngresado,
      licenciaPiloto,
      placaTransporte,
    };
    const data$ = this.agricultorSvc.crearParcialidadSvc(data);
    await firstValueFrom(data$)
      .then(async (consulta) => {
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
      })
      .catch((error) => {
        //console.error(error);
      });
  }

  async getPilotos() {
    const piloto$ = this.agricultorSvc.getPilotoSvc();
    return await firstValueFrom(piloto$).then((res) => res);
  }

  async getTransportes() {
    const transporte$ = this.agricultorSvc.getTransporteSvc();
    return await firstValueFrom(transporte$).then((res) => res);
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
