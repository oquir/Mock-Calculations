import { useContext } from "react";
import { DeclaracionFlowContext } from "./DeclarationFlowContext";

export function useDeclaracionFlow() {
  const context = useContext(DeclaracionFlowContext);
  if (!context) {
    throw new Error(
      "useDeclaracionFlow must be used within DeclaracionFlowProvider",
    );
  }
  return context;
}