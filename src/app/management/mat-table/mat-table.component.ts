import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mat-table',
  templateUrl: './mat-table.component.html',
  styleUrls: ['./mat-table.component.scss'],
})
export class MatTableComponent implements OnChanges {
  tableDataSrc: any;
  @Input('tableColumns') tableCols!: string[];
  @Input() headerText!: string[];
  @Input() tableData: {}[] = [];
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
}
