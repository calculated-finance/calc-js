import { FC, PropsWithChildren } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useQueryParam, useTranslation, useWindowDimensions } from "rujira.ui";
import { Drawer } from "vaul";
import { BalanceProvider } from "../../common/components/Balance";
import { Subscription } from "../../services/useNodeSubscription";
import { TradeBreakpoint } from "../Trade";
import { Side } from "../types";
import { Classic, LaunchModal } from "./Submit/Classic";
import { SubmitFragment$key } from "./__generated__/SubmitFragment.graphql";

const fragment = graphql`
  fragment SubmitFragment on FinPair {
    assetBase {
      chain
      asset
      type
      metadata {
        symbol
        decimals
      }
    }
    assetQuote {
      chain
      asset
      type
      metadata {
        symbol
        decimals
      }
    }
    oracleBase {
      id
    }
    oracleQuote {
      id
    }
    ...ClassicSubmitFragment
  }
`;

const subscription = graphql`
  subscription SubmitSubscription($id: ID!) {
    node(id: $id) {
      ... on ThorchainOracle {
        price
      }
    }
  }
`;

export const Submit: FC<{ k: SubmitFragment$key }> = ({ k }) => {
  const isMobile = useWindowDimensions(TradeBreakpoint);
  const [side, setSide] = useQueryParam<Side>("side", Side.Quote);
  const q = useFragment(fragment, k);

  return (
    <BalanceProvider asset={side === Side.Base ? q.assetBase : q.assetQuote}>
      <div className="trade__submit-wrapper">
        {q.oracleBase && (
          <Subscription subscription={subscription} id={q.oracleBase.id} />
        )}
        {q.oracleQuote && (
          <Subscription subscription={subscription} id={q.oracleQuote.id} />
        )}

        {!isMobile ? (
          <Container
            side={side}
            setSide={setSide}
            className="trade__submit flex dir-c gap-y-2 py-4">
            <Classic k={q} side={side} />
          </Container>
        ) : (
          <LaunchModal k={q} onClick={setSide} />
        )}

        <Drawer.Portal>
          <Drawer.Overlay className="drawer__overlay" />
          <Drawer.Content className="drawer__content drawer__content--bottom">
            <Drawer.Description className="visually-hidden">
              Submit form for trading
            </Drawer.Description>
            <Container
              side={side}
              setSide={setSide}
              className="trade__submit flex dir-c gap-y-2 overflow-y-auto">
              <Classic k={q || undefined} side={side} />
            </Container>
          </Drawer.Content>
        </Drawer.Portal>
      </div>
    </BalanceProvider>
  );
};

const Container: FC<
  PropsWithChildren<{
    side: Side;
    setSide: (v: Side) => void;
    className?: string;
  }>
> = ({ children, side, setSide, className }) => {
  const { t } = useTranslation();
  return (
    <div className={className || ""} style={{ maxHeight: "100vh" }}>
      <div className="flex ai-c">
        <div
          className={`grow trade__submit-switch trade__submit-switch--${side}`}>
          <button onClick={() => setSide(Side.Quote)}>{t("buy")}</button>
          <button onClick={() => setSide(Side.Base)}>{t("sell")}</button>
        </div>
      </div>
      {children}
    </div>
  );
};
