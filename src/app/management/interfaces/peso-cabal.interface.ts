export interface IPSuccessResponse {
  code: number;
  data: any;
  message: string;
  status: string;
}
export interface IParcialidadesPc {
  parcialidadId: string;
  pesoIngresado: number;
  parcialidadVerificada: boolean;
}

export interface ITableParcialidadesPc {
  parcialidadId: string;
  pesoIngresado: string;
  actionRegister: string;
  actionUpdate: string;
  actionVerificar: string;
  parcialidadVerificada: boolean;
  parcialidadRegistrada: boolean;
  noCuenta: string;
}

export interface IRegistrarParcialidadPc {
  noCuenta: string;
  parcialidadId: any;
  pesoRegistrado: number;
}

export interface IParcialidadesRegistradasPc {
  parcialidadId: string;
  pesoIngresado: number;
  pesoRegistrado: number;
  pesoExcedido: number;
  pesoFaltante: number;
}

export interface ITableParcialidadesRegistradasPc {
  parcialidadId: string;
  pesoIngresado: string;
  pesoRegistrado: string;
  pesoExcedido: string;
  pesoFaltante: string;
  tolerancia: string;
  calculoTolerancia: string;
  mostrar: string;
}
