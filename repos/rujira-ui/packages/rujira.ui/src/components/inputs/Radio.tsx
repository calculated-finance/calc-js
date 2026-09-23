import clsx from "clsx";
import { uuidv4 } from "../../helpers";
import { useMemo } from "react";

export type RadioProps = {
  label?: string;
  labelClassName?: string;
} & JSX.IntrinsicElements["input"];

export function Radio({
  label,
  className,
  disabled,
  labelClassName,
  ...rest
}: RadioProps) {
  const id = useMemo(() => uuidv4(), []);
  return (
    <div
      className={clsx({
        "radio-checkbox": true,
        "radio-checkbox--disabled": disabled,
        [`${className}`]: className,
      })}>
      <input type="radio" {...rest} disabled={disabled} id={id} />
      {label && (
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
}
