import { clsx } from "clsx";
import { FC } from "react";
import { Button } from "../buttons/Button";
import { AngleLeft, AngleRight } from "../icons/Icons";

export interface PageInfo {
  endCursor: string | null | undefined;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null | undefined;
}

export const Pagination: FC<{
  pageInfo: PageInfo;
  className?: string;
  buttonClassName?: string;
  setAfter: (cursor: string) => void;
  setBefore: (cursor: string) => void;
}> = ({ className, buttonClassName, pageInfo, setAfter, setBefore }) => {
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = pageInfo;
  return (
    <div className={clsx({ pagination: true, [`${className}`]: className })}>
      <Button
        className={buttonClassName}
        label="Previous"
        disabled={!hasPreviousPage}
        onClick={() => startCursor && setBefore(startCursor)}>
        <AngleLeft />
      </Button>
      <Button
        className={clsx({
          "button--icon-right": true,
          [`${buttonClassName}`]: buttonClassName,
        })}
        label="Next"
        disabled={!hasNextPage}
        onClick={() => endCursor && setAfter(endCursor)}>
        <AngleRight />
      </Button>
    </div>
  );
};
