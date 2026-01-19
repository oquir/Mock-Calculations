export function parseMoney(input: string): number {
  // Solo admite dígitos y signo; elimina separadores
  const cleaned = input.replace(/[^\d-]/g, "");
  if (!cleaned || cleaned === "-") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export function formatMoney(n: number): string {
  const value = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value);
}

/** Redondeo a múltiplo de 1000 (como tu app) */
export function roundTo1000(n: number): number {
  return Math.round(n / 1000) * 1000;
}

/** Redondeo “hacia arriba” al múltiplo de 1000 (similar a tu interés) */
export function ceilTo1000(n: number): number {
  return Math.ceil(n / 1000) * 1000;
}
