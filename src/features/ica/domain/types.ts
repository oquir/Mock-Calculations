export type SiNo = "Si" | "No";

export interface ActividadRow {
  idActividad: number | null; // Id real (backend)
  selectedValue: string | null; // value del select (puede ser index o id; ideal: id)
  codigo: string;
  ingresosGravados: number; // numérico, siempre
  tarifaXMil: number; // numérico
  impuesto: number; // numérico
};

export interface DetalleDeclaracion {
  // Base
  ingresosOrdinarios: number;
  ingresosFueraMunicipio: number;
  totalIngresosOrdinarios: number;

  devolucionDescuentos: number;
  exportaciones: number;
  activosFijos: number;
  actividadesExcluidas: number;
  actividadesExentas: number;
  ingresosGravables: number;

  // Actividades (totales)
  totalIngreso: number;
  totalImpuesto: number;

  energia: number;
  impuestoLey: number;

  // Liquidación
  impIndYComercio: number;
  impAvisosYTableros: number;
  unidadesComerciales: number;
  sobretasa: number;
  sobretasaSeguridad: number;
  totalImpuestoCargo: number;

  // Deducciones
  valorExencion: number;
  retenciones: number;
  autorretenciones: number;
  anticipoLiquidado: number;
  anticipoImpuesto: number;
  sanciones: number;
  saldoPeriodo: number;

  totalSaldoCargo: number;
  totalSaldoFavor: number;
  valorPagar: number;

  descuento: number;
  interesMora: number;
  totalAPagar: number;

  pagoVoluntario: number;
  totalPagoVoluntario: number;

  destino: string;
};

export interface IcaFormState {
  codigoMunicipio: string;
  anioGravable: number;
  tieneAvisos: SiNo;
  tieneSobretasa: SiNo;
  tieneAnticipo: SiNo;

  fechaMaximaDeclaracion: Date; // calculada según reglas
  detalle: DetalleDeclaracion;
  actividades: ActividadRow[];
};
