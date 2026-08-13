import clsx from "clsx";
import { FC, Suspense, useState } from "react";
import { Icons, Toggle, useQueryParam, useTranslation } from "rujira.ui";
import { ContextWrapper } from "../../ContextWrapper";
import { AutoClaimerStatusMenu } from "./AutoClaimerStatusMenu";
import { Tab, useOrdersContext } from "./Orders/Context";
import {
  Content as LimitContent,
  Context as LimitContext,
  Table as LimitTable,
  TableFallback as LimitTableFallback,
  Tabs as LimitTabs,
  useLimitOrdersData,
} from "./Orders/Limit";
import {
  Content as RangeContent,
  Context as RangeContext,
  Table as RangeTable,
  Tabs as RangeTabs,
  useRangeOrdersData,
} from "./Orders/Range";
import {
  Content as RecurringContent,
  Context as RecurringContext,
  Table as RecurringTable,
  Tabs as RecurringTabs,
  useRecurringOrdersData,
} from "./Orders/Recurring";

export const Orders: FC = () => {
  return (
    <ContextWrapper contexts={[LimitContext, RecurringContext, RangeContext]}>
      <Suspense fallback={<OrdersFallback />}>
        <OrdersInner />
      </Suspense>
    </ContextWrapper>
  );
};

const TABS = [Tab.Limit, Tab.Recurring, Tab.Automated];

export const OrdersFallback: FC = () => {
  const { t } = useTranslation();
  const { tab } = useOrdersContext();
  return (
    <>
      <div className="flex ai-c gap-2">
        <nav className="tabs tabs--sm">
          <a className="selected w-16 flex jc-sb">
            <p className="color-white ml-1">{t(tab)}</p>
            <Icons.AngleDown className="color-white" />
            <nav>
              {TABS.filter((a) => a !== tab).map((a) => (
                <span
                  key={a}
                  className="flex ai-c"
                  style={{
                    fontSize: "0.75rem",
                  }}>
                  <label className="ml-1">{t(a)}</label>
                </span>
              ))}
            </nav>
          </a>
          <div className="divider mx-1" />
          <SubTabsFallback />
        </nav>
      </div>
      <LimitTableFallback />
    </>
  );
};

export const OrdersInner: FC = () => {
  const { t } = useTranslation();
  const { only, setOnly, tab, selectTab } = useOrdersContext();
  const { total: limitTotal } = useLimitOrdersData();
  const { total: recurringTotal } = useRecurringOrdersData();
  const range = useRangeOrdersData();
  const totalByTab: Record<Tab, number | undefined> = {
    [Tab.Limit]: limitTotal,
    [Tab.Recurring]: recurringTotal,
    [Tab.Automated]: range.open.length,
  };
  const count = totalByTab[tab];

  return (
    <>
      <div className="orders-header flex ai-c gap-2">
        <nav className="tabs tabs--sm">
          <a className="selected flex jc-sb">
            <p className="color-white ml-1">{t(tab)}</p>
            {count ? <i>{count || undefined}</i> : null}

            <Icons.AngleDown className="color-white" />
            <nav>
              {TABS.filter((a) => a !== tab).map((a) => (
                <span
                  key={a}
                  onClick={() => selectTab(a)}
                  className="flex ai-c"
                  style={{
                    fontSize: "0.75rem",
                  }}>
                  <label className="ml-1">{t(a)}</label>
                  {totalByTab[a] ? <i>{totalByTab[a]}</i> : null}
                </span>
              ))}
            </nav>
          </a>
          <div className="divider mx-1" />
          <SubTabs />
        </nav>
        <div className="orders-header__controls flex ai-c gap-0.5">
          <AutoClaimerStatusMenu />
          <Toggle
            className="toggle--xs as-c"
            checked={only}
            onChange={() => setOnly(!only)}
            label={t("showThisPairOnly")}
          />
        </div>
      </div>
      <Content />
    </>
  );
};

const SubTabs: FC = () => {
  const { tab } = useOrdersContext();
  const limit = useLimitOrdersData();
  const recurring = useRecurringOrdersData();

  switch (tab) {
    case Tab.Limit:
      return <LimitTabs data={limit} />;
    case Tab.Recurring:
      return <RecurringTabs data={recurring} />;
    case Tab.Automated:
      return <RangeTabs />;
  }
};

const SubTabsFallback: FC = () => {
  const { tab } = useOrdersContext();

  switch (tab) {
    case Tab.Limit:
      return <LimitTabs />;
    case Tab.Recurring:
      return <RecurringTabs />;
    case Tab.Automated:
      return <RangeTabs />;
  }
};

const Content: FC = () => {
  const { tab } = useOrdersContext();

  switch (tab) {
    case Tab.Limit:
      return <LimitContent />;
    case Tab.Recurring:
      return <RecurringContent />;
    case Tab.Automated:
      return <RangeContent />;
  }
};

export const blockSubscriptionId = btoa("ThorchainBlock:latest");

const TabC: FC<{
  tab: Tab;
  setTab: (t: Tab) => void;
  selected: Tab;
  count: { total: number };
}> = ({ tab, setTab, selected, count }) => {
  const { t } = useTranslation();
  return (
    <a
      className={clsx({ selected: selected === tab })}
      onClick={() => setTab(tab)}>
      <label>{t(tab)}</label>
      {count.total ? <i>{count.total}</i> : null}
    </a>
  );
};

enum RangeView {
  Open = "open",
  Closed = "closed",
}

export const OrdersPortfolio: FC = () => {
  const limit = useLimitOrdersData();
  const recurring = useRecurringOrdersData();
  const range = useRangeOrdersData();

  const [tab, setTab] = useQueryParam<Tab>("type", Tab.Limit);
  const [rangeView, setRangeView] = useState<RangeView>(RangeView.Open);

  return (
    <RangeContext>
      <div className="tabs tabs--sm py-1">
        <TabC tab={Tab.Limit} setTab={setTab} selected={tab} count={limit} />
        <TabC
          tab={Tab.Recurring}
          setTab={setTab}
          selected={tab}
          count={recurring}
        />
        <TabC
          tab={Tab.Automated}
          setTab={setTab}
          selected={tab}
          count={range}
        />
        {tab === Tab.Automated && (
          <>
            <div className="divider mx-1" />
            <RangeTabs />
            <Toggle
              className="toggle--xs ml-a as-c mr-1.5"
              labelOff="Closed"
              label="Open"
              checked={rangeView === RangeView.Open}
              onChange={(e) =>
                setRangeView(
                  e.target.checked ? RangeView.Open : RangeView.Closed
                )
              }
            />
          </>
        )}
      </div>
      <div className="pl-1">
        <PortfolioContent tab={tab} rangeView={rangeView} />
      </div>
    </RangeContext>
  );
};

const PortfolioContent: FC<{ tab: Tab; rangeView: RangeView }> = ({
  tab,
  rangeView,
}) => {
  const limit = useLimitOrdersData();
  const recurring = useRecurringOrdersData();
  const range = useRangeOrdersData();

  switch (tab) {
    case Tab.Limit:
      return <LimitTable orders={[...limit.open, ...limit.filled]} />;
    case Tab.Recurring:
      return (
        <RecurringTable
          orders={[
            ...recurring.active,
            ...recurring.paused,
            ...recurring.completed,
          ]}
          expanded
        />
      );
    case Tab.Automated:
      return (
        <RangeTable
          orders={rangeView === RangeView.Open ? range.open : range.closed}
        />
      );
  }
};
