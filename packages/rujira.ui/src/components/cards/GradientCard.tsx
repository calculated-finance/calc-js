import clsx from "clsx";

type Props = {
  className?: string;
  children?: React.ReactNode;
};
export const GradientCard: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={clsx({
        "gradient-card bg-black p-3 color-white": true,
        [`${className}`]: className,
      })}>
      {children}
    </div>
  );
};
