import clsx from "clsx";
import { FC, useMemo, useState } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "relay-runtime";
import { MsgExec, THOR } from "rujira.js";
import {
  AssetLabel,
  Decimal,
  DenomInput,
  Fiat,
  formatApr,
  IconDenom,
  Icons,
  useLocale,
  useTranslation,
} from "rujira.ui";

import {
  BalanceProvider,
  usePreloadedBalance,
} from "../../common/components/Balance";
import { MsgProvider, TxButton } from "../../common/components/TxButton";
import { Subscription } from "../../services/useNodeSubscription";
import { StakePoolPageAccountFragment$key } from "./__generated__/StakePoolPageAccountFragment.graphql";
import { StakePoolPageDepositFragment$key } from "./__generated__/StakePoolPageDepositFragment.graphql";
import { StakePoolPageFragment$key } from "./__generated__/StakePoolPageFragment.graphql";
import { StakePoolPageSwapTargetsQuery } from "./__generated__/StakePoolPageSwapTargetsQuery.graphql";
import { AddressLink, StakingContainer } from "./Common";
import {
  RewardModeSelector,
  type RewardModeSelectorPoolContext,
} from "./RewardModeSelector";
import { StakingPoolBalance } from "./StakePoolBalance";

const BRUNE_CONTRACT =
  "thor1enhmz57mpn4umspa8hqgqwwqpe02q4hpqmqr0k2zftxr8fu3nxmqjy3tqx";
const STAKING_ANALYTICS_URLS = new Map([
  ["RUJI", "/analytics/ruji-staking"],
  ["BRUNE", "/analytics/brune-staking"],
  ["TCY", "/analytics/tcy-staking"],
]);

const fragment = graphql`
  fragment StakePoolPageFragment on StakingPool {
    id
    address
    bondAsset {
      asset
      chain
      type
      metadata {
        symbol
        decimals
      }
      variants {
        native {
          denom
        }
      }
    }
    revenueAsset {
      metadata {
        symbol
      }
    }
    stakingSummary: summary {
      apr {
        value
        status
      }
    }
    status {
      id
      accountBond
      liquidBondSize
      valueUsd
    }
    ...StakePoolPageDepositFragment
  }
`;

const subscription = graphql`
  subscription StakePoolPageSubscription($id: ID!) {
    node(id: $id) {
      ... on StakingStatus {
        accountBond
        liquidBondSize
        valueUsd
      }
      ... on StakingSummary {
        apr {
          value
          status
        }
      }
    }
  }
`;

const swapTargetsQuery = graphql`
  query StakePoolPageSwapTargetsQuery {
    finV2(first: 200, sortBy: NAME, sortDir: ASC) {
      edges {
        node {
          address
          assetBase {
            metadata {
              symbol
            }
          }
          assetQuote {
            metadata {
              symbol
            }
          }
        }
      }
    }
  }
`;

// Pool details come from StakePoolPageFragment; stakingV2 is account-scoped
// and supplies the connected user's balance and staking actions.
const accountFragment = graphql`
  fragment StakePoolPageAccountFragment on Account {
    stakingV2 {
      pool {
        id
      }
      ...StakePoolBalanceFragment
    }
  }
`;

/** Liquid = stake into sTCY (auto-compound). Account = stake into TCY, earn RUNE, choose reward handling. */
type StakingType = "liquid" | "account";

function useSwapTargetOptions(
  rewardSymbol: string,
  bondSymbol: string
): { symbols: string[]; addressMap: Map<string, string> } {
  const swapData = useLazyLoadQuery<StakePoolPageSwapTargetsQuery>(
    swapTargetsQuery,
    {},
    { fetchPolicy: "store-or-network" }
  );
  return useMemo(() => {
    const edges = swapData?.finV2?.edges ?? [];
    const reward = rewardSymbol;
    const bond = bondSymbol;
    const symbols = new Set<string>();
    const addressMap = new Map<string, string>();
    for (const edge of edges) {
      const node = edge?.node;
      if (
        !node?.assetBase?.metadata?.symbol ||
        !node?.assetQuote?.metadata?.symbol ||
        !node?.address
      )
        continue;
      const base = node.assetBase.metadata.symbol;
      const quote = node.assetQuote.metadata.symbol;
      if (base === reward) {
        if (quote !== bond) {
          symbols.add(quote);
          addressMap.set(quote, node.address);
        }
      } else if (quote === reward) {
        if (base !== bond) {
          symbols.add(base);
          addressMap.set(base, node.address);
        }
      }
    }
    return {
      symbols: [...symbols].sort(),
      addressMap,
    };
  }, [swapData?.finV2?.edges, rewardSymbol, bondSymbol]);
}

