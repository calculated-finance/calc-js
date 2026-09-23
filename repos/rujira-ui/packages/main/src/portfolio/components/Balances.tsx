import clsx from "clsx";
import {
  createContext,
  FC,
  Fragment,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { Tooltip } from "react-tooltip";
import { fetchQuery, graphql, useRelayEnvironment } from "react-relay";
import { Balance, GAIA, networkLabel, priceFormatter, THOR } from "rujira.js";
import {
  AssetLabel,
  Button,
  Decimal,
  Fiat,
  IconDenom,
  Icons,
  NetworkIcon,
  nFormatter,
  Popout,
  ProviderIcon,
  sortByValueUsd,
  TranslationProvider,
  useGlobalModalContext,
  useLocalStorage,
  useTranslation,
  Warning,
} from "rujira.ui";
import exclamation from "rujira.ui/assets/images/exclamation.gif";

import Anim from "../../common/assets/cosmos.svg";
import Animation from "../../common/assets/portfolio.gif";
import { BalanceContextFragment$data } from "../../common/components/__generated__/BalanceContextFragment.graphql";
import {
  BalanceProvider,
  usePreloadedBalance,
  usePreloadedBalanceData,
} from "../../common/components/Balance";
import { useDeposit } from "../../common/components/Deposit";
import { Link } from "../../Gate";
import { lendRoute } from "../../lending/routes";
import { useAccounts } from "../../services/accounts";
import { isSunsetSymbol } from "../../services/asset";
import {
  assetToLendUrlSegment,
  assetToTradeUrlSegment,
} from "../../services/assetUrl";
import { stakeRoute } from "../../staking/routes";
import { usePortfolio } from "../Portfolio";
import { BalancesTokenActionsQuery } from "./__generated__/BalancesTokenActionsQuery.graphql";
import { Send } from "./actions/Send";
import { Withdraw } from "./actions/Withdraw";
const { Chart, Lend, Merge, MoneyTransfer, Stake, Swap, TrendDown, TrendUp } =
  Icons;

type Success = Extract<
  BalanceContextFragment$data["balancesV2"],
  { ok: true }
>["value"];

type Failure = Extract<
  BalanceContextFragment$data["balancesV2"],
  { ok: false }
>["errors"];

const tokenActionsQuery = graphql`
  query BalancesTokenActionsQuery {
    ghostCredit {
      collaterals {
        asset {
          chain
          metadata {
            symbol
          }
        }
      }
    }
    thorchainV2 {
      pools {
        status
        asset {
          metadata {
            symbol
          }
          variants {
            secured {
              metadata {
                symbol
              }
            }
          }
        }
      }
    }
    finV2(first: 100, sortBy: VOLUME_USD, sortDir: DESC) {
      edges {
        node {
          assetBase {
            chain
            type
            metadata {
              symbol
            }
          }
          assetQuote {
            chain
            type
            metadata {
              symbol
            }
          }
        }
      }
    }
    strategies(first: 100, typenames: ["GhostVault"]) {
      edges {
        node {
          __typename
          ... on GhostVault {
            asset {
              asset
              chain
              type
              metadata {
                symbol
              }
            }
          }
        }
      }
    }
  }
`;

type TokenActionRoutes = {
  borrowPath: string | null;
  lendPath: string | null;
  stakePath: string | null;
  swapPath: string | null;
  tradePath: string | null;
};

type TokenActionData = {
  borrowSymbols: Set<string>;
  lendPaths: Map<string, string>;
  swapSymbols: Set<string>;
  tradePaths: Map<string, string>;
};

const EMPTY_TOKEN_ACTION_DATA: TokenActionData = {
  borrowSymbols: new Set(),
  lendPaths: new Map(),
  swapSymbols: new Set(),
  tradePaths: new Map(),
};

const tokenActionDataContext = createContext<TokenActionData>(
  EMPTY_TOKEN_ACTION_DATA
);

export const Balances: FC = () => {
  const data = usePreloadedBalanceData();

  return data ? (
    data.ok ? (
      data.value.edges?.length === 0 ? (
        <div className="relative card p-3 mt-2">
          <Empty />
        </div>
      ) : (
        <List data={data.value} />
      )
    ) : (
      <div className="relative card p-3 mt-2">
        <Failure errors={data.errors} />
      </div>
    )
  ) : (
    <Loading />
  );
};

const List: FC<{
  data: Success;
}> = ({ data }) => {
  const { hideSmall } = usePortfolio();
  const { t } = useTranslation("portfolio");

  const isLowRune = data.edges?.some(
    (x) =>
      x?.node &&
      x?.node.asset.metadata.symbol === "RUNE" &&
      x.node.balance < 2000000n
  );

  const filtered =
    data.edges?.filter(
      (x) =>
        x?.node &&
        !isSunsetSymbol(x.node.asset.metadata.symbol) &&
        (!hideSmall || x.node.valueUsd > 100000000n)
    ) || [];

  return filtered.length ? (
    <>
      <TokenActionRoutesProvider>
        <div className="relative card p-3 mt-2">
          {isLowRune && <LowRuneNotice network={GAIA} symbol="ATOM" />}
          <div className="table-sticky table-sticky--first">
            <table className="table table--big condensed portfolio__balances">
              <thead>
                <tr>
                  <th className="w-1 bg-black"></th>
                  <th style={{ paddingLeft: 0 }}>{t("token")}</th>
                  <th>{t("networks")}</th>
                  <th className="text-right">{t("common:balance")}</th>
                  <th className="text-right">{t("price")}</th>
                  <th className="text-right">{t("change24h")}</th>
                  <th className="text-right">{t("value")}</th>
                  <th className="w-1">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                <BalanceProvider
                  asset={{
                    type: "LAYER_1",
                    chain: "BTC",
                    asset: "BTC.BTC",
                    metadata: {
                      symbol: "BTC",
                      decimals: 8,
                    },
                  }}>
                  <KeplrBtcWarning />
                </BalanceProvider>
                {sortByValueUsd(
                  filtered.flatMap((entry) =>
                    entry?.node
                      ? [
                          {
                            entry: entry.node,
                            valueUsd: entry.node.valueUsd || 0n,
                          },
                        ]
                      : []
                  )
                ).map(({ entry }) => {
                  return (
                    <BalanceProvider asset={entry.asset}>
                      <BalanceItem key={entry.id} />
                    </BalanceProvider>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </TokenActionRoutesProvider>
    </>
  ) : (
    <div className="relative card p-3 mt-2">
      <Empty isLowRune={isLowRune} />
    </div>
  );
};

const Failure: FC<{ errors: Failure }> = ({ errors }) => {
  return (
    <>
      {errors.map((e, idx) =>
        e &&
        typeof e === "object" &&
        "status" in e &&
        typeof e.status === "string" ? (
          <Warning key={idx} color="red" className="condensed mt-2">
            <Icons.ExclamationTriangle className="color-red" />
            <span className="warning__msg">{e.status}</span>
          </Warning>
        ) : null
      )}
    </>
  );
};

const Empty: FC<{ isLowRune?: boolean }> = ({ isLowRune = true }) => {
  const { t } = useTranslation("portfolio");
  return (
    <>
      {isLowRune && <LowRuneNotice network={GAIA} symbol="ATOM" />}
      <img
        src={Animation}
        alt="No balances"
        className="block w-10 h-10 mx-a mb-1 filter-grey"
      />
      <p className="color-grey fw-500 text-center">
        {t("noAvailableBalances")}
      </p>
      <p className="flex jc-c ai-c gap-x-1 mt-2 color-grey">
        <Button
          onClick={() => document.getElementById("deposit")?.click()}
          className="button--sm button--icon-right button--outline"
          label={t("depositNow")}>
          <Icons.ArrowUpRight />
        </Button>
      </p>
    </>
  );
};

const KeplrBtcWarning = () => {
  const { t } = useTranslation("portfolio");
  const [infoMsgDismissals, setInfoMsgDismissals] = useLocalStorage<string[]>(
    "keplr-btc-info-dismissals",
    []
  );

  const { selected } = useAccounts();
  const { balance } = usePreloadedBalance();
  if (!!balance?.balance) return null;
  if (selected?.provider !== "Keplr") return null;
  if (infoMsgDismissals?.some((s) => s === selected.address.address))
    return null;

  return (
    <tr>
      <td colSpan={8}>
        <div className="flex jc-c pt-1.5">
          <Warning
            className="warning--sm mb-2 condensed flex jc-c"
            color="orange">
            <div className="flex ai-c">
              <img
                src={exclamation}
                className="filter-orange block no-shrink"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
              <p className="text-left ml-1 lh-19 fs-14">
                {t("keplrBtcWarning")}
              </p>
            </div>
            <Button
              className={"button--orange button--outline button--xs ml-2"}
              onClick={() => {
                if (selected?.address) {
                  setInfoMsgDismissals([
                    ...infoMsgDismissals,
                    selected.address.address,
                  ]);
                }
              }}
              label={t("common:dismiss")}
            />
          </Warning>
        </div>
      </td>
    </tr>
  );
};

export const LowRuneNotice: FC<{
  network: string;
  symbol: string;
  msg?: string;
}> = ({ network, symbol, msg }) => {
  const { t } = useTranslation("portfolio");
  return (
    <Link to={`../swap/${network}.${symbol}/THOR.RUNE`} className="mb-3 block">
      <Warning
        msg={msg || t("lowRuneWarning")}
        className="fs-12 lh-18 fw-600 color-white warning--pre hover-teal">
        <Icons.NoGas className="color-teal w-1 h-1" />
      </Warning>
    </Link>
  );
};

const Loading: FC = () => {
  return (
    <div className="mt-4 text-center">
      <img src={Anim} alt="" className="block w-12 h-12 mx-a mb-2" />
    </div>
  );
};

const BalanceItem: FC = () => {
  const { t } = useTranslation("portfolio");
  const { balance, asset } = usePreloadedBalance();
  const { accounts } = useAccounts();
  const tooltipId = useId();

  const providerLookup = useMemo(
    () =>
      new Map(
        accounts?.map(({ address, provider }) => [address.address, provider])
      ),
    [accounts]
  );

  const sorted = [...(balance?.accounts || [])].sort((a, b) => {
    if (a.asset.chain === THOR || a.asset.type === "SECURED") return -1;
    if (b.asset.chain === THOR || b.asset.type === "SECURED") return 1;
    return networkLabel(a.asset.chain).localeCompare(
      networkLabel(b.asset.chain)
    );
  });

  const deposit = useDeposit(0n, balance?.asset);

  if (!balance) return null;
  const price = asset.price;

  return (
    <tr>
      <th className="bg-black">
        <IconDenom denom={balance.asset.metadata.symbol} />
      </th>
      <td style={{ paddingLeft: 0 }} className="portfolio__token">
        <div className="flex ai-c no-shrink">
          <h3 className="flex ai-b">
            <AssetLabel
              asset={balance.asset}
              Container={({ children }) => (
                <span className="color-grey fs-14 fs-lg-16">{children}</span>
              )}
            />
          </h3>
          {isMerge(balance.asset.metadata.symbol) && (
            <Link
              to={`../merge/${balance.asset.metadata.symbol}`}
              className="tag tag--md tag--teal mx-1.5">
              {t("mergeTag")}
              <Icons.AngleRight />
            </Link>
          )}
          {isSwitch(balance.asset.metadata.symbol) && (
            <button
              onClick={deposit}
              className="tag tag--md tag--orange mx-1.5">
              {t("migrateTag")}
              <Icons.AngleRight />
            </button>
          )}
        </div>
      </td>
      <td>
        <div className="nowrap flex gap-0.5">
          {sorted.map((x) => {
            const provider = providerLookup.get(x.address);
            const tipId = `${tooltipId}-${x.asset.asset}`;
            return (
              <Fragment key={x.asset.asset}>
                <div data-tooltip-id={tipId}>
                  <NetworkIcon
                    className="w-2.5 h-2.5"
                    network={x.asset.type === "SECURED" ? THOR : x.asset.chain}
                  />
                </div>
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
                        {nFormatter(x.balance, 8, 8)} on {networkLabel(x.asset)}
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </Fragment>
            );
          })}
        </div>
      </td>
      <td className="text-right">
        <Decimal amount={balance.balance} round={6} />
      </td>
      <td className="text-right">
        {price?.current ? <>${priceFormatter(price.current)}</> : null}
      </td>
      <td className="text-right">
        <div
          className={clsx({
            "flex ai-c jc-e": true,
            "color-teal": price?.changeDay && price.changeDay > 0,
            "color-red": price?.changeDay && price.changeDay < 0,
          })}>
          {price?.changeDay ? (
            <>
              {price.changeDay.toLocaleDecimal(2)}%
              {price.changeDay > 0 ? (
                <TrendUp className="h-2 w-a ml-0.5" />
              ) : (
                <TrendDown className="h-2 w-a ml-0.5" />
              )}
            </>
          ) : null}
        </div>
      </td>

      <td className="text-right">
        <Fiat
          amount={balance.valueUsd}
          decimals={8}
          symbol="$"
          padSymbol={false}
        />
      </td>
      <td className="text-right">
        <Popout buttonClassName="button--outline button--grey mr-0.5">
          <TokenActions balance={balance} />
        </Popout>
      </td>
    </tr>
  );
};

const TokenActions: FC<{ balance: Balance }> = ({ balance }) => {
  const { t } = useTranslation("portfolio");
  const { showModal, hideModal } = useGlobalModalContext();

  const withdraw = () => {
    showModal({
      className: "modal--lg",
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="portfolio">
          <BalanceProvider asset={balance.asset}>
            <Withdraw cancel={hideModal} />
          </BalanceProvider>
        </TranslationProvider>
      ),
    });
  };

  const deposit = useDeposit(0n, balance.asset);

  const send = () => {
    showModal({
      backgroundClose: false,
      children: (
        <TranslationProvider namespace="portfolio">
          <BalanceProvider asset={balance.asset}>
            <Send cancel={hideModal} />
          </BalanceProvider>
        </TranslationProvider>
      ),
    });
  };

  const { borrowPath, lendPath, stakePath, swapPath, tradePath } =
    useTokenActionRoutes(balance.asset);

  const canWithdraw = !!balance.accounts.find(
    (a) => a.asset.type === "SECURED"
  );
  const canDeposit = !!balance.accounts.find((a) => a.asset.type === "LAYER_1");

  return (
    <nav>
      {canDeposit && (
        <button onClick={deposit}>
          <Icons.Deposit />
          {t("common:deposit")}
        </button>
      )}

      {canWithdraw && (
        <button onClick={withdraw}>
          <Icons.Withdraw />
          {t("common:withdraw")}
        </button>
      )}

      <button onClick={send}>
        <MoneyTransfer />
        {t("common:send")}
      </button>
      {tradePath && (
        <Link to={tradePath}>
          <Chart />
          {t("trade")}
        </Link>
      )}
      {swapPath && (
        <Link to={swapPath}>
          <Swap />
          {t("swap")}
        </Link>
      )}
      {stakePath && (
        <Link to={stakePath}>
          <Stake />
          {t("stake")}
        </Link>
      )}
      {lendPath && (
        <Link to={lendPath}>
          <Lend />
          {t("lend")}
        </Link>
      )}
      {borrowPath && (
        <Link to={borrowPath}>
          <MoneyTransfer />
          {t("borrow")}
        </Link>
      )}
      {isMerge(balance.asset.metadata.symbol) && (
        <Link to={`../merge/${balance.asset.metadata.symbol}`}>
          <Merge />
          {t("merge")}
        </Link>
      )}
    </nav>
  );
};
const isMerge = (symbol: string) => {
  return [
    "KUJI",
    "rKUJI",
    "RKUJI",
    "FUZN",
    "WINK",
    "NSTK",
    "LVN",
  ].includes(symbol);
};

const isSwitch = (_symbol: string) => {
  return false;
};

const getStakePath = (symbol: string) => {
  switch (symbol) {
    case "RUJI":
      return stakeRoute("RUJI");
    case "RUNE":
    case "bRUNE":
      return stakeRoute("bRUNE");
    case "TCY":
      return stakeRoute("TCY");
    default:
      return null;
  }
};

const TokenActionRoutesProvider: FC<PropsWithChildren> = ({ children }) => {
  const env = useRelayEnvironment();
  const [data, setData] = useState<TokenActionData>(EMPTY_TOKEN_ACTION_DATA);

  useEffect(() => {
    let cancelled = false;

    fetchQuery<BalancesTokenActionsQuery>(env, tokenActionsQuery, {})
      .toPromise()
      .then((data) => {
        if (!cancelled && data) setData(createTokenActionData(data));
      })
      .catch((error) => {
        console.error("Failed to load portfolio token actions", error);
      });

    return () => {
      cancelled = true;
    };
  }, [env]);

  return (
    <tokenActionDataContext.Provider value={data}>
      {children}
    </tokenActionDataContext.Provider>
  );
};

type TokenActionAsset = {
  readonly chain: string;
  readonly metadata: {
    readonly symbol: string;
  };
};

const getDefaultBorrowDebtSegment = (asset: TokenActionAsset) => {
  const symbol = asset.metadata.symbol.toUpperCase();

  if (symbol === "USDC" || symbol === "USDT") return "BTC";

  return "USDC";
};

const getBorrowPath = (asset: TokenActionAsset) => {
  const collateralSegment = assetToTradeUrlSegment(asset);
  const debtSegment = getDefaultBorrowDebtSegment(asset);

  return `/borrow/${collateralSegment}/${debtSegment}`;
};

const useTokenActionRoutes = (
  asset: TokenActionAsset | null | undefined
): TokenActionRoutes => {
  const { borrowSymbols, lendPaths, swapSymbols, tradePaths } = useContext(
    tokenActionDataContext
  );

  if (!asset) {
    return {
      borrowPath: null,
      lendPath: null,
      stakePath: null,
      swapPath: null,
      tradePath: null,
    };
  }

  const symbol = asset.metadata.symbol;

  return {
    borrowPath: borrowSymbols.has(`${symbol}.${asset.chain}`)
      ? getBorrowPath(asset)
      : null,
    lendPath: lendPaths.get(assetToLendUrlSegment(asset)) ?? null,
    stakePath: getStakePath(symbol),
    swapPath: getSwapPath(symbol, swapSymbols),
    tradePath: tradePaths.get(assetToTradeUrlSegment(asset)) ?? null,
  };
};

const createTokenActionData = (
  data: BalancesTokenActionsQuery["response"]
): TokenActionData => {
  const borrowSymbols = new Set(
    data.ghostCredit?.collaterals.map(
      ({ asset }) => `${asset.metadata.symbol}.${asset.chain}`
    ) || []
  );
  const swapSymbols = getSwapSymbols(data);

  const tradePairs =
    data.finV2.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) || [];

  const tradePaths = buildTradePaths(tradePairs);
  const lendPaths = buildLendPaths(data);

  return { borrowSymbols, lendPaths, swapSymbols, tradePaths };
};

const buildLendPaths = (
  data: BalancesTokenActionsQuery["response"]
): Map<string, string> => {
  const map = new Map<string, string>();

  data.strategies.edges?.forEach((edge) => {
    if (edge?.node?.__typename !== "GhostVault") return;
    map.set(assetToLendUrlSegment(edge.node.asset), lendRoute(edge.node.asset));
  });

  return map;
};

const getSwapSymbols = (data: BalancesTokenActionsQuery["response"]) => {
  const symbols = new Set<string>(["RUNE"]);

  data.thorchainV2?.pools.forEach(({ asset, status }) => {
    if (status !== "AVAILABLE") return;
    symbols.add(asset.metadata.symbol);
    if (asset.variants.secured) {
      symbols.add(asset.variants.secured.metadata.symbol);
    }
  });

  return symbols;
};

const getSwapPath = (symbol: string, symbols: Set<string>) => {
  if (!symbols.has(symbol)) return null;

  const target =
    ["BTC", "ETH", "USDC", "RUNE"].find(
      (candidate) => candidate !== symbol && symbols.has(candidate)
    ) || [...symbols].find((candidate) => candidate !== symbol);

  return target ? `/swap/${symbol}/${target}` : null;
};

const buildTradePaths = (pairs: TokenActionPair[]): Map<string, string> => {
  const assetIds = new Set<string>();
  pairs.forEach((pair) => {
    assetIds.add(assetToTradeUrlSegment(pair.assetBase));
    assetIds.add(assetToTradeUrlSegment(pair.assetQuote));
  });

  const map = new Map<string, string>();
  assetIds.forEach((assetId) => {
    const pair = getPreferredTradePair(assetId, pairs);
    if (pair) {
      map.set(
        assetId,
        `/trade/${assetToTradeUrlSegment(pair.assetBase)}/${assetToTradeUrlSegment(pair.assetQuote)}`
      );
    }
  });

  return map;
};

type TokenActionPair = NonNullable<
  NonNullable<
    NonNullable<BalancesTokenActionsQuery["response"]["finV2"]["edges"]>[number]
  >["node"]
>;

const getPreferredTradePair = (assetId: string, pairs: TokenActionPair[]) => {
  const candidates = pairs.filter((pair) => {
    const { base, quote } = getTradePairAssetIds(pair);

    return base === assetId || quote === assetId;
  });

  if (["USDC", "USDT"].includes(assetId.split(".")[0])) {
    return (
      findTradePair(pairs, "BTC", assetId) ||
      candidates.find((pair) => getTradePairAssetIds(pair).quote === assetId) ||
      candidates[0]
    );
  }

  return (
    findTradePair(pairs, assetId, "USDC") ||
    findTradePair(pairs, assetId, "USDT") ||
    candidates[0]
  );
};

const findTradePair = (
  pairs: TokenActionPair[],
  baseId: string,
  quoteId: string
) =>
  pairs.find((pair) => {
    const ids = getTradePairAssetIds(pair);

    return ids.base === baseId && ids.quote === quoteId;
  });

const getTradePairAssetIds = (pair: TokenActionPair) => ({
  base: assetToTradeUrlSegment(pair.assetBase),
  quote: assetToTradeUrlSegment(pair.assetQuote),
});
