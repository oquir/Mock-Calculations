import { Providers } from "./providers";
import { DeclaracionFlowProvider, DeclaracionFlowModals } from "./context/declaracion-flow";
import IcaPage from "../features/ica/pages";

export default function App() {
  return (
    <Providers>
      <DeclaracionFlowProvider>
        <DeclaracionFlowModals />
        <IcaPage />
      </DeclaracionFlowProvider>
    </Providers>
  );
}
