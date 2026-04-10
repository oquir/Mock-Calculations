import { ceilTo1000, roundTo1000 } from "../../../shared/utils/money";
import { LEY56_VALOR_KW_ANUAL } from "./rules";
import type { ActividadRow, DetalleDeclaracion, SiNo } from "./types";

const calcR10 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const totalIngresosOrdinarios = Math.max(
    d.ingresosOrdinarios - d.ingresosFueraMunicipio,
    0,
  );
  return { ...d, totalIngresosOrdinarios };
};

const calcR16 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const ingresosGravables = Math.max(
    d.totalIngresosOrdinarios -
      d.devolucionDescuentos -
      d.exportaciones -
      d.activosFijos -
      d.actividadesExcluidas -
      d.actividadesExentas,
    0,
  );

  return { ...d, ingresosGravables };
};

const calcActividades = (acts: ActividadRow[]) => {
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
};

const calcImpuestoLey56 = (params: {
  energiaKW: number;
  valorKwAnual: number; // pesos por kW/año (ya actualizado para el año gravable)
}): number => {
  const { energiaKW, valorKwAnual } = params;

  const kw = Math.max(energiaKW || 0, 0);
  if (kw === 0 || valorKwAnual <= 0) return 0;

  // Si tu formulario exige kW entero, descomenta:
  // const kwEntero = Math.floor(kw);

  const impuesto = kw * valorKwAnual;

  // En ICA normalmente redondeas a 1.000
  return roundTo1000(impuesto);
};

const getValorKwAnualLey56 = (params: {
  anioGravable: number;
  codigoMunicipio: string;
}) => {
  const { anioGravable } = params;

  // versión simple: solo por año
  return LEY56_VALOR_KW_ANUAL[anioGravable] ?? 0;
};

const calcR19_Ley56 = (d: DetalleDeclaracion, valorKwAnual: number) => {
  const impuestoLey = calcImpuestoLey56({
    energiaKW: d.energia,
    valorKwAnual,
  });
  return { ...d, impuestoLey };
};

const calcR20 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const impIndYComercio = d.totalImpuesto + d.impuestoLey;
  return { ...d, impIndYComercio };
};

const calcAvisos = (impIndYComercio: number, tieneAvisos: SiNo): number => {
  return tieneAvisos === "Si" ? roundTo1000(impIndYComercio * 0.15) : 0;
};

/** Sobretasa según municipio (resumen de tu lógica; se puede ampliar) */
const calcSobretasa = (params: {
  codigoMunicipio: string;
  anioGravable: number;
  impIndYComercio: number;
  impAvisosYTableros: number;
  ingresosGravables: number;
}): number => {
  const { impIndYComercio } = params;

  // porcentaje por municipio (ejemplos del código)
  const p = 0.05;

  return roundTo1000(impIndYComercio * p);
};

const calcR25 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const totalImpuestoCargo =
    d.impIndYComercio +
    d.impAvisosYTableros +
    d.unidadesComerciales +
    d.sobretasaBomberil +
    d.sobretasaSeguridad;

  return { ...d, totalImpuestoCargo };
};

const calcR33 = (d: DetalleDeclaracion): DetalleDeclaracion => {
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
};

const calcR38 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const totalAPagar = d.valorPagar - d.descuento + d.interesMora;
  return { ...d, totalAPagar };
};

const calcR40 = (d: DetalleDeclaracion): DetalleDeclaracion => {
  const totalPagoVoluntario = d.totalAPagar + d.pagoVoluntario;
  return { ...d, totalPagoVoluntario };
};

/** Interés moratorio siguiendo tu idea, pero sin DOM */
const calcInteresMora = (params: {
  valorPagar: number;
  fechaMaxima: Date;
  now: Date;
  tasaMensual: number; // configurable
}): number => {
  const { valorPagar, fechaMaxima, now, tasaMensual } = params;
  const diffMs = now.getTime() - fechaMaxima.getTime();
  const dias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (dias <= 0) return 0;

  // Ojo: tu fórmula actual divide por 366; aquí lo dejamos igual (se puede ajustar)
  const tasaDiaria = Number((tasaMensual / 366).toFixed(7));
  const interes = (valorPagar * tasaDiaria * dias) / 100;
  return ceilTo1000(interes);
};

export {
  calcR10,
  calcR16,
  calcActividades,
  calcImpuestoLey56,
  getValorKwAnualLey56,
  calcR19_Ley56,
  calcR20,
  calcAvisos,
  calcSobretasa,
  calcR25,
  calcR33,
  calcR38,
  calcR40,
  calcInteresMora,
};
