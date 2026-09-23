import clsx from "clsx";
//import { formatDuration, intervalToDuration } from "date-fns";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useTranslation,
  TranslationProvider,
  RujiraLogo,
  tokens,
} from "rujira.ui";

import bg from "./assets/background.jpg";

import { FC, useRef } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate, useParams } from "react-router-dom";
import { graphql } from "relay-runtime";

import { BalanceProvider } from "../common/components/Balance";
import { NoIndexHelmet } from "../seo";
import {
  MergeQuery,
  MergeQuery$data,
} from "./__generated__/MergeQuery.graphql";
import { Balance } from "./components/Balance";
import { Convert } from "./components/Convert";
import { GetDecay, toFixed } from "./components/Decay";
import { Graph } from "./components/Graph";
import { MergePool } from "./components/MergePool";
import { Icons } from "rujira.ui";

const query = graphql`
  query MergeQuery {
    merge {
      address
      mergeAsset {
        asset
        type
        chain
        metadata {
          decimals
          symbol
        }
      }
      ...DecayFragment
      ...MergePoolFragment
      ...ConvertStepFragment
    }
  }
`;

const Meta = () => {
  return (
    <NoIndexHelmet>
      <title>Rujira Merge</title>
      <meta
        name="description"
        content="Holders of KUJI, FUZN, NSTK, WINK, and LVN tokens are able to migrate and convert these tokens into RUJI on Rujira, the THORChain app layer."
      />
      <meta
        name="og:description"
        content="Holders of KUJI, FUZN, NSTK, WINK, and LVN tokens are able to migrate and convert these tokens into RUJI on Rujira, the THORChain app layer."
      />
      <meta
        name="twitter:description"
        content="Holders of KUJI, FUZN, NSTK, WINK, and LVN tokens are able to migrate and convert these tokens into RUJI on Rujira, the THORChain app layer."
      />
    </NoIndexHelmet>
  );
};

export const Merge: FC = () => {
  return (
    <TranslationProvider namespace="merge">
      <MergeContent />
    </TranslationProvider>
  );
};

