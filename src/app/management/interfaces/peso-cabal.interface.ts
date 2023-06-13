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
