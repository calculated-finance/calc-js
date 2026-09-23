import clsx from "clsx";
import { FC, InputHTMLAttributes } from "react";

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelOff?: string;
  children?: React.ReactNode;
}

export const Toggle: FC<ToggleProps> = ({
  label,
  labelOff,
  checked,
  className,
  id,
  onChange,
  children,
  ...rest
}) => {
  const classes = clsx({
    [`toggle`]: true,
    [`${className}`]: className,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
  };

  return (
    <label className={classes} htmlFor={id}>
      {labelOff && labelOff !== "" && (
        <span className="toggle__label toggle__label--off">{labelOff}</span>
      )}
      <input
        id={id}
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        {...rest}
      />
      <span className="toggle__slider"></span>
      {label && label !== "" && <span className="toggle__label">{label}</span>}
      {children}
    </label>
  );
};
