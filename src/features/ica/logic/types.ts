export type SiNo = "Si" | "No";

export interface ActividadCatalogoDto {
  idActividad: number;
  codigoCIIU: string;
  descripcion: string;
  tarifa: number;
}

export interface ActividadRow {
  idActividad: number | null;
  selectedValue: string | null; // idActividad como string (select)
  codigo: string; // codigoCIIU
  descripcion: string; // NUEVO (necesario para UI)
  ingresosGravados: number;
  tarifaXMil: number;
  impuesto: number;
}

export interface ActividadDeclaracionDto {
  idDeclaracion: number;
  idActividad: number;
  ingresoGravado: number;
  tarifaXMil: number;
  valorImpuestoActividad: number;
}

export interface DetalleDeclaracion {
  // Base
  ingresosOrdinarios: number; // renglon 8
  ingresosFueraMunicipio: number; // renglon 9
  totalIngresosOrdinarios: number; // renglon 10

  devolucionDescuentos: number; // renglon 11
  exportaciones: number; // renglon 12
  activosFijos: number; // renglon 13
  actividadesExcluidas: number; // renglon 14
  actividadesExentas: number; // renglon 15
  ingresosGravables: number; // renglon 16

  // Actividades (totales)
  totalIngreso: number; // renglon 16.5
  totalImpuesto: number; // renglon 17

  energia: number; // renglon 18
  impuestoLey: number; // renglon 19

  // Liquidación
  impIndYComercio: number; // renglon 20
  impAvisosYTableros: number; // renglon 21
  unidadesComerciales: number; // renglon 22
  sobretasaBomberil: number; // renglon 23
  sobretasaSeguridad: number; // renglon 24
  totalImpuestoCargo: number; // renglon 25

  // Deducciones
  valorExencion: number; // renglon 26
  retenciones: number; // renglon 27
  autorretenciones: number; // renglon 28
  anticipoLiquidado: number; // renglon 29
  anticipoImpuesto: number; // renglon 30
  tipoSancion: number; // renglon 31.1
  descripcionSancion: string; // renglon 31.2
  sanciones: number; // renglon 31
  saldoPeriodo: number; // renglon 32

  totalSaldoCargo: number; // renglon 33
  totalSaldoFavor: number; // renglon 34
  valorPagar: number; //renglon 35

  descuento: number; // renglon 36
  interesMora: number; // renglon 37
  totalAPagar: number; // renglon 38

  pagoVoluntario: number; // renglon 39
  totalPagoVoluntario: number; // renglon 40
}

export interface IcaFormState {
  codigoMunicipio: string;
  anioGravable: number;
  tieneAvisos: SiNo;
  tieneSobretasaBomberil: SiNo;
  tieneAnticipo: SiNo;

  fechaMaximaDeclaracion: Date; // calculada según reglas
  detalle: DetalleDeclaracion;
  actividades: ActividadRow[];
}

export interface RadioOption {
  value: string;
  label: string;
}
