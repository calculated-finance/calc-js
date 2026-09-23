import { FC } from "react";
import * as router from "react-router-dom";
import { SUPPORTED_LANGUAGE_PATTERN, useLocale } from "rujira.ui";
import { NotFound } from "./common/NotFound";

const base = ["/", "ecosystem", "portfolio"];
const enabled = import.meta.env.VITE_ROUTES_ENABLED;
const disabled = import.meta.env.VITE_ROUTES_DISABLED;
const ENABLED = enabled && [...base, ...enabled.split(",")];
const DISABLED: string[] = disabled ? disabled.split(",") : [];
const LOCALE_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGUAGE_PATTERN})(/|$)`);

export const docLinks = {
  options: "https://docs.rujira.network/core-products/ruji-options",
  launchpad: "https://docs.rujira.network/core-products/ruji-launchpad",
  nfts: "https://docs.rujira.network/core-products/ruji-collections-gojira",
};

export const route = (props: router.RouteProps) => {
  if (!props.path) return <router.Route {...props} />;
  if (props.path === "/") return <router.Route {...props} />;
  if (ENABLED && props.path && !ENABLED.find((x) => props.path?.includes(x)))
    return <router.Route path="*" element={<NotFound />} />;

  if (DISABLED.find((x) => props.path?.startsWith(x)))
    return <router.Route path="*" element={<NotFound />} />;

  return <router.Route {...props} />;
};

export const Link: FC<router.LinkProps> = (props) => {
  const { toRoot } = useLocale();
  if (!props.to) return <router.Link {...props} />;

  if (props.to.toString() === "/" || props.to.toString() === ".")
    return <router.Link {...props} />;
  const toPath = props.to?.toString();

  const key = toPath.replace(/^\//, "") as keyof typeof docLinks;
  if (key in docLinks) {
    return (
      <a
        data-soon="true"
        data-tooltip="Coming Soon..."
        {...{ ...props, to: undefined, href: docLinks[key] }}
        target="_blank"
      />
    );
  }

  if (
    (ENABLED &&
      !ENABLED.find((x) => {
        return toPath && toPath.length > 1
          ? toPath.replace(/^\//, "").startsWith(x)
          : toPath?.startsWith(x);
      })) ||
    DISABLED.find((x) => {
      return toPath && toPath?.startsWith(x);
    })
  )
    return <a data-tooltip="Coming Soon..." {...props} />;

  const to = props.to.toString();
  const routed = defaultRoute(to);
  const finalTo = to.startsWith("/")
    ? toRoot(routed ?? to)
    : routed
      ? routed.replace(/^\//, "")
      : to;

  return <router.Link {...props} to={finalTo} />;
};

export const defaultRoute = (to: string) => {
  const normalized = to.replace(/\/+$/, "") || "/";
  const path = normalized.startsWith("/")
    ? normalized.replace(LOCALE_PREFIX_RE, "/")
    : `/${normalized}`;
  switch (path) {
    case "/trade":
      return "/trade/BTC/USDC";
    case "/borrow":
      return "/borrow/BTC/USDC";
    case "/swap":
      return "/swap/ETH/BTC";
    case "/switch":
      return "/switch/AUTO";
    case "/merge":
      return "/merge/KUJI";
    default:
      return null;
  }
};
