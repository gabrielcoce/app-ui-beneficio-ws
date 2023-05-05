import { Role } from './../auth/model/roles.type';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HasRoleGuard } from '../auth/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'agricultor',
        loadChildren: () =>
          import('./agricultor/agricultor.module').then(
            (m) => m.AgricultorModule
          ),
        canActivate: [HasRoleGuard],
        canMatch: [HasRoleGuard],
        data: {
          allowedRoles: 'ROLE_AGRICULTOR',
        },
      },
      {
        path: 'beneficio',
        loadChildren: () =>
          import('./beneficio/beneficio.module').then((m) => m.BeneficioModule),
        canActivate: [HasRoleGuard],
        canMatch: [HasRoleGuard],
        data: {
          allowedRoles: 'ROLE_BENEFICIO',
        },
      },
      {
        path: 'peso-cabal',
        loadChildren: () =>
          import('./peso-cabal/peso-cabal.module').then(
            (m) => m.PesoCabalModule
          ),
        canActivate: [HasRoleGuard],
        canMatch: [HasRoleGuard],
        data: {
          allowedRoles: 'ROLE_PESO_CABAL',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementRoutingModule {}
