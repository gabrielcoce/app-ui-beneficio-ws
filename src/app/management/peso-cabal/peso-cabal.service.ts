import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IParcialidadesPc, IRegistrarParcialidadPc } from '../interfaces/peso-cabal.interface';
import { ISuccessResponse } from '../interfaces/agricultor.interface';
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

  registrarParcialidadSvc(data: IRegistrarParcialidadPc) {
    return this.http.post<ISuccessResponse>(
      `${URL_PARCIALIDAD}/registrar-parcialidad`,
      data
    );
  }

  verificaExistenciaSvc(parcialidad: any){
    return this.http.get<boolean>(
      `${URL_PARCIALIDAD}/verifica-existe-parcialidad/${parcialidad}`
    );
  }
}
