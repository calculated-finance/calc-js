import type { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { NOINDEX_FOLLOW_ROBOTS } from "./robots";

export const NoIndexHelmet = ({ children }: { children?: ReactNode }) => {
  return (
    <Helmet>
      {children}
      <meta name="robots" content={NOINDEX_FOLLOW_ROBOTS} />
    </Helmet>
  );
};
