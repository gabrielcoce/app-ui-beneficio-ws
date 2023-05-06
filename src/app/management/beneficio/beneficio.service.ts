import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL_TEST = environment.BASE_API + '/test';
@Injectable({
  providedIn: 'root',
})
export class BeneficioService {
  private readonly http = inject(HttpClient);
  constructor() {}
  testSvc() {
    return this.http.get(URL_TEST + '/beneficio', {
      responseType: 'text' || 'json',
    });
  }
}
