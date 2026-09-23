import clsx from "clsx";
import { uuidv4 } from "../../helpers";
import { useMemo } from "react";

export type CheckboxProps = {
  label?: string;
  labelClassName?: string;
} & JSX.IntrinsicElements["input"];

export function Checkbox({
  label,
  className,
  disabled,
  labelClassName,
  children,
  ...rest
}: CheckboxProps) {
  const id = rest.id ? rest.id : useMemo(() => uuidv4(), []);
  return (
    <div
      className={clsx({
        "radio-checkbox": true,
        "radio-checkbox--disabled": disabled,
        [`${className}`]: className,
      })}>
      <input type="checkbox" {...rest} disabled={disabled} id={id} />
      {label && (
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}
