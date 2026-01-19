import { useCallback, useState } from "react";
import type { IcaFormState } from "./domain/types";
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
} from "./domain/calculations";
import { MoneyInput } from "./components/MoneyInput";
import { MoneyOutput } from "./components/MoneyOutput";

const initialState: IcaFormState = {
  codigoMunicipio: "8999994152",
  anioGravable: new Date().getFullYear() - 1,
  tieneAvisos: "Si",
  tieneSobretasa: "Si",
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
    sobretasa: 0,
    sobretasaSeguridad: 0,
    totalImpuestoCargo: 0,

    valorExencion: 0,
    retenciones: 0,
    autorretenciones: 0,
    anticipoLiquidado: 0,
    anticipoImpuesto: 0,
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

    destino: "",
  },
  actividades: [
    {
      idActividad: null,
      selectedValue: null,
      codigo: "",
      ingresosGravados: 0,
      tarifaXMil: 0,
      impuesto: 0,
    },
  ],
};

export default function IcaPage() {
  const [s, setS] = useState<IcaFormState>(initialState);

  const recomputeAll = useCallback((next: IcaFormState): IcaFormState => {
    let d = next.detalle;

    d = calcR10(d);
    d = calcR16(d);

    const actsBase = next.actividades.map((a, idx) =>
      idx === 0 ? { ...a, ingresosGravados: d.ingresosGravables } : a
    );

    const {
      next: acts,
      totalIngreso,
      totalImpuesto,
    } = calcActividades(actsBase);

    d = { ...d, totalIngreso, totalImpuesto };
    d = calcR20(d);

    const impAvisosYTableros = calcAvisos(d.impIndYComercio, next.tieneAvisos);
    const sobretasa = calcSobretasa({
      codigoMunicipio: next.codigoMunicipio,
      anioGravable: next.anioGravable,
      impIndYComercio: d.impIndYComercio,
      impAvisosYTableros,
      ingresosGravables: d.ingresosGravables,
    });

    d = { ...d, impAvisosYTableros, sobretasa };
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

  const updateDetalle = (patch: Partial<IcaFormState["detalle"]>) => {
    setS((prev) =>
      recomputeAll({ ...prev, detalle: { ...prev.detalle, ...patch } })
    );
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        Declaración de Industria y Comercio
      </h1>

      {/* BASE */}
      <section className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">Base Gravable</h2>

        <div className="grid grid-cols-1 gap-6">
          <MoneyInput
            id="r8"
            label="8. Total Ingresos Ordinarios y Extraordinarios del Periodo en Todo el País"
            value={s.detalle.ingresosOrdinarios}
            onChange={(n) => updateDetalle({ ingresosOrdinarios: n })}
          />

          <MoneyInput
            id="r9"
            label="9. menos: Ingresos Fuera de Este Municipio o Distrito"
            value={s.detalle.ingresosFueraMunicipio}
            onChange={(n) => updateDetalle({ ingresosFueraMunicipio: n })}
          />

          <MoneyOutput
            id="r10"
            label="10. Total Ingresos Ordinarios y Extraordinarios en Este Municipio (Renglón 8-9)"
            value={s.detalle.totalIngresosOrdinarios}
          />

          <MoneyInput
            id="r11"
            label="11. menos: Ingresos Por Devolución, Rebajas, Descuentos"
            value={s.detalle.devolucionDescuentos}
            onChange={(n) => updateDetalle({ devolucionDescuentos: n })}
          />

          <MoneyInput
            id="r12"
            label="12. menos: Ingresos Por Exportaciones"
            value={s.detalle.exportaciones}
            onChange={(n) => updateDetalle({ exportaciones: n })}
          />

          <MoneyInput
            id="r13"
            label="13. menos: Ingresos Por Venta de Activos Fijos"
            value={s.detalle.activosFijos}
            onChange={(n) => updateDetalle({ activosFijos: n })}
          />

          <MoneyInput
            id="r14"
            label="14. menos: Ingresos Por Actividades Excluidas o No Sujetas y Otros Ingresos No Gravados"
            value={s.detalle.actividadesExcluidas}
            onChange={(n) => updateDetalle({ actividadesExcluidas: n })}
          />

          <MoneyInput
            id="r15"
            label="15. menos: Ingresos Por Otras Actividades Exentas en Este Municipio o Distrito (Por Acuerdo)"
            value={s.detalle.actividadesExentas}
            onChange={(n) => updateDetalle({ actividadesExentas: n })}
          />

          <MoneyOutput
            id="r16"
            label="16. Total ingresos gravables (Renglón 10 Menos 11, 12, 13, 14 y 15)"
            value={s.detalle.ingresosGravables}
          />
        </div>
      </section>

      {/* RESUMEN */}
      <section className="rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Liquidación
        </h2>

        <dl className="grid grid-cols-1 gap-y-3 gap-x-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Impuesto ICA (r20)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.impIndYComercio.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Total impuesto a cargo (r25)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.totalImpuestoCargo.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Total a pagar (r38)</dt>
            <dd className="font-semibold text-gray-900 font-mono">
              ${s.detalle.totalAPagar.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Total con pago voluntario (r40)</dt>
            <dd className="font-semibold text-gray-900 font-mono">
              ${s.detalle.totalPagoVoluntario.toLocaleString("es-CO")}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