const MergeContent: FC = () => {
  const { t } = useTranslation();
  const decayRef = useRef<HTMLDivElement | null>(null);
  const { asset } = useParams<{ asset: string }>();
  const navigate = useNavigate();
  const setAsset = (a: string) => {
    navigate(asset ? `../${a}` : a, { relative: "path" });
  };

  const pools = useLazyLoadQuery<MergeQuery>(query, {});
  type DecayType = {
    rate: number;
    day: string;
    v: number;
  };

  const duration = 367; //356;
  const fixed = 31;

  const Decay: DecayType[] = [];
  for (let i = 0; i < fixed; i++) {
    //Decay.push({ rate: 1, day: i + 1 });
    Decay.push({
      rate: 1,
      v: i + 1,
      day: new Date(Date.UTC(2025, 3, 4 + i, 0, 0, 0))
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/"),
    });
  }
  for (let i = fixed; i < duration; i++) {
    Decay.push({
      rate: 1 - (i - fixed) / (duration - fixed),
      //day: i + 1,
      v: i + 1,
      day: new Date(Date.UTC(2025, 3, 4 + i, 0, 0, 0))
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/"),
    });
  }

  const Rewards: { day: string; merged: number; bonus: number }[] = Decay.map(
    (x) => {
      const merged = Math.log(x.v) / (Math.log(duration) * 1.4);
      const unmerged = 1 - merged;
      return {
        day: x.day,
        merged,
        bonus: (1 - x.rate) * unmerged,
      };
    }
  );
  /* 
  let decayDuration = intervalToDuration({
    end: new Date(Date.UTC(2025, 4, 5, 0, 0, 0)),
    start: new Date(),
  });
  const formattedDuration = formatDuration(decayDuration, {
    format: ["months", "days", "hours"] as const,
    delimiter: ", ",
  }); */

  const decay = pools?.merge.length ? GetDecay(pools?.merge[0]) : 1;
  const namiDecay = pools?.merge.length
    ? GetDecay(pools?.merge.find((a) => a.mergeAsset.asset === "THOR.NAMI")!)
    : 1;

  const pool = pools.merge.find((a) => a.mergeAsset.metadata.symbol === asset);

  return (
    <>
      <Meta />
      <motion.div
        className="merge__background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4 }}
        style={{ backgroundImage: `url(${bg})` }}
      />
      <div className="rujira__inner--pad merge">
        <div className="rujira__inner">
          <div className="row wrap ai-c">
            <div className="col-6">
              <RujiraLogo
                showText={false}
                className="w-19 h-19 w-md-25 h-md-25 w-lg-30 h-lg-30 block mx-a ml-xs-0"
                animate={true}
              />
            </div>
            <div className="col-6">
              <div className="merge__graph-timer w-19 w-md-25 w-lg-30 mx-a ml-xs-a mr-0">
                <div
                  className="pointer"
                  onClick={() => {
                    decayRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}>
                  <Graph percentage={100 * decay} />
                  <h3>
                    {t("currentDecayFactor")}
                    <span>
                      {toFixed(decay, 2)}x <Icons.Info />
                    </span>
                    <small>
                      {t("namiRateLabel")} <b> {toFixed(namiDecay, 2)}x</b>)
                    </small>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <h1 className="h1 mt-4">{t("oneTokenTitle")}</h1>
          <h2 className="fs-24 lh-32 fw-400 color-white">
            {t("oneTokenSubtitle")}
          </h2>

          <h3 className="h5 text-center mt-6">{t("selectToken")}</h3>
          <div className="flex jc-c mt-2">
            {pools?.merge?.map((pool) => (
              <img
                key={pool.address}
                src={
                  tokens[
                    pool.mergeAsset.metadata.symbol.toLowerCase() as keyof typeof tokens
                  ]
                }
                alt={pool.mergeAsset.metadata.symbol}
                className={clsx({
                  "block w-5 h-5 mx-1 pointer": true,
                  desaturate: asset !== pool.mergeAsset.metadata.symbol,
                })}
                draggable="false"
                onClick={() => setAsset(pool.mergeAsset.metadata.symbol)}
              />
            ))}
          </div>

          {pool ? (
            <BalanceProvider asset={pool.mergeAsset}>
              <Steps asset={asset!} pools={pools} />
              <Balance />
            </BalanceProvider>
          ) : null}

          <div className="flex ai-b mt-8">
            <h2 className="h2 mt-2 mr-4">{t("mergeStats")}</h2>
            <div className="mt-2 flex ai-c">
              <span className="block fs-18 fw-600 mr-1 color-grey">
                {t("currentDecayFactor")}
              </span>
              <div
                className={clsx({
                  tag: true,
                  "tag--teal": decay > 0.75,
                  "tag--orange": decay <= 0.75 && decay > 0.5,
                  "tag--red": decay <= 0.5,
                })}>
                {toFixed(decay, 2)}x
              </div>
            </div>
          </div>

          <div className="mt-1 row pad wrap merge__stats">
            {pools?.merge?.map((p) => <MergePool key={p.address} k={p} />)}
          </div>

          <h2 className="h2 mt-10">{t("howToMerge")}</h2>
          <p className="p balance">{t("howToMergeP1")}</p>
          <p className="p balance">{t("howToMergeP2")}</p>
          <p className="p balance">{t("howToMergeP3")}</p>
          <p className="p balance">
            <a
              className="color-primary1 hover-primary2"
              href="https://medium.com/rujiranetwork/introduction-to-the-merge-f52a277a3c3c"
              target="_blank">
              {t("readMore")}
            </a>
          </p>

          <div className="row wrap pad ai-c mt-8" ref={decayRef}>
            <div className="col-12 col-lg-6">
              <h3 className="h3">{t("bondingCurveAndDecay")}</h3>
              <p className="p">
                {t("bondingCurveP1")}
                <span className="color-grey">*</span> {t("bondingCurveP1Star")}
              </p>
              <p className="p">{t("bondingCurveP2")}</p>
              <p className="fs-14 lh-20 color-grey">{t("bondingCurveNote")}</p>
            </div>
            <div className="col-12 col-lg-6 mt-4 mt-lg-0">
              <ResponsiveContainer
                width="100%"
                height={285}
                className="my-a mono fs-12">
                <AreaChart
                  width={500}
                  height={300}
                  data={Decay}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 0,
                  }}>
                  <XAxis
                    stroke="#607d8b"
                    tick={{ fill: "#ffffff" }}
                    fontSize={10}
                    dataKey="day"
                    tickFormatter={(e) => {
                      const date = new Date(e);
                      return date.toLocaleDateString("en-GB", {
                        month: "2-digit",
                        day: "2-digit",
                      });
                    }}
                    interval={30}
                  />
                  <YAxis
                    stroke="#607d8b"
                    tick={{ fill: "#ffffff" }}
                    fontSize={10}
                    tickFormatter={(e) => {
                      return e + "x";
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        active={undefined}
                        payload={undefined}
                        label={undefined}
                        t={t}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="#8436F5"
                    fill="#8436F5"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <ReferenceLine
                    //x={30}
                    x="2025/05/05"
                    stroke="#607d8b"
                    strokeDasharray="3 4"
                  />
                  <ReferenceLine
                    x={new Date()
                      .toISOString()
                      .split("T")[0]
                      .replace(/-/g, "/")}
                    stroke="#ffffff"
                    strokeDasharray="3 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="row wrap pad ai-c mt-6">
            <div className="col-12 col-lg-6">
              <h3 className="h3">{t("tokenBonus")}</h3>
              <p className="p">{t("tokenBonusP1")}</p>
              <p className="p">{t("tokenBonusP2")}</p>
              <p className="fs-14 lh-20 color-grey">{t("tokenBonusNote")}</p>
            </div>
            <div className="col-12 col-lg-6 mt-4 mt-lg-0">
              <ResponsiveContainer
                width="100%"
                height={285}
                className="my-a mono fs-12">
                <AreaChart
                  width={500}
                  height={300}
                  data={Rewards}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 0,
                  }}>
                  <XAxis
                    stroke="#607d8b"
                    tick={{ fill: "#ffffff" }}
                    fontSize={10}
                    dataKey="day"
                    tickFormatter={(e) => {
                      const date = new Date(e);
                      return date.toLocaleDateString("en-GB", {
                        month: "2-digit",
                        day: "2-digit",
                      });
                    }}
                    interval={30}
                  />
                  <YAxis
                    stroke="#607d8b"
                    tick={{ fill: "#ffffff" }}
                    fontSize={10}
                    tickFormatter={(e) => {
                      return (e * 100).toLocaleDecimal(2) + "%";
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip2
                        active={undefined}
                        payload={undefined}
                        label={undefined}
                        t={t}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="merged"
                    stroke="#01CDFE"
                    fill="#01CDFE"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="bonus"
                    stroke="#01CDFE"
                    fill="#01CDFE"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />

                  <ReferenceLine
                    //x={28}
                    x="2025/05/05"
                    stroke="#607d8b"
                    strokeDasharray="3 4"
                  />

                  <ReferenceLine
                    x={new Date()
                      .toISOString()
                      .split("T")[0]
                      .replace(/-/g, "/")}
                    stroke="#ffffff"
                    strokeDasharray="3 4"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="p balance mt-8">
            {t("supportMessage")}{" "}
            <a
              className="color-primary1 hover-primary2"
              href="https://discord.gg/XPvsxhWKfb"
              target="_blank"
              rel="noopener noreferrer">
              https://discord.gg/XPvsxhWKfb
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const Steps: FC<{
  asset: string;
  pools: MergeQuery$data;
}> = ({ asset, pools }) => {
  return (
    <div className="row wrap pad mt-4 jc-c">
      <Convert
        symbol={asset}
        c={
          pools?.merge?.find((x) => x.mergeAsset.metadata.symbol === asset) ||
          undefined
        }
      />
    </div>
  );
};

const CustomTooltip = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p className="label">
          {t("tooltipDate")} {label.toString()} 00:00 UTC
          <br />
          {t("tooltipConversionRate")} {payload[0].value.toFixed(2)}x
        </p>
      </div>
    );
  }
  return null;
};

const CustomTooltip2 = ({ active, payload, label, t }: any) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p className="label">
          {t("tooltipDate")} {label.toString()} 00:00 UTC
          <br />
          {t("tooltipTotalMerged")}{" "}
          {(payload[0].value * 100).toLocaleDecimal(2)}%
          <br />
          {t("tooltipBonus")} {(payload[1].value * 100).toLocaleDecimal(2)}%
        </p>
      </div>
    );
  }
  return null;
};
