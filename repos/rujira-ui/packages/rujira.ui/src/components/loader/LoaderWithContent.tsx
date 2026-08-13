import { FC, ReactNode } from "react";
import spinnie from "../../assets/images/spinnie.gif";

export type LoaderWithContentProps = {
  loading: boolean;
  loaderClassname?: string;
  content: ReactNode;
};

export const LoaderWithContent: FC<LoaderWithContentProps> = ({
  loading,
  loaderClassname,
  content,
}) => {
  const spinnieClassname = loaderClassname ?? "w-2 h-2 filter-teal";
  const spinnieUI = () => (
    <img src={spinnie} alt="Spinner Animation" className={spinnieClassname} />
  );

  return <>{loading ? spinnieUI() : content}</>;
};
