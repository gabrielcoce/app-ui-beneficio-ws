import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { authTokenInterceptorProvider } from './auth/interceptors/auth.interceptor';
import { MatPaginatorIntlProvider } from './material.module';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import gt from 'dayjs/locale/es';
import { errorInterceptorProvider } from './auth/interceptors/error.interceptor';
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [
    authTokenInterceptorProvider,
    errorInterceptorProvider,
    MatPaginatorIntlProvider,
  ],
  bootstrap: [AppComponent],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor() {
    dayjs.locale(gt);
  }
}
