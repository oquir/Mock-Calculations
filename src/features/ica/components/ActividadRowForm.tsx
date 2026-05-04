import { useMemo } from "react";
import Select from "react-select";
import { MoneyInput } from "./MoneyInput";
import { roundTo1000 } from "../../../shared/utils/money";
import { MoneyOutput } from "./MoneyOutput";
import { Output } from "./OutPut";
import type { SingleValue } from "react-select";
import type { ActividadCatalogoDto, ActividadRow } from "../logic/types";

interface Props {
  idPrefix: string;
  row: ActividadRow;
  catalogo: ActividadCatalogoDto[];
  onChange: (patch: Partial<ActividadRow>) => void;
  onRemove?: () => void;
  removable?: boolean;
  disabled?: boolean;
  excludedIds?: Set<number>;
  allRows: ActividadRow[];
  index: number;
}

interface Option {
  value: number;
  label: string;
  codigoCIIU: string;
  descripcion: string;
  tarifa: number;
  isDisabled?: boolean;
}

export function ActividadRowForm({
  idPrefix,
  row,
  catalogo,
  allRows,
  index,
  onChange,
  onRemove,
  removable = false,
  disabled = false,
}: Props) {
  // ✅ IDs usados en OTRAS filas
  const usedIds = useMemo(() => {
    const set = new Set<number>();

    for (let i = 0; i < allRows.length; i++) {
      if (i === index) continue;
      const id = allRows[i]?.idActividad;
      if (typeof id === "number") set.add(id);
    }

    return set;
  }, [allRows, index]);

  // ✅ Opciones: deshabilita las ya usadas (excepto la seleccionada actual)
  const options: Option[] = useMemo(() => {
    return catalogo.map((a) => {
      const isUsedElsewhere =
        usedIds.has(a.idActividad) && a.idActividad !== row.idActividad;

      return {
        value: a.idActividad,
        codigoCIIU: a.codigoCIIU,
        descripcion: a.descripcion,
        tarifa: a.tarifa,
        label: `${a.codigoCIIU} - ${a.descripcion}`,
        isDisabled: isUsedElsewhere,
      };
    });
  }, [catalogo, usedIds, row.idActividad]);

  const selected: Option | null = useMemo(() => {
    if (!row.idActividad) return null;
    return options.find((o) => o.value === row.idActividad) ?? null;
  }, [row.idActividad, options]);

  const handleSelect = (opt: SingleValue<Option>) => {
    if (!opt) {
      onChange({
        idActividad: null,
        selectedValue: null,
        codigo: "",
        descripcion: "",
        tarifaXMil: 0,
        impuesto: 0,
      });
      return;
    }

    onChange({
      idActividad: opt.value,
      selectedValue: String(opt.value),
      codigo: opt.codigoCIIU,
      descripcion: opt.descripcion,
      tarifaXMil: opt.tarifa,
    });
  };

  const impuestoCalculado = useMemo(() => {
    const ingresos = row.ingresosGravados || 0;
    const tarifa = row.tarifaXMil || 0;
    return ingresos > 0 && tarifa > 0
      ? roundTo1000((ingresos * tarifa) / 1000)
      : 0;
  }, [row.ingresosGravados, row.tarifaXMil]);

  // Mantener row.impuesto sincronizado (si quieres que el estado guarde el valor calculado)
  // Aquí lo dejo como “vista” (read-only). Si tú quieres guardarlo, lo haces en recomputeAll/calcActividades.

  return (
    <div className="relative rounded-lg border border-gray-200 p-4 space-y-4 bg-white">
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={`absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-sm font-semibold transition-colors duration-200 cursor-pointer rounded-tr-lg rounded-bl-md disabled:text-gray-300 disabled:cursor-not-allowed text-gray-500 hover:bg-red-500 hover:text-white`}
          aria-label="Eliminar actividad"
          title="Eliminar actividad"
        >
          ✕
        </button>
      )}

      <div className="flex items-start justify-between gap-4 mt-2.5">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-800">Actividad</label>

          <Select
            inputId={`${idPrefix}-actividad`}
            isDisabled={disabled}
            options={options}
            value={selected}
            onChange={handleSelect}
            placeholder="Busca por código o descripción…"
            noOptionsMessage={() => "No se encontraron actividades"}
            classNamePrefix="rs"
            filterOption={(candidate, input) => {
              const q = input.trim().toLowerCase();
              if (!q) return true;
              const data = candidate.data as Option;
              return (
                candidate.label.toLowerCase().includes(q) ||
                data.codigoCIIU.toLowerCase().includes(q) ||
                data.descripcion.toLowerCase().includes(q)
              );
            }}
          />
        </div>

        <div className="w-40">
          <Output
            id={`${idPrefix}-codigo`}
            label="Código"
            value={Number(row.codigo || 0)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MoneyInput
          id={`${idPrefix}-ingresos`}
          label="Ingresos gravados"
          value={row.ingresosGravados}
          onChange={(n) => onChange({ ingresosGravados: n })}
          disabled={disabled}
        />

        <Output
          id={`${idPrefix}-tarifa`}
          label="Tarifa x mil"
          value={row.tarifaXMil ?? 0}
          suffix="x1000"
        />

        <MoneyOutput
          id={`${idPrefix}-impuesto`}
          label="Impuesto"
          value={impuestoCalculado}
          suffix=""
        />
      </div>
    </div>
  );
}
