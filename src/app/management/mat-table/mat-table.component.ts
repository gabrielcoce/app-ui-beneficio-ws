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

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  standalone: true,
  styleUrls: ['./mat-table.component.scss'],
  imports: [CommonModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MatTableComponent implements OnChanges {
  constructor(private dialog: MatDialog) {}
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
    console.log('DATA:', noCuenta);
    this.dialog.open(QrGenericComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: false,
      data: noCuenta,
    });
  }

  registrarParcialidad(noCuenta: string, parcialidadId: any) {
    console.log('noCuenta', noCuenta);
    console.log('parcialidadId', parcialidadId);
    this.dialog
      .open(RegistrarParcialidadComponent, {
        width: '600px',
        height: 'auto',
        disableClose: true,
        data: {
          noCuenta,
          parcialidadId,
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
}
