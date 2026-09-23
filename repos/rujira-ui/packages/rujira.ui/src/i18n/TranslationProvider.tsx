import { createContext, FC, PropsWithChildren } from "react";

export const TranslationContext = createContext<string | undefined>(undefined);

interface TranslationProviderProps extends PropsWithChildren {
  namespace: string;
}

export const TranslationProvider: FC<TranslationProviderProps> = ({
  namespace,
  children,
}) => {
  return (
    <TranslationContext.Provider value={namespace}>
      {children}
    </TranslationContext.Provider>
  );
};
