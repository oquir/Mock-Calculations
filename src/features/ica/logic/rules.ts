import type { DetalleDeclaracion } from "./types";

const ROUNDABLE_INPUT_FIELDS: (keyof DetalleDeclaracion)[] = [
  "ingresosOrdinarios",
  "ingresosFueraMunicipio",
  "devolucionDescuentos",
  "exportaciones",
  "activosFijos",
  "actividadesExcluidas",
  "actividadesExentas",
  "impuestoLey",
  "unidadesComerciales",
  "valorExencion",
  "retenciones",
  "autorretenciones",
  "anticipoLiquidado",
  "anticipoImpuesto",
  "sanciones",
  "saldoPeriodo",
  "descuento",
  "pagoVoluntario",
];

const MAX_ACTIVIDADES = 15;

const LEY56_VALOR_KW_ANUAL: Record<number, number> = {
  2009: 23763,
  2010: 24555,
  2011: 25132,
  2012: 26049,
  2013: 26841,
  2014: 27485,
  2015: 28279,
  2016: 29753,
  2017: 31859,
  2018: 33156,
  2019: 34270,
  2020: 35607,
  2021: 36308,
  2022: 38004,
  2023: 42412,
  2024: 47065,
  2025: 49799,
};

export {
  ROUNDABLE_INPUT_FIELDS,
  MAX_ACTIVIDADES,
  LEY56_VALOR_KW_ANUAL
}
