import type {
  ActividadCatalogoDto,
  ActividadDeclaracionDto,
  ActividadRow,
} from "./types";

const mapCatalogoToActividadRow = (Activity: ActividadCatalogoDto): ActividadRow => ({
  idActividad: Activity.idActividad,
  selectedValue: String(Activity.idActividad),
  codigo: Activity.codigoCIIU,
  descripcion: Activity.descripcion,
  ingresosGravados: 0,
  tarifaXMil: 0, // se define luego según reglas municipales
  impuesto: 0,
});

const mapActividadRowToDto = (Activity: ActividadRow,idDeclaracion: number): ActividadDeclaracionDto => ({
  idDeclaracion,
  idActividad: Activity.idActividad ?? 0,
  ingresoGravado: Activity.ingresosGravados,
  tarifaXMil: Activity.tarifaXMil,
  valorImpuestoActividad: Activity.impuesto,
});

export { mapCatalogoToActividadRow, mapActividadRowToDto };