export const StakingPool: FC<{
  k: StakePoolPageFragment$key;
  a?: StakePoolPageAccountFragment$key;
}> = ({ k, a }) => {
  const { t } = useTranslation("staking");
  const data = useFragment(fragment, k);

  const { symbols: swapTargetOptions, addressMap: swapTargetAddressMap } =
    useSwapTargetOptions(
      data.revenueAsset.metadata.symbol,
      data.bondAsset.metadata.symbol
    );

  const total = data.status
    ? BigInt(data.status.accountBond) + BigInt(data.status.liquidBondSize)
    : 0n;

  const account = useFragment(accountFragment, a);
  const acc = (account?.stakingV2 ?? []).find((s) => s.pool?.id === data.id);

  const [stakingType, setStakingType] = useState<StakingType>("liquid");

  const poolContext: RewardModeSelectorPoolContext = useMemo(
    () => ({
      stakedTokenSymbol: data.bondAsset.metadata.symbol,
      poolAddress: data.address,
      rewardSymbol: data.revenueAsset.metadata.symbol,
      swapTargetAddressMap,
    }),
    [
      data.bondAsset.metadata.symbol,
      data.address,
      data.revenueAsset.metadata.symbol,
      swapTargetAddressMap,
    ]
  );

  return (
    <StakingContainer>
      {data.status && (
        <Subscription id={data.status.id} subscription={subscription} />
      )}
      <div className="flex ai-c wrap">
        <h1 className="h1 mb-0 mr-2">
          <AssetLabel
            asset={data.bondAsset}
            Container={({ children }) => (
              <small className="color-grey fs-20 fs-lg-28">{children}</small>
            )}
          />
        </h1>
        <div className="lp big mr-3">
          <IconDenom denom={data.bondAsset.metadata.symbol} />
        </div>
        <div className="tag tag--primary">{t("staking")}</div>
      </div>
      <div className="row pad wrap mt-1">
        <div className="col-12 col-md-8 mt-2">
          <div className="row pad wrap">
            <div className="col-12 col-sm-6">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">
                  {t("strategyTvl")}
                </h3>
                <Fiat
                  symbol="$"
                  amount={BigInt(data.status?.valueUsd || 0)}
                  decimals={8}
                  className="fs-22 fs-md-32 condensed fw-500 mt-1"
                />
                <div className="flex ai-s mt-1">
                  <IconDenom
                    denom={data.bondAsset.metadata.symbol}
                    className="h-3 w-3 mr-1"
                  />
                  <div className="flex dir-c">
                    <Decimal
                      amount={total}
                      round={4}
                      className="fs-18 fs-md-20 lh-18 lh-md-20 condensed color-grey"
                      symbol={data.bondAsset.metadata.symbol}
                    />
                    <div className="fs-14 lh-14 condensed color-grey mt-0.5">
                      (
                      {total > 0n
                        ? (
                            (Number(data.status?.liquidBondSize || 0) /
                              Number(total)) *
                            100
                          ).toFixed(2)
                        : "0.00"}
                      {t("autoCompoundingPercent")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 mt-2 mt-sm-0">
              <div className="card h-full p-3 flex dir-c">
                <h3 className="fs-16 lh-22 fw-400 color-grey">
                  {t("sevenDayApr")}
                </h3>
                <p className="fs-22 fs-md-32 condensed fw-500 mt-1">
                  {formatApr(data.stakingSummary.apr)}
                </p>
                <AnalyticsLink symbol={data.bondAsset.metadata.symbol} />
              </div>
            </div>
            <div className="col-12 mt-4">
              <BalanceProvider asset={data.bondAsset}>
                <DepositCard
                  k={data || undefined}
                  stakingType={stakingType}
                  setStakingType={setStakingType}
                  liquid={stakingType === "liquid"}
                  rewardSymbol={data.revenueAsset.metadata.symbol}
                  swapTargetOptions={swapTargetOptions}
                  poolContext={poolContext}
                />
              </BalanceProvider>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mt-2 gradient-card-container">
          <StakingPoolBalance
            bond={data.bondAsset.metadata.symbol}
            reward={data.revenueAsset.metadata.symbol}
            k={acc || undefined}
            poolContext={poolContext}
            swapTargetOptions={swapTargetOptions}
          />
        </div>
      </div>
      <hr className="hr mt-8 mb-8 opacity-4" />
      <div className="row wrap pad">
        <div className="col-12 col-md-6">
          <Summary
            bond={data.bondAsset.metadata.symbol}
            reward={data.revenueAsset.metadata.symbol}
            contract={data.address}
          />
        </div>
      </div>
    </StakingContainer>
  );
};

const STAKING_TYPE_CARD_CLASS = "card card--hover-shadow p-3 flex dir-c flex-1";

const DepositCard: FC<{
  k: StakePoolPageDepositFragment$key | undefined;
  stakingType: StakingType;
  setStakingType: (t: StakingType) => void;
  liquid: boolean;
  rewardSymbol: string;
  swapTargetOptions: string[];
  poolContext: RewardModeSelectorPoolContext;
}> = ({
  k,
  stakingType,
  setStakingType,
  liquid,
  rewardSymbol,
  swapTargetOptions,
  poolContext,
}) => {
  const { t } = useTranslation("staking");

  const stakingTypeSection = (disabled: boolean) => (
    <div className="mt-3">
      <h4 className="fs-14 fw-500 color-grey mb-2">{t("chooseStakingType")}</h4>
      <div
        className="flex dir-c dir-md-r gap-2 w-full"
        style={disabled ? { opacity: 0.4, pointerEvents: "none" } : undefined}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) =>
            !disabled && e.key === "Enter" && setStakingType("liquid")
          }
          className={clsx(
            STAKING_TYPE_CARD_CLASS,
            "col-12 col-md-6",
            stakingType === "liquid" ? "card--ring-primary" : "card--border"
          )}
          onClick={() => !disabled && setStakingType("liquid")}>
          <span className="fw-500 fs-14">{t("liquidStaking")}</span>
          <span className="fs-14 color-grey mt-0.5">
            {t("liquidStakingDescription")}
          </span>
        </div>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled}
          onKeyDown={(e) =>
            !disabled && e.key === "Enter" && setStakingType("account")
          }
          className={clsx(
            STAKING_TYPE_CARD_CLASS,
            "col-12 col-md-6",
            stakingType === "account" ? "card--ring-primary" : "card--border"
          )}
          onClick={() => !disabled && setStakingType("account")}>
          <span className="fw-500 fs-14">
            {t("accountStaking", { symbol: rewardSymbol })}
          </span>
          <span className="fs-14 color-grey mt-0.5">
            {t("accountStakingDescription", { symbol: rewardSymbol })}
          </span>
        </div>
      </div>
    </div>
  );

  const rewardContent = (canStake: boolean) => (
    <div className="mt-3">
      {stakingTypeSection(!canStake)}
      <p className="fs-14 color-grey mt-3">{t("stakingNoUnbonding")}</p>
    </div>
  );

  return (
    <div className="card h-full p-3">
      <h3 className="fs-16 lh-22 fw-400 color-grey mb-2">{t("deposit")}</h3>
      {k ? (
        <WalletDepositBlock
          k={k}
          liquid={liquid}
          hideTitle
          hideBalance
          childrenBetweenInputAndButton={rewardContent}>
          {(canStake) =>
            liquid ? (
              <div className="mt-1 block ml-a text-right">
                <TxButton
                  className="button"
                  label={t("stake", { symbol: poolContext.stakedTokenSymbol })}
                />
              </div>
            ) : canStake ? (
              <div className="mt-3">
                <RewardModeSelector
                  poolContext={poolContext}
                  swapTargetOptions={swapTargetOptions}
                  accountOnly>
                  <div className="mt-3 block ml-a text-right">
                    <TxButton
                      className="button"
                      label={t("stake", {
                        symbol: poolContext.stakedTokenSymbol,
                      })}
                    />
                  </div>
                </RewardModeSelector>
              </div>
            ) : (
              <div className="mt-1 block ml-a text-right">
                <TxButton
                  className="button"
                  label={t("stake", { symbol: poolContext.stakedTokenSymbol })}
                />
              </div>
            )
          }
        </WalletDepositBlock>
      ) : (
        rewardContent(false)
      )}
    </div>
  );
};

