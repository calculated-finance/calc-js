import { ComponentType, ReactNode } from "react";

export const ContextWrapper: React.FC<{
  contexts: ComponentType<any>[];
  children: ReactNode;
}> = ({ contexts, children }) =>
  contexts.reduceRight(
    (acc, CurrentContext) => <CurrentContext>{acc}</CurrentContext>,
    children
  );
