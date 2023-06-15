import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  IBSuccessResponse,
  ICrearCuenta,
  ICuentasB,
  IParcialidadesB,
  IRechazarSolicitud,
  ISolicitudesB,
} from '../interfaces/beneficio.interface';
const URL_TEST = environment.BASE_API + '/test';
const URL_BENEFICIO = environment.BASE_API + '/beneficio';
const URL_SOLICITUD = URL_BENEFICIO + '/solicitud';
const URL_CUENTA = URL_BENEFICIO + '/cuenta';
const URL_PARCIALIDAD = URL_BENEFICIO + '/parcialidad';

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
  getVerificarPermitirCuentaSvc(cuenta: string) {
    return this.http.get<boolean>(`${URL_CUENTA}/verificar-permitir-ingreso/${cuenta}`);
  }

  getVerificarCuentaSvc() {
    return this.http.get<boolean>(`${URL_CUENTA}/verificar-obtener-cuentas`);
  }
  getVerificarSolicitudSvc() {
    return this.http.get<boolean>(
      `${URL_SOLICITUD}/verificar-obtener-solicitudes`
    );
  }

  getCuentaSvc() {
    return this.http.get<ICuentasB[]>(`${URL_CUENTA}/obtener-cuentas`);
  }
  getSolicitudSvc() {
    return this.http.get<ISolicitudesB[]>(
      `${URL_SOLICITUD}/obtener-solicitudes`
    );
  }
  getParcialidadesByCuentaSvc(cuenta: string) {
    return this.http.get<IParcialidadesB[]>(
      `${URL_PARCIALIDAD}/obtener-parcialidades/${cuenta}`
    );
  }

  putRechazarSolicitudSvc(data: IRechazarSolicitud) {
    return this.http.put<IBSuccessResponse>(
      `${URL_SOLICITUD}/rechazar-solicitud`,
      data
    );
  }

  postCrearCuentaSvc(data: ICrearCuenta) {
    return this.http.post<IBSuccessResponse>(
      `${URL_CUENTA}/crear-cuenta`,
      data
    );
  }

  putPermitirIngresoCuentaSvc(cuenta: string) {
    return this.http.put<IBSuccessResponse>(
      `${URL_CUENTA}/permitir-ingreso/${cuenta}`,
      undefined
    );
  }

  putCerrarCuentaSvc(cuenta: string) {
    return this.http.put<IBSuccessResponse>(
      `${URL_CUENTA}/cerrar-cuenta/${cuenta}`,
      undefined
    );
  }
  putConfirmarCuentaSvc(cuenta: string) {
    return this.http.put<IBSuccessResponse>(
      `${URL_CUENTA}/confirmar-cuenta/${cuenta}`,
      undefined
    );
  }
}
