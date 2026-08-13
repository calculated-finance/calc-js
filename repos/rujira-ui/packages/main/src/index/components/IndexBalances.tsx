import { FC, Suspense } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { useTranslation } from "rujira.ui";
import { usePreloadedAccountData } from "../../services/accountData";
import { IndexBalancesFragment$key } from "./__generated__/IndexBalancesFragment.graphql";
import { BalanceIndex } from "./IndexBalance";

const fragment = graphql`
  fragment IndexBalancesFragment on Account {
    index {
      id
      ...IndexBalanceFragment
    }
  }
`;

export const Balances = () => {
  const { accountData } = usePreloadedAccountData();
  const { t } = useTranslation();
  const indexBalances = useFragment<IndexBalancesFragment$key>(
    fragment,
    accountData
  );

  return (
    <div className="index__positions">
      <h3 className="h3 mt-5 mt-lg-12">{t("myPositions")}</h3>
      <Suspense fallback={<Fallback />}>
        <div className="">
          {indexBalances?.index.map((x) => <BalanceIndex key={x.id} k={x} />)}
          {(!indexBalances?.index || indexBalances?.index.length === 0) && (
            <div className="relative card p-3">
              <h4 className="h4 fs-16 lh-19 fw-500 color-grey text-center mb-0">
                {t("noPositionsFound")}
              </h4>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
};

const Fallback: FC = () => (
  <div className="card card--shadow flex row dir-c dir-md-r ji-c ai-c jc-sb my-2 p-2">
    <div className="flex row jc-sb pr-3 w-full">
      <div className="flex row ji-c ai-c">
        <div
          className="icon-denom skeleton br-4 mr-1"
          style={{ width: 32, height: 32 }}
        />
        <div className="skeleton br-2" style={{ width: 48, height: 16 }} />
      </div>
      <div className="flex row dir-c">
        <div className="skeleton br-2 mb-1" style={{ width: 64, height: 18 }} />
        <div className="skeleton br-2" style={{ width: 48, height: 14 }} />
      </div>
    </div>
    <div
      className="skeleton br-2 mt-2 mt-md-0"
      style={{ width: 80, height: 32 }}
    />
  </div>
);
