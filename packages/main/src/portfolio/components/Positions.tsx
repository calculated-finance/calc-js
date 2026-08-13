import { FC } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Icons, TranslationProvider, useTranslation } from "rujira.ui";
import { PositionRow } from "../../borrow/components/Position";
import { usePreloadedAccountData } from "../../services/accountData";
import { PositionsPortfolioFragment$key } from "./__generated__/PositionsPortfolioFragment.graphql";

const tooltipHtml = (text: string) =>
  `<div class="w-30 text-left">${text}</div>`;

const fragment = graphql`
  fragment PositionsPortfolioFragment on Account {
    credit {
      accounts {
        account {
          address
        }
        ltv
        ...PositionBorrowRowFragment
      }
    }
  }
`;

export const Positions: FC = () => {
  const { accountData } = usePreloadedAccountData();
  const data = useFragment<PositionsPortfolioFragment$key>(
    fragment,
    accountData
  );
  const { t } = useTranslation("borrow");

  return (
    <div className="borrow relative card p-3 mt-2">
      {data?.credit.accounts?.length ? (
        <TranslationProvider namespace="borrow">
          <div className="table-sticky table-sticky--first">
            <table className="table table--big condensed portfolio__balances">
              <thead>
                <tr>
                  <th>Deposited</th>
                  <th>Borrowed</th>
                  <th>
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={`<div class='w-20'>${t(
                        "interestRateTooltip"
                      )}</div>`}>
                      {t("interestRate")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th className="text-center">
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={tooltipHtml(t("adjustedLtvTooltip"))}>
                      {t("adjustedLtv")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th>
                    <div
                      className="iflex ai-c no-select"
                      data-tooltip-id="global-tip"
                      data-tooltip-html={tooltipHtml(
                        t("liquidationPriceTableTooltip")
                      )}>
                      {t("liquidationPriceTableHeader")}
                      <Icons.Info className="ml-0.5 block w-2" />
                    </div>
                  </th>
                  <th className="w-1" />
                </tr>
              </thead>
              <tbody>
                {data?.credit.accounts
                  ?.slice()
                  .sort((a, b) => (a.ltv > b.ltv ? -1 : a.ltv < b.ltv ? 1 : 0))
                  .map((a) => (
                    <PositionRow
                      k={a}
                      key={a.account.address}
                      adjustmentThreshold={1n}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </TranslationProvider>
      ) : (
        <p className="condensed fs-14 color-grey text-center mt-2">
          You have no open borrowing positions
        </p>
      )}
    </div>
  );
};
