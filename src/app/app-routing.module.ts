import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { IsLoggedInGuard } from './auth/guards/auth.guard';
import { HcaptchaComponent } from './auth/hcaptcha/hcaptcha.component';
import { ApproveEntryComponent } from './auth/approve-entry/approve-entry.component';
import { HcaptchaGuard } from './auth/guards/hcaptcha.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'hc/verificar-ingreso',
    component: ApproveEntryComponent,
    canMatch: [HcaptchaGuard],
  },
  {
    path: 'verificar-qr',
    component: HcaptchaComponent,
  },
  {
    path: '',
    loadChildren: () =>
      import('./management/management.module').then((m) => m.ManagementModule),
    canMatch: [IsLoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
