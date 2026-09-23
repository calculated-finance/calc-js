import { useState } from "react";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";
import { Card, useTranslation } from "rujira.ui";

import { FAQFragment$key } from "./__generated__/FAQFragment.graphql";
import { Icons } from "rujira.ui";

const fragment = graphql`
  fragment FAQFragment on IndexVault {
    address
    fees {
      rates {
        management
        transaction
      }
    }
    shareAsset {
      metadata {
        symbol
      }
    }
    type
  }
`;

export const FAQ = ({ k }: { k: FAQFragment$key }) => {
  const [open, setOpen] = useState<number | null>(null);
  const { t } = useTranslation();
  const { fees, shareAsset, type, address } = useFragment(fragment, k);
  const methodologyUrl = shareAsset?.metadata.symbol
    ? `https://docs.rujira.network/core-products/ruji-index/${shareAsset?.metadata.symbol.toLowerCase()}`
    : "https://docs.rujira.network/core-products/ruji-index";
  const contractUrl = `https://thorchain.net/address/${address}`;
  const withdrawalFee = (
    Number(fees.rates.transaction) / 10_000_000_000
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const managementFee = (
    Number(fees.rates.management) / 10_000_000_000
  ).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const FAQ_ITEMS = [
    {
      title: t("faqMethodology"),
      content: t("faqMethodologyContent", { methodologyUrl }),
    },
    {
      title: t("faqRebalancing"),
      content:
        type == "nav"
          ? t("faqRebalancingNavContent")
          : t("faqRebalancingFixedContent"),
    },
    {
      title: t("faqYield"),
      content: t("faqYieldContent", {
        symbol: shareAsset.metadata.symbol,
        methodologyUrl,
      }),
      indexes: ["yRUNE", "yTCY"],
    },
    {
      title: t("faqRisks"),
      content: t("faqRisksContent"),
    },
    {
      title: t("faqFees"),
      content: t("faqFeesContent", {
        withdrawalFee,
        managementFee,
      }),
    },
    {
      title: t("faqContractAddress"),
      content: t("faqContractAddressContent", {
        contractUrl,
        address,
      }),
    },
  ];

  const filteredFAQ = FAQ_ITEMS.filter((item) => {
    if (!item.indexes) return true;
    return item.indexes
      .map((i) => i.toLowerCase())
      .includes(shareAsset.metadata.symbol.toLowerCase());
  });

  return (
    <Card className="p-10 mt-2 index__mobile-adjust">
      <h2 className="fs-24 lh-32 fw-400 color-white">{t("faq")}</h2>
      <div className="index__faq-accordion">
        {filteredFAQ.map((item, idx) => (
          <div className="index__faq-item" key={item.title}>
            <button
              className="index__faq-question"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
              aria-controls={`index__faq-panel-${idx}`}>
              <span>{item.title}</span>
              <span
                className={
                  open === idx
                    ? "index__faq-icon index__faq-icon--open"
                    : "index__faq-icon"
                }>
                <Icons.AngleDown color="#ffffff" width={20} />
              </span>
            </button>
            <div
              className="index__faq-answer"
              id={`index__faq-panel-${idx}`}
              style={{
                display: open === idx ? "block" : "none",
                whiteSpace: "pre-wrap",
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
