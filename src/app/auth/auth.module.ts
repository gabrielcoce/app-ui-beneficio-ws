import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';
import { HcaptchaComponent } from './hcaptcha/hcaptcha.component';
import { ApproveEntryComponent } from './approve-entry/approve-entry.component';

@NgModule({
  declarations: [LoginComponent, HcaptchaComponent, ApproveEntryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    NgHcaptchaModule.forRoot({
      siteKey: environment.SiteKeyHcapcha,
      languageCode: 'es',
    }),
  ],
  exports: [LoginComponent],
})
export class AuthModule {}
