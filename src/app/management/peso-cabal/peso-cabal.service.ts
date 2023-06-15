import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPSuccessResponse, IParcialidadesPc, IParcialidadesRegistradasPc, IRegistrarParcialidadPc } from '../interfaces/peso-cabal.interface';

const URL_TEST = environment.BASE_API + '/test';
const URL_PESO_CABAL = environment.BASE_API + '/peso-cabal';
const URL_CUENTA = URL_PESO_CABAL + '/cuenta';
const URL_PARCIALIDAD = URL_PESO_CABAL + '/parcialidad';

@Injectable({
  providedIn: 'root',
})
export class PesoCabalService {
  private readonly http = inject(HttpClient);
  constructor() {}
  testSvc() {
    return this.http.get(URL_TEST + '/peso-cabal', {
      responseType: 'text' || 'json',
    });
  }
  getParcialidadesSvc(cuenta: string) {
    return this.http.get<IParcialidadesPc[]>(
      `${URL_PARCIALIDAD}/obtener-parcialidades/${cuenta}`
    );
  }
  getParcialidadesRegistradasSvc(cuenta: string) {
    return this.http.get<IParcialidadesRegistradasPc[]>(
      `${URL_PARCIALIDAD}/obtener-parcialidades-registradas/${cuenta}`
    );
  }

  registrarParcialidadSvc(data: IRegistrarParcialidadPc) {
    return this.http.post<IPSuccessResponse>(
      `${URL_PARCIALIDAD}/registrar-parcialidad`,
      data
    );
  }
  actualizarParcialidadSvc(data: IRegistrarParcialidadPc) {
    return this.http.put<IPSuccessResponse>(
      `${URL_PARCIALIDAD}/actualizar-parcialidad`,
      data
    );
  }

  verificaExistenciaSvc(parcialidad: any) {
    return this.http.get<boolean>(
      `${URL_PARCIALIDAD}/verifica-existe-parcialidad/${parcialidad}`
    );
  }

  getVerificaExistenciaParcialidadesSvc(noCuenta: string) {
    return this.http.get<boolean>(
      `${URL_PARCIALIDAD}/verifica-existencia-parcialidades/${noCuenta}`
    );
  }

  putVerificarParcialidadSvc(parcialidad: any) {
    return this.http.put<IPSuccessResponse>(
      `${URL_PARCIALIDAD}/verificar-parcialidad/${parcialidad}`,
      undefined
    );
  }
  putIniciarPesajeSvc(cuenta: string) {
    return this.http.put<IPSuccessResponse>(
      `${URL_CUENTA}/iniciar-pesaje/${cuenta}`,
      undefined
    );
  }

  putFinalizarPesajeSvc(cuenta: string) {
    return this.http.put<IPSuccessResponse>(
      `${URL_CUENTA}/finalizar-pesaje/${cuenta}`,
      undefined
    );
  }
}
