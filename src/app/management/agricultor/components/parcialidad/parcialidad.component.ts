import { ChangeDetectorRef, Component } from '@angular/core';
import { AgricultorService } from '../../agricultor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  IParcialidades,
  ITableParcialidades,
} from 'src/app/management/interfaces/agricultor.interface';
import { MatDialog } from '@angular/material/dialog';
import { CrearParcialidadComponent } from '../modals/crear-parcialidad/crear-parcialidad.component';
import { QrGenericComponent } from 'src/app/management/qr-generic/qr-generic.component';
const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;

@Component({
  selector: 'app-parcialidad',
  templateUrl: './parcialidad.component.html',
  styleUrls: ['./parcialidad.component.scss'],
})
export class ParcialidadComponent {
  showBtn$;
  tableData!: {}[];
  hText: string[] = [
    'No. Cuenta',
    'No. Parcialidad',
    'Licencia Piloto',
    'Placa Transporte',
    'Peso Ingresado',
  ];
  tableCols: string[] = [
    'noCuenta',
    'parcialidadId',
    'licenciaPiloto',
    'placaTransporte',
    'pesoIngresado',
  ];
  showTable: boolean = false;
  noCuenta: string = '';
  constructor(
    private agricultorSvc: AgricultorService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.showBtn$ = this.agricultorSvc.verificarParcialidadesSvc(userName);
  }
  crearParcialidad() {
    this.dialog.open(CrearParcialidadComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true,
    });
  }
  generarQr() {
    this.dialog.open(QrGenericComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: false,
      data: {
        noCuenta: this.noCuenta,
      },
    });
  }
  async verParcialidades() {
    if (this.tableData) return;
    this.spinner.show();
    const parcialidades$ = this.agricultorSvc.getParcialidadesSvc(userName);
    await firstValueFrom(parcialidades$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          this.showTable = false;
          this.cdr.detectChanges();
          await this.showMessage('info', consulta);
          return;
        }
        this.tableData = this.llenarJsonTabla(consulta);
        const cuentas = this.llenarJsonTabla(consulta).map(
          (element) => element.noCuenta
        );
        this.noCuenta = cuentas[0];
        this.showTable = true;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  private llenarJsonTabla(data: IParcialidades[]) {
    let json: ITableParcialidades[] = [];
    data.forEach((element) => {
      const {
        noCuenta,
        licenciaPiloto,
        placaTransporte,
        pesoIngresado,
        parcialidadId,
      } = element;
      json.push({
        noCuenta,
        parcialidadId,
        licenciaPiloto,
        placaTransporte,
        pesoIngresado: this.numberToString(pesoIngresado),
      });
    });
    return json;
  }

  private numberToString(num: number) {
    if (!num) return '';
    return num.toString();
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
