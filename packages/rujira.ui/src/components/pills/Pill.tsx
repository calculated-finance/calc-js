import clsx from "clsx";
import { HTMLAttributes, ReactNode } from "react";

export type PillProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode;
  label: ReactNode;
};

export const Pill = ({ className, icon, label, ...props }: PillProps) => {
  return (
    <div {...props} className={clsx("pill", className)}>
      {icon}
      <span>{label}</span>
    </div>
  );
};
