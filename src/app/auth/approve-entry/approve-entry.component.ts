import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import CryptoJS from 'crypto-js';
import { BeneficioService } from 'src/app/management/beneficio/beneficio.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  IParcialidadesB,
  ITableParcialidadesB,
} from 'src/app/management/interfaces/beneficio.interface';
const SITE_KEY = environment.SITE_KEY;

@Component({
  selector: 'app-approve-entry',
  templateUrl: './approve-entry.component.html',
  styleUrls: ['./approve-entry.component.scss'],
})
export class ApproveEntryComponent implements OnInit {
  private readonly key = CryptoJS.enc.Utf8.parse(SITE_KEY);
  noCuenta: string = '';
  tableData!: {}[];
  hText: string[] = [
    'No. Cuenta',
    'No. Parcialidad',
    'Peso Ingresado',
    'Licencia Piloto',
    'Placa Transporte',
  ];
  tableCols: string[] = [
    'noCuenta',
    'estadoCuenta',
    'parcialidadId',
    'pesoIngresado',
    'licenciaPiloto',
    'placaTransporte',
  ];
  showTable: boolean = false;
  showContainer: boolean = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly beneficioSvc: BeneficioService,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
  ) {}
  async ngOnInit(): Promise<void> {
    let encryptedAccount: string = '';
    this.activatedRoute.params.subscribe((params: Params) => {
      encryptedAccount = params['noCuenta'];
    });
    //console.log('encryptedAccount', encryptedAccount);
    this.noCuenta = this.decrypt(encryptedAccount);
    //console.log('noCuenta -->', this.noCuenta);
    await this.obtenerParcialidades(this.noCuenta);
  }
  private async obtenerParcialidades(cuenta: string) {
    if (!cuenta) {
      this.showContainer = false;
      await this.showMessage('info', 'No se pudo recuperar parametro');
      return;
    }
    this.spinner.show();
    const data$ = this.beneficioSvc.getParcialidadesByCuentaSvc(cuenta);
    await firstValueFrom(data$)
      .then(async (consulta) => {
        this.spinner.hide();
        if (typeof consulta === 'string') {
          this.showContainer = false;
          this.showTable = false;
          this.cdr.detectChanges();
          await this.showMessage('info', consulta);
          return;
        }
        this.showContainer = true;
        this.tableData = this.llenarJsonTabla(consulta);
        this.showTable = true;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.spinner.hide();
      });
  }
  private llenarJsonTabla(data: IParcialidadesB[]) {
    let json: ITableParcialidadesB[] = [];
    data.forEach((element) => {
      const {
        noCuenta,
        parcialidadId,
        pesoIngresado,
        licenciaPiloto,
        placaTransporte,
      } = element;
      json.push({
        noCuenta,
        parcialidadId,
        pesoIngresado: this.numberToString(pesoIngresado),
        licenciaPiloto,
        placaTransporte,
      });
    });
    return json;
  }

  async permitirIngreso() {
    const confirmed = await this.confirmMessage(
      'question',
      '¿Desea permitir el ingreso a la cuenta?'
    );
    if (!confirmed) return;
    this.spinner.show();
    const data$ = this.beneficioSvc.putPermitirIngresoCuentaSvc(this.noCuenta);
    await firstValueFrom(data$)
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
  private decrypt(textToDecrypt: string): string {
    return CryptoJS.AES.decrypt(textToDecrypt, this.key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);
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
