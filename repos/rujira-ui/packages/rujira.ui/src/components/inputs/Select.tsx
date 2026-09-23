import clsx from "clsx";
import { useEffect } from "react";
import { AngleDown } from "../icons/Icons";

export type SelectProps = {
  label?: string;
  onSubmit?: () => void;
  labelClassName?: string;
  containerClassName?: string;
} & JSX.IntrinsicElements["select"];

export function Select({
  id,
  label,
  value,
  className,
  onChange,
  onSubmit,
  labelClassName,
  containerClassName,
  children,
  ...rest
}: SelectProps) {
  useEffect(() => {
    const handleUserKeyPress = (event: { keyCode: number }) => {
      const { keyCode } = event;
      if (keyCode === 13) {
        onSubmit?.();
      }
    };
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [onSubmit]);

  return (
    <div
      className={clsx({
        "select-container": true,
        [`${containerClassName}`]: containerClassName,
      })}>
      <select
        {...rest}
        className={clsx({
          select: true,
          "select--nolabel": !label,
          [`${className}`]: className,
        })}
        id={id}
        value={value}
        onChange={onChange}>
        {children}
      </select>
      {label && (
        <label
          htmlFor={id}
          className={clsx({
            label: true,
            [`${labelClassName}`]: labelClassName,
          })}>
          {label}
        </label>
      )}
      <AngleDown className="arrow" />
    </div>
  );
}
