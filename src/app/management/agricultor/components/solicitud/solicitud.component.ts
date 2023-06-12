import { firstValueFrom } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { AgricultorService } from '../../agricultor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  ISolicitudes,
  ITableSolicitudes,
} from 'src/app/management/interfaces/agricultor.interface';
import dayjs from 'dayjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { CrearSolicitudComponent } from '../modals/crear-solicitud/crear-solicitud.component';
const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;

@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudComponent implements OnInit {
  showBtn$;
  tableData!: {}[];
  hText: string[] = [
    'No. Solicitud',
    'Tipo de Solicitud',
    'Estado de la Solicitud',
    'Peso Total',
    'Cantidad de Parcialidades',
    'Fecha Creacion',
  ];
  tableCols: string[] = [
    'noSolicitud',
    'tipoSolicitud',
    'estadoSolicitud',
    'pesoTotal',
    'cantidadParcialidades',
    'createdAt',
  ];
  constructor(
    private dialog: MatDialog,
    private agricultorSvc: AgricultorService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {
    this.showBtn$ = this.agricultorSvc.verificarSolicitudesSvc(userName);
  }
  ngOnInit(): void {
    //throw new Error('Method not implemented.');
  }

  openCrearSolicitud() {
    this.dialog.open(CrearSolicitudComponent, {
      width: '600px',
      height: 'auto',
      disableClose: true,
      data: {},
    });
  }

  async verSolicitudes() {
    if (this.tableData) return;
    this.spinner.show();
    const solicitudes$ = this.agricultorSvc.getSolicitudesSvc(userName);
    await firstValueFrom(solicitudes$)
      .then(async (consulta) => {
        if (typeof consulta === 'string') {
          console.log(consulta);
          await this.showMessage('info', consulta);
          return;
        }
        this.tableData = this.llenarJsonTabla(consulta);
        this.spinner.hide();
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('error', error);
        this.spinner.hide();
      });
  }

  private llenarJsonTabla(data: ISolicitudes[]) {
    let jsonTabla: ITableSolicitudes[] = [];
    data.forEach((element) => {
      const {
        noSolicitud,
        tipoSolicitud,
        estadoSolicitud,
        pesoTotal,
        cantidadParcialidades,
        createdAt,
      } = element;
      jsonTabla.push({
        noSolicitud,
        tipoSolicitud,
        estadoSolicitud,
        pesoTotal: this.numberToString(pesoTotal),
        cantidadParcialidades: this.numberToString(cantidadParcialidades),
        createdAt: this.convertDate(createdAt),
      });
    });
    return jsonTabla;
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
      text: text.toUpperCase(),
    });
  }
}
