import clsx from "clsx";

type Props = {
  className?: string;
  children?: React.ReactNode;
};
export const Card: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={clsx({
        "card p-3 color-white": true,
        [`${className}`]: className,
      })}>
      {children}
    </div>
  );
};
