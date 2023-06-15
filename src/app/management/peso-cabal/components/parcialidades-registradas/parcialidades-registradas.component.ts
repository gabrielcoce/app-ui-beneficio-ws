import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  IParcialidadesRegistradasPc,
  ITableParcialidadesRegistradasPc,
} from 'src/app/management/interfaces/peso-cabal.interface';

@Component({
  selector: 'app-parcialidades-registradas',
  templateUrl: './parcialidades-registradas.component.html',
  styleUrls: ['./parcialidades-registradas.component.scss'],
})
export class ParcialidadesRegistradasComponent implements OnInit {
  tableData!: {}[];
  hText: string[] = [
    'No. Parcialidad',
    'Peso Ingresado (Toneladas)',
    'Peso Registrado (Toneladas)',
    'Peso Excedido (Toneladas)',
    'Peso Faltante (Toneladas)',
    'Tolerancia (+- 5%)',
  ];
  tableCols: string[] = [
    'parcialidadId',
    'pesoIngresado',
    'pesoRegistrado',
    'pesoExcedido',
    'pesoFaltante',
    'tolerancia',
  ];
  noCuenta: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ParcialidadesRegistradasComponent>
  ) {}
  ngOnInit(): void {
    const parcialidades: IParcialidadesRegistradasPc[] =
      this.dialogRef.componentInstance.data.parcialidades;
    this.noCuenta = this.dialogRef.componentInstance.data.noCuenta;
    //console.log('parcialidades -->', this.parcialidades);
    this.tableData = this.llenarJsonTabla(parcialidades);
  }

  cerrar() {
    this.dialogRef.close();
  }
  private llenarJsonTabla(data: IParcialidadesRegistradasPc[]) {
    let jsonTabla: ITableParcialidadesRegistradasPc[] = [];
    data.forEach((element) => {
      const {
        parcialidadId,
        pesoIngresado,
        pesoRegistrado,
        pesoExcedido,
        pesoFaltante,
      } = element;
      jsonTabla.push({
        parcialidadId,
        pesoIngresado: this.numberToString(pesoIngresado),
        pesoRegistrado: this.numberToString(pesoRegistrado),
        pesoExcedido: this.numberFixedToString(pesoExcedido),
        pesoFaltante: this.numberFixedToString(pesoFaltante),
        tolerancia: '',
        calculoTolerancia: this.calcularTolerancia(element),
        mostrar: this.mostrar(element),
      });
    });
    return jsonTabla;
  }
  private numberToString(num: number) {
    if (!num) return '0';
    return num.toString();
  }

  private numberFixedToString(num: number) {
    if (!num) return '0.00';
    return num.toFixed(2);
  }

  private calcularTolerancia(data: IParcialidadesRegistradasPc) {
    const { pesoIngresado, pesoRegistrado, pesoExcedido, pesoFaltante } = data;
    let calculo: string = '0.00 %';
    if (pesoExcedido) {
      const exceso = pesoRegistrado - pesoIngresado;
      const porcentaje = Number((exceso / pesoIngresado) * 100).toFixed(2);
      return porcentaje + ' %';
    }
    if (pesoFaltante) {
      const disminucion = pesoRegistrado - pesoIngresado;
      const porcentaje = Number((disminucion / pesoIngresado) * 100).toFixed(2);
      return porcentaje + ' %';
    }
    return calculo;
  }

  private mostrar(data: IParcialidadesRegistradasPc) {
    const { pesoIngresado, pesoRegistrado } = data;
    let message: string = '0';
    if (pesoRegistrado > pesoIngresado) {
      return (message = '1');
    }
    if (pesoRegistrado < pesoIngresado) {
      return (message = '2');
    }
    return message;
  }
}
