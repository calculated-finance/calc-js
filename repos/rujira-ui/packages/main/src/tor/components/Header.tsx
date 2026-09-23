import { FC } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import {
  AssetLabel,
  Decimal,
  IconDenom,
  Icons,
  nFormatter,
  useWindowSize,
} from "rujira.ui";
import { HeaderTorFragment$key } from "./__generated__/HeaderTorFragment.graphql";
const { AngleDown } = Icons;

const fragment = graphql`
  fragment HeaderTorFragment on ThorchainPool {
    assetTorPrice
    asset {
      chain
      type
      metadata {
        symbol
      }
      price {
        mcap
      }
    }
  }
`;

export const Header: FC<{
  k?: HeaderTorFragment$key;
  openDrawer: () => void;
}> = ({ k, openDrawer }) => {
  const data = useFragment(fragment, k);

  const { width } = useWindowSize();
  const min = 470;

  const decimals = 4; // get from base denom

  return (
    <div className="trade__header">
      <button
        className="trade__header-pair"
        onClick={() => {
          openDrawer();
        }}>
        <IconDenom
          denom={data?.asset.metadata.symbol || ""}
          className="denom"
        />
        {data?.asset ? (
          <h1>
            <AssetLabel
              asset={data?.asset || ""}
              Container={({ children }) => (
                <small className="color-grey">{children}</small>
              )}
            />{" "}
            <span>/</span> TOR{" "}
          </h1>
        ) : null}
        <AngleDown />
      </button>
      <div className="trade__header-price">
        <Decimal
          amount={BigInt(data?.assetTorPrice || 0)}
          decimals={12}
          round={width < min ? 4 : decimals}
          as="h2"
        />
      </div>

      {data?.asset.price?.mcap ? (
        <div className="trade__header-stat">
          <h4>Market Cap</h4>
          <div>
            $
            {nFormatter(
              BigInt(data?.asset.price?.mcap || 0),
              width < min ? 2 : 3,
              0
            )}
          </div>
        </div>
      ) : null}
      <div className="break"></div>
    </div>
  );
};
