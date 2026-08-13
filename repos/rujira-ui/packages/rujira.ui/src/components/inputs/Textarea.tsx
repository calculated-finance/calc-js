import clsx from "clsx";
import { useEffect } from "react";

export type TextareaProps = {
  label?: string;
  onSubmit?: () => void;
  labelClassName?: string;
  containerClassName?: string;
} & JSX.IntrinsicElements["textarea"];

export function Textarea({
  id,
  label,
  value,
  className,
  onChange,
  onSubmit,
  disabled,
  labelClassName,
  containerClassName,
  placeholder,
  ...rest
}: TextareaProps) {
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
        "input-container": true,
        "input-container--disabled": disabled,
        [`${containerClassName}`]: containerClassName,
      })}>
      <textarea
        {...rest}
        className={clsx({ input: true, [`${className}`]: className })}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
      />
      {label && (
        <label
          htmlFor={id}
          className={clsx({
            label: true,
            [`${labelClassName}`]: labelClassName,
          })}>
          {label && label}
        </label>
      )}
    </div>
  );
}
