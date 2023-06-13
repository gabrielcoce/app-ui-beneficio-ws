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
import { RegistrarParcialidadComponent } from '../registrar-parcialidad/registrar-parcialidad.component';

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
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pesoCabalSvc: PesoCabalService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
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
  async buscar() {
    if (this.form.invalid) return;
    this.spinner.show();
    const noCuenta = this.transformUpper(this.form.get('noCuenta')?.value);
    const consulta$ = this.pesoCabalSvc.getParcialidadesSvc(noCuenta);
    await firstValueFrom(consulta$)
      .then(async (consulta) => {
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        this.noCuenta = noCuenta;
        this.tableData = await this.llenarJsonTabla(consulta);
        this.spinner.hide();
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('error', error);
        this.spinner.hide();
      });
  }
  private async llenarJsonTabla(data: IParcialidadesPc[]) {
    const promises = data.map(async (element) => {
      const { parcialidadId, pesoIngresado, parcialidadVerificada } = element;
      const parcialidadRegistrada = await this.verificarParcialidad(
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
  private async verificarParcialidad(parcialidad: any) {
    const verificar$ = this.pesoCabalSvc.verificaExistenciaSvc(parcialidad);
    return await firstValueFrom(verificar$).then((res) => res);
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
      text: text.toUpperCase(),
    });
  }
}
