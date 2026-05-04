import { MoneyInput } from "../components/MoneyInput";
import { MoneyOutput } from "../components/MoneyOutput";
import { MOCK_ACTIVIDADES_CATALOGO } from "../logic/mocks";
import { ActividadRowForm } from "../components/ActividadRowForm";
import { EnergyInput } from "../components/EnergyInput";
import { useDeclaracionFlow } from "../../../app/context/declaracion-flow";
import { useIcaForm } from "../hooks";
import type { DeclaracionIca } from "../api/types";
import type { IcaFormState, RadioOption, SiNo } from "../logic/types";
import { InputRadioGroup } from "../components/InputRadioGroup";

const mapToDeclaracionIca = (state: IcaFormState): DeclaracionIca => {
  const d = state.detalle;
  return {
    idTipoDeclaracion: 1, // Valor de prueba
    numeroRadicado: 123456, // Valor de prueba
    contribuyente: {
      codigoMunicipio: state.codigoMunicipio,
      idTipoDocumento: 1, // CC
      idTipoPersona: 1, // Natural
      numeroDocumento: "123456789",
      digitoVerificacion: 0,
      primerNombre: "Juan",
      segundoNombre: "Carlos",
      primerApellido: "Pérez",
      segundoApellido: "Gómez",
      nombreCompleto: "Juan Carlos Pérez Gómez",
      idCiudad: 1,
      direccion: "Calle 123 #45-67",
      correo: "juan.perez@example.com",
      telefono: "3001234567",
      numeroEstablecimiento: 1,
      idClasificacionMunicipio: 1,
    },
    periodoAnio: state.anioGravable,
    idPeriodoAnual: 1, // Valor de prueba
    baseGravable: {
      totalIngresosNacionales: d.ingresosOrdinarios,
      ingresosFueraMunicipio: d.ingresosFueraMunicipio,
      totalIngresosOrdinarios: d.totalIngresosOrdinarios,
      ingresosDevolucionesDescuentos: d.devolucionDescuentos,
      ingresosExportaciones: d.exportaciones,
      ingresosVentaActivos: d.activosFijos,
      ingresosExcluidosNoGravados: d.actividadesExcluidas,
      ingresosExentosMunicipio: d.actividadesExentas,
      totalIngresosGravables: d.ingresosGravables,
    },
    actividades: state.actividades.map((act) => ({
      idDeclaracion: 1, // Valor de prueba
      idActividad: act.idActividad || 0,
      ingresoGravado: act.ingresosGravados,
      tarifaXMil: act.tarifaXMil,
      valorImpuestoActividad: act.impuesto,
    })),
    generacionEnergiaKw: d.energia,
    impuestoLey56: d.impuestoLey,
    impuestoACargo: {
      impuestoAvisosTableros: d.impAvisosYTableros,
      pagoUnidadesSectorFinanciero: d.unidadesComerciales,
      sobretasaBomberil: d.sobretasaBomberil,
      idTipoJuegoPermitido: 0, // Valor de prueba
      impuestoJuegoPermitido: 0, // Valor de prueba
      sobretasaSeguridad: d.sobretasaSeguridad,
      estampillaSistematizacion: 0, // Valor de prueba
      totalImpuestoACargo: d.totalImpuestoCargo,
    },
    ajusteDeclaracion: {
      valorExencionExoneracionImpuesto: d.valorExencion,
      retencionesAFavor: d.retenciones,
      autoretencionesAFavor: d.autorretenciones,
      anticipoLiquidadoAnioAnterior: d.anticipoLiquidado,
      anticipoAnioSiguiente: d.anticipoImpuesto,
      idTipoSancion: 0, // Valor de prueba
      descripcionSancion: "",
      valorSancion: d.sanciones,
      saldoFavorPeriodoAnterior: d.saldoPeriodo,
      saldoPagosRecibidos: 0, // Valor de prueba
      totalAjusteDeclaracion: d.totalSaldoCargo, // Aproximado
    },
    totalDeclaracion: {
      totalSaldoACargo: d.totalSaldoCargo,
      totalSaldoAFavor: d.totalSaldoFavor,
      descuentoProntoPago: d.descuento,
      interesMora: d.interesMora,
      valorAporteVoluntario: d.pagoVoluntario,
      totalDeclaracion: d.totalPagoVoluntario,
    },
    descripcionAporteVoluntario: "",
    declarante: {
      idTipoDocumento: 1,
      numeroDocumento: "123456789",
      nombreCompleto: "Juan Carlos Pérez Gómez",
    },
    responsableLegal: {
      idTipoRepresentante: 1, // Valor de prueba
      idTipoDocumento: 1,
      numeroDocumento: "987654321",
      primerNombre: "Ana",
      segundoNombre: "María",
      primerApellido: "Rodríguez",
      segundoApellido: "López",
      celular: "3019876543",
      correoElectronico: "ana.rodriguez@example.com",
      nroTarjetaProfesional: "123456789",
    },
  };
};