const WalletDepositBlock: FC<{
  k: StakePoolPageDepositFragment$key;
  liquid: boolean;
  hideTitle?: boolean;
  hideBalance?: boolean;
  childrenBetweenInputAndButton?: (canStake: boolean) => React.ReactNode;
  children?: (canStake: boolean) => React.ReactNode;
}> = ({
  k,
  liquid,
  hideTitle,
  hideBalance,
  childrenBetweenInputAndButton,
  children,
}) => {
  const { t } = useTranslation("staking");
  const [amount, setAmount] = useState(0n);
  const data = useFragment(deposit, k);
  const { balance, account } = usePreloadedBalance();
  const walletBalance = balance?.balance ?? 0n;
  const stakeMsg =
    amount && account && amount <= walletBalance
      ? new MsgExec(
          { address: account.address, network: THOR },
          account.asset,
          amount,
          data.address,
          { [liquid ? "liquid" : "account"]: { bond: {} } }
        )
      : null;

  return (
    <>
      {!hideTitle && (
        <h4 className="fs-14 fw-500 color-grey">{t("walletDeposit")}</h4>
      )}
      {!hideBalance && (
        <div className="flex ai-c mt-0.5 fs-14 color-grey">
          <IconDenom
            denom={data.bondAsset.metadata.symbol}
            className="h-2 w-2 mr-1"
          />
          <Decimal
            amount={balance?.balance ?? 0n}
            round={4}
            symbol={data.bondAsset.metadata.symbol}
          />
        </div>
      )}
      <DenomInput
        className="mt-2"
        symbol={data.bondAsset.metadata.symbol}
        amount={amount}
        decimals={8}
        onChangeAmount={setAmount}
        max={balance?.balance || 0n}
        maxLabel={`${t("balance")}:`}
        fiat={{ price: data.bondAsset.price?.current, symbol: "$" }}
      />
      {childrenBetweenInputAndButton?.(!!stakeMsg)}
      <div className="flex dir-c w-full mt-1">
        <MsgProvider msg={stakeMsg}>{children?.(!!stakeMsg)}</MsgProvider>
      </div>
    </>
  );
};

