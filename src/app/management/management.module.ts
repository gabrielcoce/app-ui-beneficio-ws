import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from '../material.module';


@NgModule({
  declarations: [LayoutComponent, DashboardComponent, HeaderComponent],
  imports: [CommonModule, ManagementRoutingModule, MaterialModule],
})
export class ManagementModule {}
