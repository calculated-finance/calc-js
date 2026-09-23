import { FC } from "react";
import { useFragment } from "react-relay";
import { Link, useNavigate } from "react-router-dom";
import { graphql } from "relay-runtime";
import {
  Button,
  Decimal,
  AssetLabel,
  formatApr,
  IconDenom,
  useLocale,
  useTranslation,
} from "rujira.ui";
import { lendRoute } from "../../lending/routes";
import { GhostVaultThumbFragment$key } from "./__generated__/GhostVaultThumbFragment.graphql";

const fragment = graphql`
  fragment GhostVaultThumbFragment on GhostVaultAccount {
    id
    account
    vault {
      status {
        apr {
          status
          value
        }
      }
      asset {
        asset
        chain
        type
        metadata {
          symbol
        }
      }
    }
    valueUsd
    receiptValue: value {
      amount
      asset {
        price {
          current
        }
        metadata {
          symbol
        }
      }
    }
  }
`;

export const GhostVaultThumb: FC<{ k: GhostVaultThumbFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const data = useFragment(fragment, k);
  const url = toRoot(lendRoute(data.vault.asset));

  return (
    <div className="relative card p-3">
      <div className="flex ai-c mt-0.5">
        <div className="lp">
          <IconDenom denom={data.vault.asset.metadata.symbol || ""} />
        </div>
        <h3 className="condensed fs-24 fw-400 mb-0 ml-1">
          <AssetLabel
            asset={data.vault.asset}
            Container={({ children }) => (
              <span className="color-grey">{children}</span>
            )}
          />{" "}
        </h3>
        <div className="tag tag--teal ml-a mr-0">{t("lending")}</div>
      </div>
      <div className="row wrap pad--mini mt-2">
        <div className="col-4">
          <h4 className="fs-16 lh-22 fw-400 color-grey mb-0">{t("value")}</h4>

          <Decimal
            symbol="$"
            symbolLeft
            amount={BigInt(data.valueUsd)}
            round={2}
            className="fs-24 condensed"
          />
        </div>
      </div>
      <Button
        as={Link}
        to={url}
        className="button--small button--outline mt-2 w-full"
        label="Manage Position"
      />
    </div>
  );
};

export const GhostVaultRow: FC<{ k: GhostVaultThumbFragment$key }> = ({
  k,
}) => {
  const { t } = useTranslation("strategies");
  const { toRoot } = useLocale();
  const data = useFragment(fragment, k);
  const url = toRoot(lendRoute(data.vault.asset));
  const navigate = useNavigate();

  return (
    <tr onClick={() => navigate(url)} className="pointer">
      <td className="flex ai-c mt-0.5 pointer">
        <IconDenom
          denom={data.vault.asset.metadata.symbol || ""}
          className="w-3.5 mx-0.5"
        />
      </td>
      <td style={{ paddingLeft: "0" }}>
        <AssetLabel
          asset={data.vault.asset}
          Container={({ children }) => (
            <span className="color-grey">{children}</span>
          )}
        />{" "}
      </td>
      <td>
        <div className="tag tag--teal ml-a mr-0">{t("lending")}</div>
      </td>
      <td>
        <Decimal
          key={data.receiptValue.asset.metadata.symbol}
          symbol={data.receiptValue.asset.metadata.symbol}
          amount={BigInt(data.receiptValue.amount)}
          round={4}
          symbolClassName="decimal__symbol--small color-grey condensed fw-500 mr-1"
        />
      </td>
      <td className="text-right">{formatApr(data.vault.status.apr)}</td>
      <td className="text-right">
        <Decimal
          symbol="$"
          symbolLeft
          amount={BigInt(data.valueUsd)}
          decimals={8}
          round={2}
        />
      </td>
    </tr>
  );
};
