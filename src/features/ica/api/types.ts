export interface Contribuyente {
  codigoMunicipio: string;
  idTipoDocumento: number;
  idTipoPersona: number;
  numeroDocumento: string;
  digitoVerificacion: number;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  nombreCompleto: string;
  idCiudad: number;
  direccion: string;
  correo: string;
  telefono: string;
  numeroEstablecimiento: number;
  idClasificacionMunicipio: number;
}

export interface BaseGravable {
  totalIngresosNacionales: number;
  ingresosFueraMunicipio: number;
  totalIngresosOrdinarios: number;
  ingresosDevolucionesDescuentos: number;
  ingresosExportaciones: number;
  ingresosVentaActivos: number;
  ingresosExcluidosNoGravados: number;
  ingresosExentosMunicipio: number;
  totalIngresosGravables: number;
}

export interface Actividad {
  idDeclaracion: number;
  idActividad: number;
  ingresoGravado: number;
  tarifaXMil: number;
  valorImpuestoActividad: number;
}

export interface ImpuestoACargo {
  impuestoAvisosTableros: number;
  pagoUnidadesSectorFinanciero: number;
  sobretasaBomberil: number;
  idTipoJuegoPermitido: number;
  impuestoJuegoPermitido: number;
  sobretasaSeguridad: number;
  estampillaSistematizacion: number;
  totalImpuestoACargo: number;
}

export interface AjusteDeclaracion {
  valorExencionExoneracionImpuesto: number;
  retencionesAFavor: number;
  autoretencionesAFavor: number;
  anticipoLiquidadoAnioAnterior: number;
  anticipoAnioSiguiente: number;
  idTipoSancion: number;
  descripcionSancion: string;
  valorSancion: number;
  saldoFavorPeriodoAnterior: number;
  saldoPagosRecibidos: number;
  totalAjusteDeclaracion: number;
}

export interface TotalDeclaracion {
  totalSaldoACargo: number;
  totalSaldoAFavor: number;
  descuentoProntoPago: number;
  interesMora: number;
  valorAporteVoluntario: number;
  totalDeclaracion: number;
}

export interface Declarante {
  idTipoDocumento: number;
  numeroDocumento: string;
  nombreCompleto: string;
}

export interface ResponsableLegal {
  idTipoRepresentante: number;
  idTipoDocumento: number;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  celular: string;
  correoElectronico: string;
  nroTarjetaProfesional: string;
}

export interface DeclaracionIca {
  idTipoDeclaracion: number;
  numeroRadicado: number;
  contribuyente: Contribuyente;
  periodoAnio: number;
  idPeriodoAnual: number;
  baseGravable: BaseGravable;
  actividades: Actividad[];
  generacionEnergiaKw: number;
  impuestoLey56: number;
  impuestoACargo: ImpuestoACargo;
  ajusteDeclaracion: AjusteDeclaracion;
  totalDeclaracion: TotalDeclaracion;
  descripcionAporteVoluntario: string;
  declarante: Declarante;
  responsableLegal: ResponsableLegal;
}