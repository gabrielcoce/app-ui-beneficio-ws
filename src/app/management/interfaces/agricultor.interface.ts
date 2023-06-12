export interface ICrearSolicitud {
  tipoSolicitud: number;
  usuarioSolicita: string;
  pesoTotal: number;
  cantidadParcialidades: number;
}
export interface ICrearCuenta {
  noSolicitud: string;
  user: string;
}

export interface ICrearParcialidad {
  noCuenta: string;
  pesoIngresado: number;
  licenciaPiloto: string;
  placaTransporte: string;
}

export interface ITipoSolicitud {
  id: number;
  nombre: string;
}

export interface ISolicitudes {
  tipoSolicitud: string;
  noSolicitud: string;
  estadoSolicitud: string;
  pesoTotal: number;
  cantidadParcialidades: number;
  createdAt: string;
}
export interface ITableSolicitudes {
  tipoSolicitud: string;
  noSolicitud: string;
  estadoSolicitud: string;
  pesoTotal: string;
  cantidadParcialidades: string;
  createdAt: string;
}

export interface ISuccessResponse {
  code: number;
  data: any;
  message: string;
  status: string;
}
