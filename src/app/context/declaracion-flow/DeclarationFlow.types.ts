export type Periodo =
  | "Enero-Febrero"
  | "Marzo-Abril"
  | "Mayo-Junio"
  | "Julio-Agosto"
  | "Septiembre-Octubre"
  | "Noviembre-Diciembre"
  | "Anual";

export type TipoDeclaracion = "Declaración Inicial" | "Corrección" | "Clausura";

export type TipoPresentacion =
  | "Anterior a emplazamiento"
  | "Posterior a emplazamiento";

export interface DeclaracionFlowState {
  anioGravable: number;
  periodo: Periodo | "";
  tipoDeclaracion: TipoDeclaracion | "";
  tipoPresentacion: TipoPresentacion | "";
}

export interface DeclaracionFlowContextValue {
  state: DeclaracionFlowState;
  step: number;
  setAnioGravable: (value: number) => void;
  setPeriodo: (value: Periodo) => void;
  setTipoDeclaracion: (value: TipoDeclaracion) => void;
  setTipoPresentacion: (value: TipoPresentacion) => void;
  nextStep: () => void;
  isStepComplete: boolean;
}
