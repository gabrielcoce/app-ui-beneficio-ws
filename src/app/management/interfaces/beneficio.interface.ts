export interface IBSuccessResponse {
  code: number;
  data: any;
  message: string;
  status: string;
}

export interface ICrearCuenta {
  noSolicitud: string;
  user: string;
}

export interface IRechazarSolicitud {
  noSolicitud: string;
}

export interface ISolicitudesB {
  noSolicitud: string;
  estadoSolicitud: string;
  tipoSolicitud: string;
  pesoTotal: number;
  cantidadParcialidades: number;
  usuarioSolicita: string;
}

export interface ITableSolicitudesB {
  noSolicitud: string;
  estadoSolicitud: string;
  tipoSolicitud: string;
  pesoTotal: string;
  cantidadParcialidades: string;
  usuarioSolicita: string;
  aprobar: string;
  rechazar: string;
}

export interface ICuentasB {
  noCuenta: string;
  estadoCuenta: string;
  parcialidadId: string;
  pesoIngresado: number;
  pesoVerificado: number;
  updatedAt: string;
}

export interface ITableCuentasB {
  noCuenta: string;
  estadoCuenta: string;
  parcialidadId: string;
  pesoIngresado: string;
  pesoVerificado: string;
  updatedAt: string;
}

export interface IAprobarRechazar {
  noSolicitud: string;
  message: string;
}

export interface IParcialidadesB {
  noCuenta: string;
  parcialidadId: string;
  pesoIngresado: number;
  licenciaPiloto: string;
  placaTransporte: string;
}

export interface ITableParcialidadesB {
  noCuenta: string;
  parcialidadId: string;
  pesoIngresado: string;
  licenciaPiloto: string;
  placaTransporte: string;
}
