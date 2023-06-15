import { firstValueFrom } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PesoCabalService } from '../../peso-cabal.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  IParcialidadesPc,
  ITableParcialidadesPc,
} from 'src/app/management/interfaces/peso-cabal.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ParcialidadesRegistradasComponent } from '../parcialidades-registradas/parcialidades-registradas.component';

@Component({
  selector: 'app-parcialidad-pc',
  templateUrl: './parcialidad-pc.component.html',
  styleUrls: ['./parcialidad-pc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParcialidadPcComponent {
  form!: FormGroup;
  tableData!: {}[];
  hText: string[] = [
    'No. Parcialidad',
    'Peso Ingresado',
    'Registrar Parcialidad',
    'Actualizar Parcialidad',
    'Verificar Parcialidad',
  ];
  tableCols: string[] = [
    'parcialidadId',
    'pesoIngresado',
    'actionRegister',
    'actionUpdate',
    'actionVerificar',
  ];
  noCuenta: string = '';
  showBtn: boolean = false;
  showTable: boolean = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pesoCabalSvc: PesoCabalService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.buildForm();
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
    });
  }
  onChanges() {
    this.showBtn = false;
    this.showTable = false;
    this.cdr.detectChanges();
  }
  async buscar() {
    if (this.form.invalid) return;
    const noCuenta = this.transformUpper(this.form.get('noCuenta')?.value);
    this.noCuenta = noCuenta;
    this.spinner.show();
    const consulta$ = this.pesoCabalSvc.getParcialidadesSvc(noCuenta);
    await firstValueFrom(consulta$)
      .then(async (consulta) => {
        this.showBtn = await this.verificaExistencia(noCuenta);
        this.spinner.hide();
        if (typeof consulta === 'string') {
          this.showTable = false;
          this.cdr.detectChanges();
          await this.showMessage('info', consulta);
          return;
        }
        this.tableData = await this.llenarJsonTabla(consulta);
        this.showTable = true;
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('error', error);
        this.spinner.hide();
      });
  }

  async iniciarPesaje() {
    if (this.form.invalid) return;
    const confirmed = await this.confirmMessage(
      'question',
      `¿Desea iniciar pesaje?`
    );
    if (!confirmed) return;
    this.spinner.show();
    const iniciar$ = this.pesoCabalSvc.putIniciarPesajeSvc(this.noCuenta);
    await firstValueFrom(iniciar$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  async finalizaPesaje() {
    if (this.form.invalid) return;
    const confirmed = await this.confirmMessage(
      'question',
      `¿Desea finalizar pesaje?`
    );
    if (!confirmed) return;
    this.spinner.show();
    const finalizar$ = this.pesoCabalSvc.putFinalizarPesajeSvc(this.noCuenta);
    await firstValueFrom(finalizar$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        window.location.reload();
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  async verParcialidadesRegistradas() {
    if (this.form.invalid) return;
    try {
      this.spinner.show();
      const data$ = this.pesoCabalSvc.getParcialidadesRegistradasSvc(
        this.noCuenta
      );
      const parcialidades = await firstValueFrom(data$).then(
        (consulta) => consulta
      );
      this.spinner.hide();
      this.dialog.open(ParcialidadesRegistradasComponent, {
        width: 'auto',
        height: 'auto',
        disableClose: true,
        data: {
          parcialidades,
          noCuenta: this.noCuenta,
        },
      });
    } catch (error) {
      console.error('error', error);
      this.spinner.hide();
    }
  }
  private async llenarJsonTabla(data: IParcialidadesPc[]) {
    const promises = data.map(async (element) => {
      const { parcialidadId, pesoIngresado, parcialidadVerificada } = element;
      const parcialidadRegistrada = await this.verificaParcialidad(
        parcialidadId
      );
      return {
        parcialidadId,
        pesoIngresado: this.numberToString(pesoIngresado),
        actionRegister: '',
        actionUpdate: '',
        actionVerificar: '',
        parcialidadVerificada,
        parcialidadRegistrada,
        noCuenta: this.noCuenta,
      };
    });
    const json: ITableParcialidadesPc[] = await Promise.all(promises);
    return json;
  }
  private async verificaParcialidad(parcialidad: any) {
    const verificar$ = this.pesoCabalSvc.verificaExistenciaSvc(parcialidad);
    return await firstValueFrom(verificar$).then((res) => res);
  }
  private async verificaExistencia(noCuenta: string) {
    const verifica$ =
      this.pesoCabalSvc.getVerificaExistenciaParcialidadesSvc(noCuenta);
    return await firstValueFrom(verifica$).then((res) => res);
  }
  obtenerDataTabla(data: string) {
    //console.log('data -->', data);
    if (data === 'success') {
      this.buscar();
    }
  }
  private numberToString(num: number) {
    if (!num) return '';
    return num.toString();
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
