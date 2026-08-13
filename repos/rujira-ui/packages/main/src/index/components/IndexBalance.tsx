import { FC, useState } from "react";
import { useFragment } from "react-relay";
import { useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import { Account, Asset, MsgSend } from "rujira.js";
import {
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Input,
  nFormatter,
  Numeric,
  TranslationProvider,
  useGlobalModalContext,
  useTranslation,
} from "rujira.ui";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { useAccounts } from "../../services/accounts";
import { useMsgAssetFragment } from "../../services/msg";
import { IndexBalanceFragment$key } from "./__generated__/IndexBalanceFragment.graphql";
import { IndexShareCard } from "./IndexShareCard";

const fragment = graphql`
  fragment IndexBalanceFragment on IndexAccount {
    sharesValue
    shares
    account
    index {
      id
      shareAsset {
        ...msgAssetFragment
        asset
        metadata {
          decimals
          symbol
        }
      }
    }
  }
`;

export const BalanceIndex: FC<{ k: IndexBalanceFragment$key }> = ({ k }) => {
  const data = useFragment(fragment, k);
  const navigate = useNavigate();
  const { showModal, hideModal } = useGlobalModalContext();
  const { t } = useTranslation();

  const shareAsset = useMsgAssetFragment(data?.index.shareAsset);
  return (
    <div className="card card--shadow flex dir-c ji-c ai-c jc-sb my-2 p-2">
      <div className="flex row jc-sb w-full">
        <div className="flex row ji-c ai-c">
          <IconDenom
            denom={data.index.shareAsset.metadata.symbol}
            className="index__denomIconSmall"
          />
          <label className="pl-1">
            {data.index.shareAsset.metadata.symbol}
          </label>
          <IndexShareCard
            symbol={data.index.shareAsset.metadata.symbol}
            sharesValue={data.sharesValue}
            variant="icon-purple"
            className="ml-1"
          />
        </div>
        <div className="flex row dir-c">
          <Decimal
            amount={BigInt(data.shares)}
            decimals={data.index.shareAsset.metadata.decimals}
          />
          <Fiat
            className="color-grey"
            amount={BigInt(data.sharesValue)}
            symbol="$"
            decimals={data.index.shareAsset.metadata.decimals}
          />
        </div>
      </div>
      <div className="flex ai-c w-full gap-1 mt-1">
        <Button
          className="button--outline button--small mt-2 mt-md-0 index__manage-button button--grey"
          onClick={() => {
            shareAsset &&
              showModal({
                //title: `Send ${symbol}`,
                backgroundClose: false,
                children: (
                  <TranslationProvider namespace="index">
                    <Send
                      asset={shareAsset}
                      symbol={shareAsset.metadata.symbol}
                      cancel={hideModal}
                      balance={BigInt(data.shares || 0)}
                    />
                  </TranslationProvider>
                ),
              });
          }}
          label={t("transfer")}
        />
        <Button
          className="button--outline button--small mt-2 mt-md-0 index__manage-button"
          onClick={() => {
            navigate(`../${data.index.shareAsset.metadata.symbol}`);
          }}
          label={t("manage")}
        />
      </div>
    </div>
  );
};

const Send: React.FC<{
  symbol: string;
  asset: Asset;
  balance: bigint;
  cancel: () => void;
}> = ({ asset, symbol, cancel, balance }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0n);
  const { selected } = useAccounts();
  const { t } = useTranslation();
  const msg =
    address && amount && selected
      ? new MsgSend(
          Account.fromAddress(selected.address),
          asset,
          amount,
          address.trim()
        )
      : null;

  return (
    <MsgProvider msg={msg}>
      <h2 className="h3 flex ai-c">
        {t("common:send")} {symbol}
        <IconDenom
          denom={asset.metadata.symbol}
          className="w-4 h-4 block ml-1"
        />
      </h2>

      <div className="text-right">
        <button
          className="tag tag--borderless px-0.5 pointer"
          onClick={() => setAmount(balance)}>
          {symbol} {t("common:balance")}:{" "}
          <span className="color-white ml-0.5">
            {nFormatter(balance, 8, asset.metadata.decimals)}
          </span>
        </button>
      </div>

      <div className="row pad-mini mt-1.5 condensed fs-14 color-grey">
        <div className="col-8 fw-500">{t("common:rujiraAddress")}</div>
        <div className="col-4 text-right mr-0.5 fw-500">
          {t("common:amount")}
        </div>
      </div>
      <div className="row pad-mini mt-1">
        <div className="col-8 flex ai-c">
          <Input
            type="text"
            value={address}
            containerClassName="grow"
            onChange={(e) => {
              setAddress(e.currentTarget.value);
            }}
          />
        </div>
        <div className="col-4">
          <div className="flex ai-c">
            <Numeric
              full
              decimals={asset.metadata.decimals}
              amount={amount}
              initialZeroAsPlaceholder
              onChangeAmount={setAmount}
            />
          </div>
        </div>
      </div>

      <div className="modal__footer mt-4 px-3 py-2 flex ai-s wrap">
        <Button
          className="button--grey button--outline mr-1"
          onClick={cancel}
          label={t("common:cancel")}
        />
        <div className="block ml-a text-right">
          <TxButton
            className="button"
            label={t("common:send")}
            onSuccess={() => cancel()}
          />
        </div>
      </div>
    </MsgProvider>
  );
};
