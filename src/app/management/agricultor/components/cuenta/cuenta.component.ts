import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import dayjs from 'dayjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import {
  ICuentas,
  ITableCuentas,
} from 'src/app/management/interfaces/agricultor.interface';

const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentaComponent {
  showBtn$;
  tableData!: {}[];
  hText: string[] = [
    'No. Cuenta',
    'Estado de la Cuenta',
    'Peso Registrado',
    'Cantidad de Parcialidades',
    'Fecha Creacion',
  ];
  tableCols: string[] = [
    'noCuenta',
    'estado',
    'peso',
    'parcialidades',
    'createdAt',
  ];
  showTable: boolean = false;
  constructor(
    private agricultorSvc: AgricultorService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    this.showBtn$ = this.agricultorSvc.verificarCuentasSvc(userName);
  }

  async verCuentas() {
    if (this.tableData) return;
    this.spinner.show();
    const cuentas$ = this.agricultorSvc.getCuentasSvc(userName);
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

  private llenarJsonTabla(data: ICuentas[]) {
    let json: ITableCuentas[] = [];
    data.forEach((element) => {
      const { noCuenta, estado, peso, parcialidades, createdAt } = element;
      json.push({
        noCuenta,
        estado,
        peso: this.numberToString(peso),
        parcialidades: this.numberToString(parcialidades),
        createdAt: this.convertDate(createdAt),
      });
    });
    return json;
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
