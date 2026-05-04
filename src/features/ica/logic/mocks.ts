import type { ActividadCatalogoDto } from "./types";

const MOCK_ACTIVIDADES_CATALOGO: ActividadCatalogoDto[] = Array.from(
  { length: 20 },
  (_, i) => ({
    idActividad: i + 1,
    codigoCIIU: String(1000 + i),
    descripcion: `ACTIVIDAD ECONÓMICA CIIU ${1000 + i}`,
    tarifa: Number((Math.random() * 9 + 1).toFixed(1))
  }),
);

export { MOCK_ACTIVIDADES_CATALOGO };