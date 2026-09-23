import clsx from "clsx";
import { FC } from "react";
import { useFragment } from "react-relay";
import { graphql, Result } from "relay-runtime";
import { MsgSwap } from "rujira.js";
import { Icons, useTranslation } from "rujira.ui";
import swapIcon from "../../common/assets/swap.gif";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { ActionsFragment$key } from "./__generated__/ActionsFragment.graphql";
import { useSwapContext } from "./Context";
const { Bolt, ExclamationCircle, ExclamationTriangle } = Icons;

const fragment = graphql`
  fragment ActionsFragment on ThorchainQuote {
    fees {
      totalBps
    }
    streamingSwapBlocks
    streamingSwapSeconds
    totalSwapSeconds
    inboundAddress
    memo
  }
`;

export const Actions: FC<{
  k?: Result<ActionsFragment$key | undefined | null, unknown>;
  onSuccess?: () => void;
}> = ({ k, onSuccess }) => {
  const { t } = useTranslation();
  const { selected } = useAccounts();
  const data = useFragment(fragment, k?.ok ? k.value : undefined);
  const { feeWarning, from, amount, source } = useSwapContext();
  const instant = data && data.totalSwapSeconds === 0;
  const isDangerous = data && data.fees.totalBps > feeWarning;

  const msg =
    data?.memo && from && amount > 0n && source
      ? new MsgSwap(
          { address: source.address, network: source.asset.chain },
          source.asset,
          amount,
          data.memo
        )
      : null;

  return (
    <div className="swap__details text-center mt-4">
      {selected ? (
        <MsgProvider msg={msg}>
          <TxButton
            onSuccess={onSuccess}
            disabled={!data}
            className={clsx({
              "button--icon-right": true,
              "button--big": !isDangerous,
              "button--red": isDangerous,
            })}
            label={
              data
                ? isDangerous
                  ? t("iUnderstandContinue")
                  : instant
                    ? t("instantSwap")
                    : t("initiateSwap")
                : t("calculatingRoute")
            }>
            {data && isDangerous ? (
              <ExclamationTriangle />
            ) : instant ? (
              <Bolt />
            ) : (
              <img src={swapIcon} alt="swap" className="filter-white h-3" />
            )}
          </TxButton>
        </MsgProvider>
      ) : (
        <div className="tag tag--orange tag--icon-left mt-2">
          <ExclamationCircle />
          {t("addOrConnectAccount")}
        </div>
      )}
    </div>
  );
};