const AnalyticsLink: FC<{ symbol: string }> = ({ symbol }) => {
  const { t } = useTranslation("staking");
  const href = STAKING_ANALYTICS_URLS.get(symbol.toUpperCase());
  if (!href) return null;

  return (
    <div className="text-left mt-a pt-2">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="fs-12 fw-500 color-grey hover-white no-underline iflex ai-c">
        {t("communityDashboardAnalytics")}
        <Icons.External className="w-1.5 h-1.5 ml-0.5" />
      </a>
    </div>
  );
};

const RevenueDetails: FC<{ t: (key: string) => string }> = ({ t }) => (
  <>
    <h4 className="h4 mt-5">{t("revenue")}</h4>
    <p className="mb-1">{t("stakingRevenueDescription")}</p>
    <p>
      <a
        href="https://docs.rujira.network/understanding-ruji-token#utility"
        target="_blank"
        rel="noopener noreferrer"
        className="color-teal">
        {t("moreInfo")}
      </a>
    </p>
  </>
);

const Summary: FC<{ bond: string; reward: string; contract: string }> = ({
  bond,
  reward,
  contract,
}) => {
  const { t } = useTranslation("staking");
  const { toRoot } = useLocale();
  return (
    <>
      <h3 className="h3">{t("strategyDetails")}</h3>
      <h4 className="h4">
        {t("strategyLabel")}: {t("staking")}
      </h4>
      <p className="p">
        {t("stakingIntro", { bond, reward })}{" "}
        {bond === "TCY" && t("serviceFeeCaveat")}
      </p>
      {bond.toUpperCase() === "BRUNE" && (
        <>
          <h4 className="h4 mt-5">{t("getBrune.title")}</h4>
          <p className="p">
            {t("getBrune.descriptionBefore")}{" "}
            <Link to={toRoot("/trade/bRUNE/RUNE")} className="color-teal">
              {t("getBrune.tradeLink")}
            </Link>
            {t("getBrune.descriptionAfter")}
          </p>
        </>
      )}
      <h4 className="h4 mt-5">{t("withdrawals")}</h4>
      <p className="p">{t("stakersWithdrawalInfo")}</p>
      {bond === "RUJI" && <RevenueDetails t={t} />}
      <h4 className="h4 mt-5">{t("contracts")}</h4>

      <p className="p">
        {t("staking")}: <AddressLink address={contract} />
      </p>
      {bond.toUpperCase() === "BRUNE" && (
        <p className="p">
          {t("bruneContract")}: <AddressLink address={BRUNE_CONTRACT} />
        </p>
      )}
    </>
  );
};

const deposit = graphql`
  fragment StakePoolPageDepositFragment on StakingPool {
    address
    bondAsset {
      metadata {
        symbol
      }
      price {
        current
      }
    }
  }
`;
