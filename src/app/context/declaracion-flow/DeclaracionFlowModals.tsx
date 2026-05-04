import { useMemo } from "react";
import { useDeclaracionFlow } from "./useDeclaracionFlow";
import type {
  Periodo,
  TipoDeclaracion,
  TipoPresentacion,
} from "./DeclarationFlow.types";

const periodoOptions: Periodo[] = [
  "Enero-Febrero",
  "Marzo-Abril",
  "Mayo-Junio",
  "Julio-Agosto",
  "Septiembre-Octubre",
  "Noviembre-Diciembre",
  "Anual",
];

const tipoDeclaracionOptions: TipoDeclaracion[] = [
  "Declaración Inicial",
  "Corrección",
  "Clausura",
];

const tipoPresentacionOptions: TipoPresentacion[] = [
  "Anterior a emplazamiento",
  "Posterior a emplazamiento",
];

const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, index) => currentYear - index);
};

export function DeclaracionFlowModals() {
  const {
    state,
    step,
    nextStep,
    setAnioGravable,
    setPeriodo,
    setTipoDeclaracion,
    setTipoPresentacion,
    isStepComplete,
  } = useDeclaracionFlow();

  const years = useMemo(() => getYears(), []);

  if (step >= 3) {
    return null;
  }

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-5">
          <div>
            <label
              htmlFor="anioGravable"
              className="block text-sm font-medium text-gray-700"
            >
              Año gravable
            </label>
            <select
              id="anioGravable"
              value={state.anioGravable}
              onChange={(event) => setAnioGravable(Number(event.target.value))}
              className="mt-2 block w-full rounded-md border-gray-300 bg-transparent py-2 px-3 focus-within:ring-2 focus-within:ring-gray-100"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Período</p>
            <div className="mt-3 grid gap-2">
              {periodoOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm hover:border-blue-400 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="periodo"
                    value={option}
                    checked={state.periodo === option}
                    onClick={() => setPeriodo(option)}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-5">
          <p className="text-sm font-medium text-gray-700">
            Tipo de declaración
          </p>
          <div className="grid gap-2">
            {tipoDeclaracionOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 curosr-pointer rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm hover:border-blue-400"
              >
                <input
                  type="radio"
                  name="tipoDeclaracion"
                  value={option}
                  checked={state.tipoDeclaracion === option}
                  onChange={() => setTipoDeclaracion(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <p className="text-sm font-medium text-gray-700">
          Tipo de presentación
        </p>
        <div className="grid gap-2">
          {tipoPresentacionOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm hover:border-blue-400"
            >
              <input
                type="radio"
                name="tipoPresentacion"
                value={option}
                checked={state.tipoPresentacion === option}
                onChange={() => setTipoPresentacion(option)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const title =
    step === 0
      ? "Seleccione año gravable y período"
      : step === 1
        ? "Seleccione tipo de declaración"
        : "Seleccione tipo de presentación";

  const description =
    step === 0
      ? "Complete los datos iniciales para continuar con la declaración."
      : step === 1
        ? "Elija el tipo de declaración que corresponde al flujo actual."
        : "Elija si la presentación es anterior o posterior al emplazamiento.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Paso {step + 1} de 3
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        </div>

        <div className="mb-6">{renderStepContent()}</div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-500">
            {step === 0 && "Debe elegir un período para continuar."}
            {step === 1 && "Debe elegir un tipo de declaración para continuar."}
            {step === 2 &&
              "Debe elegir un tipo de presentación para continuar."}
          </div>
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepComplete}
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white transition cursor-pointer ${
              isStepComplete
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-slate-300 text-slate-600"
            }`}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
