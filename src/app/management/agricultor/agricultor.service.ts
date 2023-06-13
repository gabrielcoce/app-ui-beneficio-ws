import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ICrearParcialidad,
  ICrearSolicitud,
  ICuentas,
  IParcialidades,
  IPiloto,
  ISolicitudes,
  ISuccessResponse,
  ITransporte,
} from '../interfaces/agricultor.interface';
const URL_TEST = environment.BASE_API + '/test';
const URL_BENEFICIO = environment.BASE_API + '/beneficio-agricultor';
const URL_SOLICITUD = URL_BENEFICIO + '/solicitud';
const URL_CUENTA = URL_BENEFICIO + '/cuenta';
const URL_PARCIALIDAD = URL_BENEFICIO + '/parcialidad';
const URL_AGRICULTOR = environment.BASE_API + '/agricultor';
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
  crearParcialidadSvc(data: ICrearParcialidad) {
    return this.http.post<ISuccessResponse>(
      `${URL_PARCIALIDAD}/crear-parcialidad`,
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
  verificarCuentasSvc(user: string) {
    return this.http.get<boolean>(
      `${URL_CUENTA}/verifica-existe-cuentas/${user}`
    );
  }
  getCuentasSvc(user: string) {
    return this.http.get<ICuentas[]>(`${URL_CUENTA}/obtener-cuentas/${user}`);
  }

  verificarParcialidadesSvc(user: string) {
    return this.http.get<boolean>(
      `${URL_PARCIALIDAD}/verifica-existe-parcialidades/${user}`
    );
  }
  getParcialidadesSvc(user: string) {
    return this.http.get<IParcialidades[]>(
      `${URL_PARCIALIDAD}/obtener-parcialidades/${user}`
    );
  }

  getPilotoSvc() {
    return this.http.get<IPiloto[]>(`${URL_AGRICULTOR}/obtener-pilotos`);
  }

  getTransporteSvc() {
    return this.http.get<ITransporte[]>(
      `${URL_AGRICULTOR}/obtener-transportes`
    );
  }
}
