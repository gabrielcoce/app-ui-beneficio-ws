import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ICrearSolicitud,
  ISolicitudes,
  ISuccessResponse,
} from '../interfaces/agricultor.interface';
const URL_TEST = environment.BASE_API + '/test';
const URL_BENEFICIO = environment.BASE_API + '/beneficio-agricultor';
const URL_SOLICITUD = URL_BENEFICIO + '/solicitud';
const URL_CUENTA = URL_BENEFICIO + '/cuenta';
const URL_PARCIALIDAD = URL_BENEFICIO + '/parcialidad';
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
  crearSolicitudSvc(data: ICrearSolicitud) {
    return this.http.post<ISuccessResponse>(
      `${URL_SOLICITUD}/crear-solicitud`,
      data
    );
  }
  verificarSolicitudesSvc(user: string) {
    return this.http.get<boolean>(
      `${URL_SOLICITUD}/verifica-existe-solicitudes/${user}`
    );
  }
  getSolicitudesSvc(user: string) {
    return this.http.get<ISolicitudes[]>(
      `${URL_SOLICITUD}/obtener-solicitudes/${user}`
    );
  }
}
