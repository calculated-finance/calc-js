import { FC, useRef, useState } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useParams } from "react-router-dom";
import { graphql } from "relay-runtime";
import { useTranslation } from "rujira.ui";
import { Drawer } from "vaul";
import { NoIndexHelmet } from "../seo";
import { TorChartQuery } from "./__generated__/TorChartQuery.graphql";
import { Header } from "./components/Header";
import { Markets } from "./components/Markets";
import { TradingView } from "./components/TradingView";

const query = graphql`
  query TorChartQuery {
    thorchainV2 {
      pools {
        asset {
          asset
        }
        ...HeaderTorFragment
      }
    }
  }
`;

export const TorChart: FC = () => {
  const { t } = useTranslation("common");
  const [showDrawer, setShowDrawer] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const data = useLazyLoadQuery<TorChartQuery>(query, {})?.thorchainV2;
  const { asset } = useParams<{ asset: string }>();
  const pool = data?.pools.find((a) => a.asset.asset === asset);

  return (
    <div className="rujira__main rujira__main--gradient trade">
      <NoIndexHelmet>
        <title>Rujira Trade</title>
        <meta name="description" content="Rujira Trade" />
        <meta name="og:description" content="Rujira Trade" />
        <meta name="twitter:description" content="Rujira Trade" />
      </NoIndexHelmet>
      <Drawer.Root
        direction="left"
        open={showDrawer}
        onOpenChange={(open) => setShowDrawer(open)}>
        <Header k={pool || undefined} openDrawer={() => setShowDrawer(true)} />
        <Drawer.Portal>
          <Drawer.Overlay className="drawer__overlay" />
          <Drawer.Content className="drawer__content drawer__content--left">
            <Drawer.Title className="visually-hidden">
              {t("markets")}
            </Drawer.Title>
            <Markets closeDrawer={() => setShowDrawer(false)} />
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      <div className="trade__main flex grow" ref={ref}>
        {asset && <TradingView asset={asset} />}
      </div>
    </div>
  );
};
