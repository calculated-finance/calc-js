import { GetWalletAddressDAIntermediateValue } from "@ledgerhq/device-signer-kit-bitcoin";
import { FC, StrictMode, useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { Observable } from "rxjs";

const Modal: FC<{
  observer: Observable<GetWalletAddressDAIntermediateValue>;
}> = ({ observer }) => {
  const [value, setValue] = useState<GetWalletAddressDAIntermediateValue>();
  const [error, setError] = useState();
  useEffect(() => {
    observer.subscribe({ next: setValue, error: setError });
  }, [observer]);
  return (
    <StrictMode>
      <div className="ledger m-8 p-3 card card--border">
        <pre>
          Required: {value?.requiredUserInteraction}
          <br />
          Error: {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    </StrictMode>
  );
};

export const renderModal = (
  observer: Observable<GetWalletAddressDAIntermediateValue>
): Root => {
  const el = document.getElementById("ledger");
  if (!el) throw new Error(`div#ledger root not found`);
  const root = createRoot(el);
  root.render(<Modal observer={observer} />);
  return root;
};
