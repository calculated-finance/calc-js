import {
  ComponentPropsWithRef,
  ElementType,
  ForwardedRef,
  ReactNode,
  Ref,
  RefAttributes,
  forwardRef,
} from "react";

export type LinkProps<T extends ElementType = "a"> = {
  as: T;
  domain?: string;
  children?: ReactNode;
  isStatic?: boolean;
} & DistributiveOmit<ComponentPropsWithRef<T>, "as">;

type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode
) => (props: P & RefAttributes<T>) => ReactNode;

const fixedForwardRef = forwardRef as FixedForwardRef;

type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never;

export const UnwrappedAnyComponent = <T extends ElementType>(
  props: LinkProps<T>,
  ref: ForwardedRef<any>
) => {
  const { as: Comp = "a", children, domain, isStatic, ...rest } = props;

  if (!isStatic && props.as && props.as !== "a") {
    return (
      <Comp {...rest} ref={ref}>
        {children}
      </Comp>
    );
  }
  return (
    <a href={props.to || props.href} {...rest}>
      {children}
    </a>
  );
};

export const ResolveLink = fixedForwardRef(UnwrappedAnyComponent);
