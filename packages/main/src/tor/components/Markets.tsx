import { FC, Suspense } from "react";
import { useFragment, useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import { assetPairFilter } from "rujira.js";
import {
  AssetLabel,
  Decimal,
  useTranslation,
  IconDenom,
  Input,
  useQueryParam,
} from "rujira.ui";

import { MarketsTorItemFragment$key } from "./__generated__/MarketsTorItemFragment.graphql";
import { MarketsTorQuery } from "./__generated__/MarketsTorQuery.graphql";
import { Icons } from "rujira.ui";

const q = graphql`
  query MarketsTorQuery {
    thorchainV2 {
      pools {
        asset {
          asset
          metadata {
            symbol
          }
        }
        ...MarketsTorItemFragment
      }
    }
  }
`;

export const Markets = ({ closeDrawer }: { closeDrawer: () => void }) => {
  const [query, setQuery] = useQueryParam<string>("q", "");

  return (
    <div className="drawer__card trade__markets">
      <Input
        label="Search"
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}>
        {query !== "" && (
          <Icons.MinusCircle
            className="input-container__clear"
            onClick={() => {
              setQuery("");
            }}
          />
        )}
      </Input>
      <div className="trade__markets-overflow mt-3">
        <table className="table table--spaced table--va-m">
          <thead className="border">
            <tr>
              <th>Asset</th>
              <th className="text-right">Last Price</th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<Fallback />}>
              <Content closeDrawer={closeDrawer} query={query} />
            </Suspense>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Content: FC<{
  closeDrawer: () => void;
  query?: string;
}> = ({ closeDrawer, query }) => {
  const { t } = useTranslation("common");
  const data = useLazyLoadQuery<MarketsTorQuery>(
    q,
    {},
    { fetchPolicy: "store-and-network" }
  );

  if (
    data.thorchainV2?.pools.filter((x) =>
      assetPairFilter(query)({ assetBase: x.asset, assetQuote: x.asset })
    ).length === 0
  ) {
    return (
      <tr>
        <td colSpan={2} className="text-center color-grey">
          <br />
          {t("noResultsFound")}
        </td>
      </tr>
    );
  }

  return data.thorchainV2?.pools
    .filter((x) =>
      assetPairFilter(query)({ assetBase: x.asset, assetQuote: x.asset })
    )
    .sort((a, b) =>
      a.asset.metadata.symbol.localeCompare(b.asset.metadata.symbol)
    )
    .map((x) => <Item key={x.asset.asset} k={x} closeDrawer={closeDrawer} />);
};

const fragment = graphql`
  fragment MarketsTorItemFragment on ThorchainPool {
    id
    asset {
      asset
      type
      chain
      metadata {
        symbol
        decimals
      }
    }
    assetTorPrice
  }
`;

const Item: FC<{
  k: MarketsTorItemFragment$key;
  closeDrawer: () => void;
}> = ({ k, closeDrawer }) => {
  const navigate = useNavigate();
  const x = useFragment(fragment, k);

  return (
    <tr
      onClick={() => {
        navigate(`../${x.asset.asset}/TOR`, { relative: "path" });
        closeDrawer();
      }}>
      <td>
        <div className="flex ai-c">
          <div className="pair mr-0.5">
            <IconDenom className="w-2" denom={x.asset.metadata.symbol} />
          </div>
          <div className="flex ai-b">
            <AssetLabel
              asset={x.asset}
              Container={({ children }) => (
                <span className="color-grey fs-11 fw-500">{children}</span>
              )}
            />
          </div>
        </div>
      </td>
      <td className="text-right">
        <Decimal
          amount={BigInt(x?.assetTorPrice || 0)}
          decimals={12}
          round={4}
        />
      </td>
    </tr>
  );
};

const Fallback = () => (
  <>
    {[...Array(10)].map((_, i) => (
      <tr key={`skeleton_${i}`}>
        <td className="nopad w-1"></td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="flex ai-c">
            <div className="pair mr-0.5">
              <div className="icon-denom skeleton h-2 w-2 br-2" />
              <div className="icon-denom skeleton h-2 w-2 br-2" />
            </div>
            <div className="w-full skeleton h-1.5 w-1.5 br-2" />
          </div>
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
        <td className={`opacity-${20 - i * 2}`}>
          <div className="w-full skeleton h-1.5 w-1.5 br-2" />
        </td>
      </tr>
    ))}
  </>
);