const SINO_OPTIONS: RadioOption[] = [
  { value: "Si", label: "Sí" },
  { value: "No", label: "No" },
];

const SANCION_OPTIONS: RadioOption[] = [
  { value: "1", label: "Extemporaneidad" },
  { value: "2", label: "Corrección" },
  { value: "3", label: "Inexactitud" },
  { value: "4", label: "Otra" },
];

export default function IcaPage() {
  const { state } = useDeclaracionFlow();
  const {
    s,
    updateDetalle,
    updateActividad,
    addActividad,
    removeActividad,
    updateTieneAvisos,
  } = useIcaForm({
    anioGravable: state.anioGravable,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900 text-center">
        Declaración de Industria y Comercio
      </h1>

      {/* BASE GRAVABLE */}
      <section className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Base Gravable
        </h2>

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

      {/* ACTIVIDADES GRAVADAS */}
      <section className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Actividades
        </h2>

        <div className="space-y-4">
          {s.actividades.map((row, idx) => (
            <ActividadRowForm
              key={idx}
              idPrefix={`act-${idx}`}
              row={row}
              catalogo={MOCK_ACTIVIDADES_CATALOGO}
              allRows={s.actividades}
              index={idx}
              onChange={(patch) => updateActividad(idx, patch)}
              removable={idx > 0}
              onRemove={() => removeActividad(idx)}
            />
          ))}

          <div>
            <button
              type="button"
              onClick={addActividad}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
            >
              + Agregar actividad
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <MoneyOutput
            id="total-ingresos"
            label="Total ingresos"
            value={s.detalle.totalIngreso}
          />
          <MoneyOutput
            id="r17"
            label="Total impuesto"
            value={s.detalle.totalImpuesto}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 items-end">
          <EnergyInput
            id="r18"
            label="18. Generación de Energía / Capacidad Instalada"
            value={s.detalle.energia}
            onChange={(n) => updateDetalle({ energia: n })}
          />
          <MoneyOutput
            id="r19"
            label="19. Impuesto Ley 56 1981"
            value={s.detalle.impuestoLey}
          />
        </div>
      </section>

      {/* LIQUIDACION PRIVADA */}
      <section className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Liquidacion Privada
        </h2>

        <section className="rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-md font-semibold text-gray-800 text-center">
            Impuesto a Cargo
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <MoneyOutput
              id="r20"
              label="20.  Total Impuesto de Industria y Comercio (Renglón 17 + 19)"
              value={s.detalle.impIndYComercio}
            />

            {/* Renglón 21 corregido */}
            <MoneyOutput
              id="r21"
              label="21. Impuesto de Avisos y Tableros"
              value={s.detalle.impAvisosYTableros}
            >
              <InputRadioGroup
                label="¿Tiene avisos?"
                options={SINO_OPTIONS}
                selectedValue={s.tieneAvisos}
                onChange={(val) => updateTieneAvisos(val as SiNo)}
              />
            </MoneyOutput>

            <MoneyInput
              id="r22"
              label="22. Pago Por Unidades Comerciales Adicionales del Sector Financiero"
              value={s.detalle.unidadesComerciales}
              onChange={(n) => updateDetalle({ unidadesComerciales: n })}
            />

            <MoneyOutput
              id="r23"
              label="23. Sobretasa Bomberil (Ley 1575 de 2012) (Si la hay, Liquídela Según el Acuerdo Municipal o Distrital)"
              value={s.detalle.sobretasaBomberil}
            />

            <MoneyInput
              id="r24"
              label="24. Sobretasa de Seguridad (Ley 1421 de 2011) (Si la hay, Liquídela Según el Acuerdo Municipal o Distrital)"
              value={s.detalle.sobretasaSeguridad}
              onChange={(n) => updateDetalle({ sobretasaSeguridad: n })}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6">
          <MoneyOutput
            id="r25"
            label="25. Total Impuesto a Cargo (Renglón 20 + 21 + 22 + 23 + 24)"
            value={s.detalle.totalImpuestoCargo}
          />
        </div>

        <section className="rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-md font-semibold text-gray-800 text-center">
            Deducciones, Sanciones y Anticipos
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <MoneyInput
              id="r26"
              label="26. Menos: Valor de Exención o Exoneración Sobre el Impuesto y No Sobre los Ingresos"
              value={s.detalle.valorExencion}
              onChange={(n) => updateDetalle({ valorExencion: n })}
            />

            <MoneyInput
              id="r27"
              label="27. Menos: Retenciones que le practicaron a favor de este municipio o distrito en este periodo"
              value={s.detalle.retenciones}
              onChange={(n) => updateDetalle({ retenciones: n })}
            />

            <MoneyInput
              id="r28"
              label="28. Menos: Autorretenciones practicadas a favor de este municipio o distrito en este periodo"
              value={s.detalle.autorretenciones}
              onChange={(n) => updateDetalle({ autorretenciones: n })}
            />

            <MoneyInput
              id="r29"
              label="29. Menos: Anticipo Liquidado en el Año Anterior"
              value={s.detalle.anticipoLiquidado}
              onChange={(n) => updateDetalle({ anticipoLiquidado: n })}
            />

            <MoneyInput
              id="r30"
              label="30. Anticipo del Año Siguiente (Si Existe, Liquide Porcentaje Según Acuerdo Municipal o Distrital):"
              value={s.detalle.anticipoImpuesto}
              onChange={(n) => updateDetalle({ anticipoImpuesto: n })}
            />

            <MoneyInput
              id="r31"
              label="31. Más: Sanciones"
              value={s.detalle.sanciones}
              onChange={(n) => updateDetalle({ sanciones: n })}
            >
              <InputRadioGroup
                label="Tipo de sanción:"
                options={SANCION_OPTIONS}
                selectedValue={s.detalle.tipoSancion.toString()}
                onChange={(val) => updateDetalle({ tipoSancion: Number(val) })}
                showExtraOn="4"
                extraPlaceholder="¿Cuál es la razón de la sanción?"
                extraValue={s.detalle.descripcionSancion}
                onExtraChange={(val) => updateDetalle({ descripcionSancion: val })}
              />
            </MoneyInput>

            <MoneyInput
              id="r32"
              label="32. Menos: Saldo a Favor del Periodo Anterior Sin Solicitud de Devolución o Compensación"
              value={s.detalle.saldoPeriodo}
              onChange={(n) => updateDetalle({ saldoPeriodo: n })}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6">
          <MoneyOutput
            id="r33"
            label="33. Total Saldo a Cargo (Renglón 25 - 26 - 27 - 28 - 29 + 30 + 31 - 32)"
            value={s.detalle.totalSaldoCargo}
          />

          <MoneyOutput
            id="r34"
            label="34. Total Saldo a Favor (Renglón 25 - 26 - 27 - 28 - 29 + 30 + 31 - 32) si el resultado es menor a cero"
            value={s.detalle.totalSaldoFavor}
          />
        </div>
      </section>

      {/* TOTALES */}
      <section className="rounded-lg border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          Totales
        </h2>

        <section className="rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-md font-semibold text-gray-800 text-center">
            Total a Pagar
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <MoneyOutput
              id="r35"
              label="35. Valor a Pagar"
              value={s.detalle.valorPagar}
            />

            <MoneyOutput
              id="r36"
              label="36. Descuento Por Pronto Pago (Si Existe, Liquidelo Según el Acuerdo Municipal o Distrital)"
              value={s.detalle.sobretasaBomberil}
            />

            <MoneyInput
              id="r37"
              label="37. Intereses de Mora"
              value={s.detalle.interesMora}
              onChange={(n) => updateDetalle({ interesMora: n })}
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6">
          <MoneyOutput
            id="r38"
            label="38. Total a Pagar (Renglón 35 - 36 + 37)"
            value={s.detalle.totalAPagar}
          />
        </div>

        <section className="rounded-lg border border-gray-200 p-6 space-y-6">
          <h3 className="text-md font-semibold text-gray-800 text-center">
            SECCIÓN PAGO VOLUNTARIO (Solamente donde exista esta opción)
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <MoneyInput
              id="r39"
              label="39. Liquide el Valor del Pago Voluntario (Según Instrucciones del Municipio/Distrito)"
              value={s.detalle.pagoVoluntario}
              onChange={(n) => updateDetalle({ pagoVoluntario: n })}
            />

            <MoneyOutput
              id="r40"
              label="40. Total a Pagar Con Pago Voluntario (Renglón 38 + 39)"
              value={s.detalle.totalPagoVoluntario}
            />
          </div>
        </section>
      </section>

      {/* RESUMEN */}
      <section className="rounded-lg bg-gray-50 border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Resumen de Liquidación
        </h2>

        <dl className="grid grid-cols-1 gap-y-3 gap-x-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600">Total Ingresos nacionales (r08)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.ingresosOrdinarios.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Ingresos Fuera municipio (r09)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.ingresosFueraMunicipio.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Total Ingresos Ordinarios (r10)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.totalIngresosOrdinarios.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Devoluciones y descuento (r11)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.devolucionDescuentos.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Exportaciones (r12)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.exportaciones.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Activos fijos (r13)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.activosFijos.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Actividades excluidas (r14)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.actividadesExcluidas.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Actividades exentas (r15)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.actividadesExentas.toLocaleString("es-CO")}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-600">Ingresos gravables (r16)</dt>
            <dd className="font-medium font-mono">
              ${s.detalle.ingresosGravables.toLocaleString("es-CO")}
            </dd>
          </div>

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

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => console.log(mapToDeclaracionIca(s))}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Convertir a DeclaracionICA y mostrar en consola
        </button>
      </div>
    </div>
  );
}
