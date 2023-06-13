import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PesoCabalService } from '../../peso-cabal.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  IParcialidadesPc,
  ITableParcialidadesPc,
} from 'src/app/management/interfaces/peso-cabal.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-parcialidad-pc',
  templateUrl: './parcialidad-pc.component.html',
  styleUrls: ['./parcialidad-pc.component.scss'],
})
export class ParcialidadPcComponent {
  form!: FormGroup;
  tableData!: {}[];
  hText: string[] = ['No. Parcialidad', 'Peso Ingresado'];
  tableCols: string[] = [
    'parcialidadId',
    'pesoIngresado',
    'parcialidadVerificada',
  ];
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pesoCabalSvc: PesoCabalService,
    private spinner: NgxSpinnerService,
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
  registrarParcialidad() {}
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
        this.tableData = this.llenarJsonTabla(consulta);
        this.spinner.hide();
        this.cdr.detectChanges();
      })
      .catch((error) => {
        console.error('error', error);
        this.spinner.hide();
      });
  }
  private llenarJsonTabla(data: IParcialidadesPc[]) {
    let json: ITableParcialidadesPc[] = [];
    data.forEach((element) => {
      const { parcialidadId, pesoIngresado, parcialidadVerificada } = element;
      json.push({
        parcialidadId,
        pesoIngresado: this.numberToString(pesoIngresado),
        parcialidadVerificada,
      });
    });
    return json;
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
