import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';
import { ManagementRoutingModule } from './management-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../material.module';
import { MatTableComponent } from './mat-table/mat-table.component';
import { QrGenericComponent } from './qr-generic/qr-generic.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
    HeaderComponent,
    QrGenericComponent,
  ],
  imports: [
    CommonModule,
    ManagementRoutingModule,
    MaterialModule,
    NgOptimizedImage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ManagementModule {}
