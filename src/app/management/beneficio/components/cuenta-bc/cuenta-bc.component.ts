import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BeneficioService } from '../../beneficio.service';
import { firstValueFrom } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import dayjs from 'dayjs';
import {
  ICuentasB,
  ITableCuentasB,
} from 'src/app/management/interfaces/beneficio.interface';
import { MatDialog } from '@angular/material/dialog';
import { CerrarConfirmarCuentaComponent } from '../cerrar-confirmar-cuenta/cerrar-confirmar-cuenta.component';

@Component({
  selector: 'app-cuenta-bc',
  templateUrl: './cuenta-bc.component.html',
  styleUrls: ['./cuenta-bc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentaBcComponent {
  showBtn$;
  tableData!: {}[];
  hText: string[] = [
    'No. Cuenta',
    'Estado Cuenta',
    'No. Parcialidad',
    'Peso Ingresado (Beneficio)',
    'Peso Verificado (Peso Cabal)',
    'Fecha Verificación',
  ];
  tableCols: string[] = [
    'noCuenta',
    'estadoCuenta',
    'parcialidadId',
    'pesoIngresado',
    'pesoVerificado',
    'updatedAt',
  ];
  showTable: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private beneficioSvc: BeneficioService,
    private dialog: MatDialog
  ) {
    this.showBtn$ = this.beneficioSvc.getVerificarCuentaSvc();
  }

  async verCuentas() {
    if (this.showTable) return;
    this.spinner.show();
    const cuentas$ = this.beneficioSvc.getCuentaSvc();
    await firstValueFrom(cuentas$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          this.showTable = false;
          this.cdr.detectChanges();
          await this.showMessage('info', consulta);
          return;
        }
        this.tableData = this.llenarJsonTabla(consulta);
        this.showTable = true;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  private llenarJsonTabla(data: ICuentasB[]) {
    let json: ITableCuentasB[] = [];
    data.forEach((element) => {
      const {
        noCuenta,
        estadoCuenta,
        parcialidadId,
        pesoIngresado,
        pesoVerificado,
        updatedAt,
      } = element;
      json.push({
        noCuenta,
        estadoCuenta,
        parcialidadId,
        pesoIngresado: this.numberToString(pesoIngresado),
        pesoVerificado: this.numberToString(pesoVerificado),
        updatedAt: this.convertDate(updatedAt),
      });
    });
    return json;
  }
  cerrarCuenta() {
    this.dialog
      .open(CerrarConfirmarCuentaComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          origen: true,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result === 'success') {
            this.showTable = false;
            this.verCuentas();
          }
        }
      });
  }
  confirmarCuenta() {
    this.dialog
      .open(CerrarConfirmarCuentaComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          origen: false,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result === 'success') {
            window.location.reload();
          }
        }
      });
  }
  private numberToString(num: number) {
    if (!num) return '';
    return num.toString();
  }

  private convertDate(date: string) {
    if (!date) return '-';
    return dayjs(date).format('L LTS');
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
