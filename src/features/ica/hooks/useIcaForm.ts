import { useCallback, useState } from "react";
import type { ActividadRow, IcaFormState, SiNo } from "../logic/types";
import {
  calcR10,
  calcR16,
  calcActividades,
  calcR20,
  calcAvisos,
  calcSobretasa,
  calcR25,
  calcR33,
  calcR38,
  calcR40,
  calcInteresMora,
  getValorKwAnualLey56,
  calcR19_Ley56,
} from "../logic/calculations";
import { MAX_ACTIVIDADES, ROUNDABLE_INPUT_FIELDS } from "../logic/rules";
import { roundTo1000 } from "../../../shared/utils/money";

const initialState: IcaFormState = {
  codigoMunicipio: "8999994152",
  anioGravable: new Date().getFullYear() - 1,
  tieneAvisos: "Si",
  tieneSobretasaBomberil: "Si",
  tieneAnticipo: "Si",
  fechaMaximaDeclaracion: new Date(),
  detalle: {
    ingresosOrdinarios: 0,
    ingresosFueraMunicipio: 0,
    totalIngresosOrdinarios: 0,

    devolucionDescuentos: 0,
    exportaciones: 0,
    activosFijos: 0,
    actividadesExcluidas: 0,
    actividadesExentas: 0,
    ingresosGravables: 0,

    totalIngreso: 0,
    totalImpuesto: 0,

    energia: 0,
    impuestoLey: 0,

    impIndYComercio: 0,
    impAvisosYTableros: 0,
    unidadesComerciales: 0,
    sobretasaBomberil: 0,
    sobretasaSeguridad: 0,
    totalImpuestoCargo: 0,

    valorExencion: 0,
    retenciones: 0,
    autorretenciones: 0,
    anticipoLiquidado: 0,
    anticipoImpuesto: 0,
    tipoSancion: 0,
    descripcionSancion: "",
    sanciones: 0,
    saldoPeriodo: 0,

    totalSaldoCargo: 0,
    totalSaldoFavor: 0,
    valorPagar: 0,

    descuento: 0,
    interesMora: 0,
    totalAPagar: 0,

    pagoVoluntario: 0,
    totalPagoVoluntario: 0,
  },
  actividades: [
    {
      idActividad: null,
      selectedValue: null,
      codigo: "",
      descripcion: "",
      ingresosGravados: 0,
      tarifaXMil: 0,
      impuesto: 0,
    },
  ],
};

interface UseIcaFormOptions {
  anioGravable?: number;
}

export const useIcaForm = (options?: UseIcaFormOptions) => {
  const [s, setS] = useState<IcaFormState>({
    ...initialState,
    anioGravable: options?.anioGravable || initialState.anioGravable,
  });

  const recomputeAll = useCallback((next: IcaFormState): IcaFormState => {
    let d = next.detalle;

    d = calcR10(d);
    d = calcR16(d);

    const {
      next: acts,
      totalIngreso,
      totalImpuesto,
    } = calcActividades(next.actividades);

    d = { ...d, totalIngreso, totalImpuesto };

    const valorKwAnual = getValorKwAnualLey56({
      anioGravable: next.anioGravable,
      codigoMunicipio: next.codigoMunicipio,
    });

    d = calcR19_Ley56(d, valorKwAnual);

    d = calcR20(d);

    const impAvisosYTableros = calcAvisos(d.impIndYComercio, next.tieneAvisos);
    const sobretasaBomberil = calcSobretasa({
      codigoMunicipio: next.codigoMunicipio,
      anioGravable: next.anioGravable,
      impIndYComercio: d.impIndYComercio,
      impAvisosYTableros,
      ingresosGravables: d.ingresosGravables,
    });

    d = { ...d, impAvisosYTableros, sobretasaBomberil };
    d = calcR25(d);
    d = calcR33(d);

    const interesMora = calcInteresMora({
      valorPagar: d.valorPagar,
      fechaMaxima: next.fechaMaximaDeclaracion,
      now: new Date(),
      tasaMensual: 26.17,
    });

    d = { ...d, interesMora };
    d = calcR38(d);
    d = calcR40(d);

    return { ...next, detalle: d, actividades: acts };
  }, []);

  const updateDetalle = useCallback(
    (patch: Partial<IcaFormState["detalle"]>) => {
      setS((prev) => {
        const normalizedPatch: Partial<IcaFormState["detalle"]> = { ...patch };

        for (const key of Object.keys(
          patch,
        ) as (keyof IcaFormState["detalle"])[]) {
          if (ROUNDABLE_INPUT_FIELDS.includes(key)) {
            const value = patch[key];
            if (typeof value === "number") {
              (normalizedPatch[key] as number) = roundTo1000(value);
            }
          }
        }

        return recomputeAll({
          ...prev,
          detalle: {
            ...prev.detalle,
            ...normalizedPatch,
          },
        });
      });
    },
    [recomputeAll],
  );

  const updateActividad = useCallback(
    (idx: number, patch: Partial<ActividadRow>) => {
      setS((prev) => {
        const normalizedPatch: Partial<ActividadRow> = { ...patch };

        // ✅ Redondeo solo para ingresosGravados
        if (typeof patch.ingresosGravados === "number") {
          normalizedPatch.ingresosGravados = roundTo1000(
            patch.ingresosGravados,
          );
        }

        const nextActs = prev.actividades.map((a, i) =>
          i === idx ? { ...a, ...normalizedPatch } : a,
        );

        return recomputeAll({ ...prev, actividades: nextActs });
      });
    },
    [recomputeAll],
  );

  const addActividad = useCallback(() => {
    setS((prev) => {
      if (prev.actividades.length >= MAX_ACTIVIDADES) return prev;

      return recomputeAll({
        ...prev,
        actividades: [
          ...prev.actividades,
          {
            idActividad: null,
            selectedValue: null,
            codigo: "",
            descripcion: "",
            ingresosGravados: 0,
            tarifaXMil: 0,
            impuesto: 0,
          },
        ],
      });
    });
  }, [recomputeAll]);

  const removeActividad = useCallback(
    (idx: number) => {
      setS((prev) =>
        recomputeAll({
          ...prev,
          actividades: prev.actividades.filter((_, i) => i !== idx),
        }),
      );
    },
    [recomputeAll],
  );

  const updateTieneAvisos = useCallback(
    (value: SiNo) => {
      setS((prev) =>
        recomputeAll({
          ...prev,
          tieneAvisos: value,
        }),
      );
    },
    [recomputeAll],
  );

  return {
    s,
    updateDetalle,
    updateActividad,
    addActividad,
    removeActividad,
    updateTieneAvisos,
  };
};
