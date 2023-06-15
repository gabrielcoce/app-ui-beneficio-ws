import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { QrGenericComponent } from '../qr-generic/qr-generic.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { RegistrarParcialidadComponent } from '../peso-cabal/components/registrar-parcialidad/registrar-parcialidad.component';
import { PesoCabalService } from '../peso-cabal/peso-cabal.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { IAprobarRechazar } from '../interfaces/beneficio.interface';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  standalone: true,
  styleUrls: ['./mat-table.component.scss'],
  imports: [CommonModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MatTableComponent implements OnChanges {
  constructor(
    private dialog: MatDialog,
    private readonly pesoCabalSvc: PesoCabalService
  ) {}
  tableDataSrc: any;
  @Input('tableColumns') tableCols!: string[];
  @Input() headerText!: string[];
  @Input() tableData: {}[] = [];
  @Output() dataTable = new EventEmitter<any>();
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    /****** Agrega los establecimientos activos a la tabla ******/
    if (changes['tableData'] && changes['tableData'].currentValue) {
      this.tableDataSrc = new MatTableDataSource(
        changes['tableData'].currentValue
      );
      this.tableDataSrc.sort = this.sort;
      this.tableDataSrc.paginator = this.paginator;
      //console.log('tableData', changes['tableData'].currentValue);
    }
  }

  obtenerGestion(noCuenta: string) {
    this.dialog.open(QrGenericComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: false,
      data: noCuenta,
    });
  }

  registrarParcialidad(
    noCuenta: string,
    parcialidadId: any,
    pesoIngresado: string
  ) {
    // console.log('noCuenta', noCuenta);
    // console.log('parcialidadId', parcialidadId);
    this.dialog
      .open(RegistrarParcialidadComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          noCuenta,
          parcialidadId,
          origen: true,
          pesoIngresado,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result === 'success') {
            this.dataTable.emit(result);
          }
        }
      });
  }

  //verRegistro
  actualizarParcialidad(
    noCuenta: string,
    parcialidadId: any,
    pesoIngresado: string
  ) {
    this.dialog
      .open(RegistrarParcialidadComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          noCuenta,
          parcialidadId,
          origen: false,
          pesoIngresado,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          if (result === 'success') {
            this.dataTable.emit(result);
          }
        }
      });
  }

  async verificarParcialidad(parcialidadId: any) {
    const confirmed = await this.confirmMessage(
      'question',
      `¿Desea verificar esta parcialidad ${parcialidadId}?`
    );
    if (!confirmed) return;
    const verificar$ =
      this.pesoCabalSvc.putVerificarParcialidadSvc(parcialidadId);
    await firstValueFrom(verificar$)
      .then(async (consulta) => {
        if (typeof consulta === 'string') {
          //console.log(res);
          await this.showMessage('info', consulta);
          return;
        }
        await this.showMessage('success', consulta.message);
        this.dataTable.emit('success');
      })
      .catch((error) => {
        console.error('error', error);
      });
  }
  aprobarSolicitud(noSolicitud: string) {
    const data: IAprobarRechazar = {
      noSolicitud,
      message: 'aprobar'
    }
    this.dataTable.emit(data);
  }
  rechazarSolicitud(noSolicitud: string) {
    const data: IAprobarRechazar = {
      noSolicitud,
      message: 'rechazar',
    };
    this.dataTable.emit(data);
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
