import type { Chain } from "@template/domain/src/chains";

export function SignTransactionForm({ chain, data }: { chain: Chain; data: any }) {
  return (
    <div>
      {JSON.stringify(chain)} {JSON.stringify(data)}
    </div>
  );
}
