import { FC, useMemo, useState } from "react";
import { Asset, MsgExec, THOR } from "rujira.js";
import {
  DenomInput,
  IconDenom,
  Toggle,
  useLocale,
  useTranslation,
} from "rujira.ui";
import {
  BalanceCompact,
  usePreloadedBalance,
} from "../../common/components/Balance";
import {
  MsgProvider,
  TxBalanceAccountButton,
} from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { ChunkSlider } from "../../trade/components/InputQuantity";
import { GhostVaultBalancePreview } from "./GhostVaultBalance";

export const GhostVaultDeposit: FC<{
  asset: Asset;
  address: string;
  currentBalance?: bigint;
}> = ({ address, asset, currentBalance }) => {
  const { t } = useTranslation("strategies");
  const { selected } = useAccounts();
  const { toRoot } = useLocale();
  const touHref = toRoot("tou");

  const [amount, setAmount] = useState(0n);
  const [accept, setAccept] = useState(false);
  const { account, additionalBalance, balance } = usePreloadedBalance();
  const max = (balance?.balance || 0n) + (additionalBalance || 0n);

  const msgDepositAsset = useMemo(() => {
    if (!accept) return null;
    if (!account) return null;
    return selected && amount
      ? new MsgExec(
          { address: account.address, network: THOR },
          account.asset,
          amount,
          address,
          { deposit: {} }
        )
      : null;
  }, [accept, amount, selected]);

  return (
    <MsgProvider msg={msgDepositAsset}>
      <h3 className="h3 mb-0 flex ai-c">
        <IconDenom
          denom={asset.metadata.symbol}
          className="as-c w-4 h-4 block mr-1 no-shrink"
        />
        {t("deposit")} {asset.metadata.symbol}
      </h3>
      <BalanceCompact className="mt-2" onClick={(v) => setAmount(v.balance)} />
      <DenomInput
        symbol={asset.metadata.symbol}
        className="mt-1"
        amount={amount}
        decimals={asset.metadata.decimals}
        onChangeAmount={setAmount}
        //max={balance?.balance || 0n}
        fiat={{ price: asset.price?.current, symbol: "$" }}
      />
      <div className="flex ai-c mt-1">
        <a
          className="fs-12 condensed fw-500 color-grey hover-white mr-0.5 pointer"
          onClick={() => setAmount(0n)}>
          0%
        </a>
        <ChunkSlider amount={amount} setAmount={setAmount} max={max} />
        <a
          className="fs-12 condensed fw-500 color-grey hover-white ml-0.5 pointer"
          onClick={() => setAmount(max)}>
          100%
        </a>
      </div>

      {currentBalance !== undefined && (
        <GhostVaultBalancePreview
          className="mt-2"
          current={currentBalance}
          next={currentBalance + amount}
          decimals={asset.metadata.decimals}
          price={asset.price?.current}
          symbol={asset.metadata.symbol}
        />
      )}

      <div className="modal__footer mt-4 px-3 py-2 flex dir-c dir-xs-r ai-s ai-xs-c jc-xs-sb gap-1">
        <Toggle
          checked={accept}
          onChange={(e) => {
            setAccept(e.currentTarget.checked);
          }}
          className="toggle--small ai-c">
          <span className="toggle__label">
            {t("acceptTerms")}{" "}
            <a
              href={touHref}
              target="_blank"
              className="color-white hover-primary1">
              {t("termsOfUse")}
            </a>
          </span>
        </Toggle>
        <div className="block ml-xs-a text-right">
          <TxBalanceAccountButton
            hideSimulation
            label={t("lendSymbol", { symbol: asset.metadata.symbol })}
            required={{ asset, amount }}
          />
        </div>
      </div>
    </MsgProvider>
  );
};
