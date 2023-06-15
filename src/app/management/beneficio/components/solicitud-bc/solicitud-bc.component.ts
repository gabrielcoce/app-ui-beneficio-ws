import { ChangeDetectorRef, Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BeneficioService } from '../../beneficio.service';
import { firstValueFrom } from 'rxjs';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  IAprobarRechazar,
  ICrearCuenta,
  IRechazarSolicitud,
  ISolicitudesB,
  ITableSolicitudesB,
} from 'src/app/management/interfaces/beneficio.interface';
const USER_NAME_KEY = 'user_name';
const userName = localStorage.getItem(USER_NAME_KEY)!;

@Component({
  selector: 'app-solicitud-bc',
  templateUrl: './solicitud-bc.component.html',
  styleUrls: ['./solicitud-bc.component.scss'],
})
export class SolicitudBcComponent {
  showBtn$;
  tableData!: {}[];
  hText: string[] = [
    'No. Solicitud',
    'Tipo Solicitud',
    'Estado Solicitud',
    'Peso Ingresado',
    'Cantidad de Parcialidades',
    'Usuario Solicita',
    'Aprobar Solicitud',
    'Rechazar Solicitud',
  ];
  tableCols: string[] = [
    'noSolicitud',
    'tipoSolicitud',
    'estadoSolicitud',
    'pesoTotal',
    'cantidadParcialidades',
    'usuarioSolicita',
    'aprobar',
    'rechazar',
  ];
  showTable: boolean = false;
  constructor(
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private beneficioSvc: BeneficioService
  ) {
    this.showBtn$ = this.beneficioSvc.getVerificarSolicitudSvc();
  }

  async verSolicitudes() {
    if (this.tableData) return;
    this.spinner.show();
    const cuentas$ = this.beneficioSvc.getSolicitudSvc();
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
  private llenarJsonTabla(data: ISolicitudesB[]) {
    let json: ITableSolicitudesB[] = [];
    data.forEach((element) => {
      const {
        noSolicitud,
        tipoSolicitud,
        estadoSolicitud,
        pesoTotal,
        cantidadParcialidades,
        usuarioSolicita,
      } = element;
      json.push({
        noSolicitud,
        tipoSolicitud,
        estadoSolicitud,
        pesoTotal: this.numberToString(pesoTotal),
        cantidadParcialidades: this.numberToString(cantidadParcialidades),
        usuarioSolicita,
        aprobar: '',
        rechazar: '',
      });
    });
    return json;
  }
  async obtenerDataTabla(data: IAprobarRechazar) {
    //console.log('data -->', data);
    const { noSolicitud, message } = data;
    if (message === 'aprobar') {
      await this.aprobarSolicitud(noSolicitud);
      return;
    }
    if (message === 'rechazar') {
      await this.rechazarSolicitud(noSolicitud);
      return;
    }
  }
  private async aprobarSolicitud(noSolicitud: string) {
    const confirmed = await this.confirmMessage(
      'question',
      '¿Desea aprobar la solicitud?'
    );
    if (!confirmed) return;
    const data: ICrearCuenta = {
      noSolicitud,
      user: userName,
    };
    this.spinner.show();
    const data$ = this.beneficioSvc.postCrearCuentaSvc(data);
    await firstValueFrom(data$)
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
  private async rechazarSolicitud(noSolicitud: string) {
    const confirmed = await this.confirmMessage(
      'question',
      '¿Desea rechazar la solicitud?'
    );
    if (!confirmed) return;
    const data: IRechazarSolicitud = {
      noSolicitud,
    };
    this.spinner.show();
    const data$ = this.beneficioSvc.putRechazarSolicitudSvc(data);
    await firstValueFrom(data$)
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
