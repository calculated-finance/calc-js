import clsx from "clsx";
import React from "react";
import toast from "react-hot-toast";
import {
  NETWORKS,
  Network,
  THOR,
  isThor,
  networkLabel,
  validateAddress,
} from "rujira.js";
import { Button, NetworkIcon, Provider, useTranslation } from "rujira.ui";

import conGif from "rujira.ui/assets/images/connect.gif";
import con from "rujira.ui/assets/images/connect.png";
import copyGif from "rujira.ui/assets/images/copy.gif";
import copy from "rujira.ui/assets/images/copy.png";
import disconGif from "rujira.ui/assets/images/disconnect.gif";
import discon from "rujira.ui/assets/images/disconnect.png";
import extGif from "rujira.ui/assets/images/external.gif";
import ext from "rujira.ui/assets/images/external.png";

import { Icons } from "rujira.ui";
import { useAccounts } from "../../services/accounts";

export type WalletOptionType = {
  description: string;
  links: {
    url: string;
    icon: React.ReactNode;
  }[];
  logo: JSX.Element;
  provider?: Provider.Key;
  limited?: boolean;
};

export const WalletOption = ({
  description,
  links,
  logo,
  provider,
  limited,
}: WalletOptionType) => {
  const { t } = useTranslation("portfolio");
  const { isAvailable, accounts, connect, disconnect } = useAccounts();
  const connected =
    provider && accounts?.filter((a) => a.provider === provider);
  const [hover, setHover] = React.useState(false);

  const supportsThor =
    provider && Provider.signer(provider).networks().includes(THOR);

  return (
    <div className="col-12 col-md-6 col-lg-6 col-xl-4">
      <div className="card h-full flex p-3 dir-c ai-s portfolio__wallet">
        <div className="flex wrap ai-c jc-sb w-full gap-1">
          <div className="portfolio__wallet-logo">{logo}</div>
          {provider && isAvailable(provider) ? (
            <Button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className={clsx({
                "button--sm": true,
                "button--grey": connected?.length,
              })}
              disabled={!isAvailable(provider)}
              label={connected?.length ? t("disconnect") : t("connect")}
              onClick={() =>
                connected?.length ? disconnect(provider) : connect(provider)
              }>
              {connected?.length ? (
                <img
                  src={hover ? disconGif : discon}
                  alt="Disconnect"
                  className="filter-white"
                />
              ) : (
                <img
                  src={hover ? conGif : con}
                  alt="Connect"
                  className="filter-white"
                />
              )}
            </Button>
          ) : (
            <Button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              as={"a"}
              className="button--sm button button--grey button--outline button--icon-right"
              href={links[0].url}
              label={t("install")}
              target="_blank">
              <img
                src={hover ? extGif : ext}
                alt="Link"
                className={hover ? "filter-white" : "filter-grey"}
              />
            </Button>
          )}
        </div>

        <h4 className="fs-12 fw-500 color-grey mt-2 mb-0">
          Supported Networks
        </h4>
        <div className="flex ai-c gap-1 mt-0.5">
          <div className="portfolio__wallet-networks">
            {provider &&
              Provider.signer(provider)
                .networks()
                .sort((a, b) => {
                  if (a === THOR) return -1;
                  if (b === THOR) return 1;
                  return networkLabel(a).localeCompare(networkLabel(b));
                })
                .map((n) => (
                  <div
                    data-tooltip-content={networkLabel(n)}
                    data-tooltip-id="global-tip"
                    key={n}>
                    <NetworkIcon
                      network={n}
                      selected={limited && n === THOR ? false : true}
                    />
                  </div>
                ))}
          </div>
          {supportsThor ? (
            !limited ? (
              <div className="tag tag--borderless tag--primary no-shrink">
                Rujira Support
              </div>
            ) : (
              <div
                className="tag tag--borderless tag--orange no-shrink"
                data-tooltip-content={t("noSupportTooltip")}
                data-tooltip-id="global-tip">
                Limited Support
              </div>
            )
          ) : (
            <div
              className="tag tag--borderless no-shrink"
              data-tooltip-content={t("limitedSupportTooltip")}
              data-tooltip-id="global-tip">
              No Rujira Support (yet)
            </div>
          )}
        </div>

        <p>{description}</p>
        <div className="portfolio__wallet-links mt-a">
          {links.map((l) => (
            <a key={l.url} href={l.url} target="_blank">
              {l.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WalletConnected = ({ logo, provider }: WalletOptionType) => {
  const { t } = useTranslation("portfolio");
  const { isAvailable, accounts, connect, disconnect } = useAccounts();
  const connected =
    provider && accounts?.filter((a) => a.provider === provider);
  const addresses = [...new Set(connected?.map((x) => x.address))].sort(
    (a, b) => {
      if (isThor(a)) return -1;
      if (isThor(b)) return 1;
      return a.address.localeCompare(b.address);
    }
  );

  const [hover, setHover] = React.useState(false);
  const [expand, setExpand] = React.useState(false);

  return (
    <div className="col-12 col-md-6 col-lg-12">
      <div className="card h-full flex p-2.5 dir-c ai-s portfolio__wallet">
        <div className="flex wrap ai-c jc-sb w-full gap-1">
          <div className="portfolio__wallet-logo portfolio__wallet-logo--small">
            {logo}
          </div>
          {provider && isAvailable(provider) && (
            <Button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className={clsx({
                "button--xs": true,
                "button--grey": connected?.length,
              })}
              disabled={!isAvailable(provider)}
              label={connected?.length ? t("disconnect") : t("connect")}
              onClick={() =>
                connected?.length ? disconnect(provider) : connect(provider)
              }>
              {connected?.length ? (
                <img
                  src={hover ? disconGif : discon}
                  alt="Disconnect"
                  className="filter-white"
                />
              ) : (
                <img
                  src={hover ? conGif : con}
                  alt="Connect"
                  className="filter-white"
                />
              )}
            </Button>
          )}
        </div>
        {provider === "Vultisig" && (
          <div
            className="tag tag--borderless tag--primary no-shrink mt-1"
            data-tooltip-content={t("embeddedTooltip")}
            data-tooltip-id="global-tip">
            {t("embeddedLabel")}
          </div>
        )}
        {provider === "Vulticonnect" && (
          <div className="tag tag--borderless tag--primary no-shrink mt-1">
            {t("extensionLabel")}
          </div>
        )}
        <button
          className="transparent fs-12 fw-500 color-grey hover-white mt-2 mb-0 flex ai-c jc-sb w-full pointer"
          onClick={() => setExpand(!expand)}>
          <span>
            Connected{" "}
            <span className="color-white">{addresses?.length || 0}</span>{" "}
            addresses on{" "}
            <span className="color-white">
              {(provider &&
                Provider.signer(provider)
                  .networks()
                  .sort((a, b) => {
                    if (a === THOR) return -1;
                    if (b === THOR) return 1;

                    return networkLabel(a).localeCompare(networkLabel(b));
                  }).length) ||
                0}
            </span>{" "}
            networks
          </span>
          {!expand ? (
            <Icons.AngleDown className="w-2 h-2" />
          ) : (
            <Icons.AngleUp className="w-2 h-2" />
          )}
        </button>
        {expand && addresses && addresses?.length > 0 && (
          <div className="portfolio__wallet-addresses mt-1">
            {addresses?.map((x) => {
              return (
                <AddressItem
                  key={x.address}
                  address={x.address}
                  networks={x.networks}
                  duplicate={false}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export const AddressItem = ({
  address,
  networks,
  duplicate = false,
}: {
  address: string;
  networks?: Network[];
  duplicate: boolean;
}) => {
  const { t } = useTranslation("portfolio");
  const [hover, setHover] = React.useState(false);
  const detectedNetworks =
    networks || NETWORKS.filter((n) => validateAddress(n, address));

  return (
    <div
      className="flex jc-sb ai-c w-full color-grey hover-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div className="flex">
        {detectedNetworks.map((n) => (
          <div
            key={address + n}
            data-tooltip-content={networkLabel(n)}
            data-tooltip-id="global-tip"
            style={{ marginRight: 2 }}>
            <NetworkIcon className="w-2 h-2" key={n} network={n} />
          </div>
        ))}
      </div>
      <div className="flex ai-c gap-1">
        <small
          onClick={() => {
            toast.success(t("addressCopied"));
            navigator.clipboard.writeText(address);
          }}
          data-tooltip-content={address}
          data-tooltip-id="global-tip"
          className="font-sm mono flex aic gap-0.5 pointer">
          {address.slice(0, 10)}...
          {address.slice(address.length - 5, address.length)}
          <img
            src={hover ? copyGif : copy}
            alt="Link"
            className={clsx({
              "w-1.5 h-1.5": true,
              "filter-white": hover,
              "filter-grey": !hover,
            })}
          />
        </small>
        {duplicate && (
          <span
            className="tag tag--sm"
            data-tooltip-content={t("defaultSignerTooltip")}
            data-tooltip-id="global-tip">
            {t("defaultTag")}
          </span>
        )}
      </div>
    </div>
  );
};
