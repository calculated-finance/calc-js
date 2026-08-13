import { Fragment, useId, useMemo } from "react";
import { Tooltip } from "react-tooltip";
import {
  Address,
  Balance,
  BalanceAccount,
  THOR,
  networkLabel,
} from "rujira.js";
import { nFormatter } from "../../helpers";
import { Provider } from "../../wallets";
import { NetworkIcon } from "../icons/NetworkIcon";
import { ProviderIcon } from "../icons/ProviderIcon";
import { Decimal } from "../numbers/Decimal";

type OmniBalanceProps = {
  onClick?: (b: Balance | BalanceAccount) => void;
  className?: string;
  balance?: Balance;
  accountProviders?: { address: Address; provider: Provider.Key }[] | null;
};

const accountSorter = (a: BalanceAccount, b: BalanceAccount) => {
  const aIsSecured = a.asset.type === "SECURED";
  const bIsSecured = b.asset.type === "SECURED";
  if (aIsSecured && !bIsSecured) return -1;
  if (!aIsSecured && bIsSecured) return 1;
  return Number(b.balance - a.balance);
};

export const OmniBalance = ({
  balance,
  onClick,
  className,
  accountProviders,
}: OmniBalanceProps) => {
  const tooltipId = useId();

  const providerLookup = useMemo(
    () =>
      new Map(
        accountProviders?.map(({ address, provider }) => [
          address.address,
          provider,
        ])
      ),
    [accountProviders]
  );

  const sortedAccounts = balance?.accounts
    ? [...balance.accounts].sort(accountSorter)
    : [];

  return (
    <div className="omni-balance">
      <Decimal
        amount={balance?.balance || 0n}
        className={className}
        onClick={() => balance && onClick?.(balance)}
      />
      {sortedAccounts.length > 0 && (
        <div className="omni-balance__networks">
          {sortedAccounts.map((x) => {
            const n = x.asset.type === "SECURED" ? THOR : x.asset.chain;
            const provider = providerLookup.get(x.address);
            const tipId = `${tooltipId}-${n}`;
            return (
              <Fragment key={n}>
                <button
                  data-tooltip-id={tipId}
                  className={`omni-balance__network-button omni-balance__network-button--${n.toLowerCase()}`}
                  onClick={() => onClick?.(x)}>
                  <NetworkIcon network={n} />
                </button>
                <Tooltip id={tipId} className="tooltip">
                  <div className="flex ai-c gap-1">
                    {provider && (
                      <ProviderIcon
                        provider={provider}
                        selected
                        className="w-3 h-3 block"
                      />
                    )}
                    <div>
                      <div className="condensed fs-16 fw-500">
                        {nFormatter(x.balance, 6)}
                      </div>
                      <div className="fs-14 lh-16 color-grey">
                        on {networkLabel(n)}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
