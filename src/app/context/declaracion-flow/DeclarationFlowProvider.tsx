import { useState, type ReactNode } from "react";
import type {
  DeclaracionFlowState,
  Periodo,
  TipoDeclaracion,
  TipoPresentacion,
} from "./DeclarationFlow.types";
import { DeclaracionFlowContext } from "./DeclarationFlowContext";

export function DeclaracionFlowProvider({ children }: { children: ReactNode }) {
  const currentYear = new Date().getFullYear();
  const [state, setState] = useState<DeclaracionFlowState>({
    anioGravable: currentYear - 1,
    periodo: "",
    tipoDeclaracion: "",
    tipoPresentacion: "",
  });

  const [step, setStep] = useState(0);

  const setAnioGravable = (value: number) =>
    setState((prev) => ({ ...prev, anioGravable: value }));
  const setPeriodo = (value: Periodo) =>
    setState((prev) => ({
      ...prev,
      periodo: prev.periodo === value ? "" : value,
    }));

  const setTipoDeclaracion = (value: TipoDeclaracion) =>
    setState((prev) => ({ ...prev, tipoDeclaracion: value }));
  const setTipoPresentacion = (value: TipoPresentacion) =>
    setState((prev) => ({ ...prev, tipoPresentacion: value }));

  const isStepComplete =
    step === 1
      ? state.tipoDeclaracion !== ""
      : step === 2
        ? state.tipoPresentacion !== ""
        : true;

  const nextStep = () => {
    if (!isStepComplete) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const value = {
    state,
    step,
    setAnioGravable,
    setPeriodo,
    setTipoDeclaracion,
    setTipoPresentacion,
    nextStep,
    isStepComplete,
  };

  return (
    <DeclaracionFlowContext.Provider value={value}>
      {children}
    </DeclaracionFlowContext.Provider>
  );
}
