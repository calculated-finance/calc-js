import clsx from "clsx";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import {
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  MouseEvent,
  ReactNode,
  Ref,
  RefAttributes,
  forwardRef,
} from "react";

export type ButtonProps<T extends ElementType = "button"> = {
  as?: T;
  label?: string | ReactNode;
  className?: string;
  children?: ReactNode;
} & DistributiveOmit<ComponentPropsWithRef<T>, "as">;

type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
) => (props: P & RefAttributes<T>) => ReactNode;

const fixedForwardRef = forwardRef as FixedForwardRef;

type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never;

const UnwrappedAnyComponent = <T extends ElementType>(
  props: ButtonProps<T>,
  ref: ForwardedRef<any>
) => {
  const { as: Comp = "button", label, children, className, ...rest } = props;

  // Remove button--outline if button--waiting is present
  const processedClassName = className?.includes("button--waiting")
    ? className.replace(/button--outline/g, "").trim()
    : className;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  let gradient = "214, 21, 235, 1";
  if (className?.includes("button--grey")) {
    gradient = "96, 125, 139, 1";
  } else if (className?.includes("button--red")) {
    gradient = "244, 81, 30, 1";
  } else if (className?.includes("button--blue")) {
    gradient = "96, 251, 208, 1";
  } else if (className?.includes("button--dark")) {
    gradient = "214, 21, 235, 0.25";
  } else if (className?.includes("button--orange")) {
    gradient = "245, 123, 0, 0.25";
  }

  const buttonElement = (
    <Comp
      {...rest}
      ref={ref}
      onMouseMove={handleMouseMove}
      className={clsx({
        button: !className?.includes("transparent"),
        [`${processedClassName}`]: processedClassName,
      })}>
      {!className?.includes("transparent") && (
        <motion.div
          className="button__motion"
          style={{
            background: useMotionTemplate`
          radial-gradient(
            150px circle at ${mouseX}px ${mouseY}px,
            rgba(${gradient}),
            transparent 100%
            )
            `,
          }}
        />
      )}
      {label && <span>{label}</span>}
      {children}
    </Comp>
  );

  return className?.includes("button--waiting") ? (
    <div className="button-container">{buttonElement}</div>
  ) : (
    buttonElement
  );
};

export const Button = fixedForwardRef(UnwrappedAnyComponent);
