import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
const URL_TEST = environment.BASE_API + '/test';
@Injectable({
  providedIn: 'root',
})
export class AgricultorService {
  private readonly http = inject(HttpClient);
  constructor() {}

  testSvc() {
    return this.http.get(URL_TEST + '/agricultor', {
      responseType: 'text' || 'json',
    });
  }
}
