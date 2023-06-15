import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgHcaptchaModule } from 'ng-hcaptcha';
import { environment } from 'src/environments/environment';
import { HcaptchaComponent } from './hcaptcha/hcaptcha.component';
import { ApproveEntryComponent } from './approve-entry/approve-entry.component';
import { MatTableComponent } from '../management/mat-table/mat-table.component';

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
    MatTableComponent,
    NgOptimizedImage,
  ],
  //exports: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AuthModule {}
