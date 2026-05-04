import { createContext } from "react";
import type { DeclaracionFlowContextValue } from "./DeclarationFlow.types";

export const DeclaracionFlowContext = createContext<
  DeclaracionFlowContextValue | undefined
>(undefined);