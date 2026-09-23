import { SITE_ORIGIN } from "../seo";

export const siteOrigin = (): string =>
  typeof window === "undefined" ? SITE_ORIGIN : window.location.origin;
