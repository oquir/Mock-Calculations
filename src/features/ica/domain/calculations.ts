import { ceilTo1000, roundTo1000 } from "../../../shared/utils/money";
import type { ActividadRow, DetalleDeclaracion, SiNo } from "./types";

export function calcR10(d: DetalleDeclaracion): DetalleDeclaracion {
  const totalIngresosOrdinarios = Math.max(
    d.ingresosOrdinarios - d.ingresosFueraMunicipio,
    0
  );
  return { ...d, totalIngresosOrdinarios };
}

export function calcR16(d: DetalleDeclaracion): DetalleDeclaracion {
  const ingresosGravables = Math.max(
    d.totalIngresosOrdinarios -
      d.devolucionDescuentos -
      d.exportaciones -
      d.activosFijos -
      d.actividadesExcluidas -
      d.actividadesExentas,
    0
  );

  return { ...d, ingresosGravables };
}

export function calcActividades(acts: ActividadRow[]) {
  let totalIngreso = 0;
  let totalImpuesto = 0;

  const next = acts.map((a) => {
    const ingresos = a.ingresosGravados || 0;
    const tarifa = a.tarifaXMil || 0;
    const impuesto = ingresos > 0 ? roundTo1000((ingresos * tarifa) / 1000) : 0;

    totalIngreso += ingresos;
    totalImpuesto += impuesto;

    return { ...a, impuesto };
  });

  return { next, totalIngreso, totalImpuesto };
}

export function calcR20(d: DetalleDeclaracion): DetalleDeclaracion {
  const impIndYComercio = d.totalImpuesto + d.impuestoLey;
  return { ...d, impIndYComercio };
}

export function calcAvisos(impIndYComercio: number, tieneAvisos: SiNo): number {
  return tieneAvisos === "Si" ? roundTo1000(impIndYComercio * 0.15) : 0;
}

/** Sobretasa según municipio (resumen de tu lógica; se puede ampliar) */
export function calcSobretasa(params: {
  codigoMunicipio: string;
  anioGravable: number;
  impIndYComercio: number;
  impAvisosYTableros: number;
  ingresosGravables: number;
}): number {
  const {
    codigoMunicipio,
    anioGravable,
    impIndYComercio,
    impAvisosYTableros,
    ingresosGravables,
  } = params;

  // porcentaje por municipio (ejemplos del código)
  let p = 0;
  switch (codigoMunicipio) {
    case "8906803784":
      p = 0.05;
      break; // Girardot
    case "8999994152":
      p = 0.025;
      break; // Sesquilé
    case "800103659":
      p = anioGravable >= 2018 ? 0.05 : 0.03;
      break; // Paz de Ariporo
    case "899999312":
      p = 0.0003;
      break; // Villeta
    case "891200461":
      p = 0.1;
      break; // Pto Asís
    default:
      p = 0;
      break;
  }

  if (p === 0) return 0;

  // casos especiales
  if (codigoMunicipio === "899999312") {
    return roundTo1000(ingresosGravables * p);
  }
  if (codigoMunicipio === "891200461") {
    return roundTo1000((impIndYComercio + impAvisosYTableros) * p);
  }

  return roundTo1000(impIndYComercio * p);
}

export function calcR25(d: DetalleDeclaracion): DetalleDeclaracion {
  const totalImpuestoCargo =
    d.impIndYComercio +
    d.impAvisosYTableros +
    d.unidadesComerciales +
    d.sobretasa +
    d.sobretasaSeguridad;

  return { ...d, totalImpuestoCargo };
}

export function calcR33(d: DetalleDeclaracion): DetalleDeclaracion {
  const valor =
    d.totalImpuestoCargo -
    d.valorExencion -
    d.retenciones -
    d.autorretenciones -
    d.anticipoLiquidado +
    d.anticipoImpuesto +
    d.sanciones -
    d.saldoPeriodo;

  const totalSaldoCargo = Math.max(valor, 0);
  const totalSaldoFavor = Math.max(-valor, 0);
  const valorPagar = totalSaldoCargo;

  return { ...d, totalSaldoCargo, totalSaldoFavor, valorPagar };
}

export function calcR38(d: DetalleDeclaracion): DetalleDeclaracion {
  const totalAPagar = d.valorPagar - d.descuento + d.interesMora;
  return { ...d, totalAPagar };
}

export function calcR40(d: DetalleDeclaracion): DetalleDeclaracion {
  const totalPagoVoluntario = d.totalAPagar + d.pagoVoluntario;
  return { ...d, totalPagoVoluntario };
}

/** Interés moratorio siguiendo tu idea, pero sin DOM */
export function calcInteresMora(params: {
  valorPagar: number;
  fechaMaxima: Date;
  now: Date;
  tasaMensual: number; // configurable
}): number {
  const { valorPagar, fechaMaxima, now, tasaMensual } = params;
  const diffMs = now.getTime() - fechaMaxima.getTime();
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dias <= 0) return 0;

  // Ojo: tu fórmula actual divide por 366; aquí lo dejamos igual (se puede ajustar)
  const tasaDiaria = Number((tasaMensual / 366).toFixed(7));
  const interes = (valorPagar * tasaDiaria * dias) / 100;
  return ceilTo1000(interes);
}
