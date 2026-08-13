import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { I18nextProvider } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import {
  i18n,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "./config";

type LocaleContextValue = {
  locale: SupportedLanguage | undefined;
  localePrefix: "" | `/${SupportedLanguage}`;
  toRoot: (path: string) => string;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_PREFIX_RE = new RegExp(
  `^/(?:${SUPPORTED_LANGUAGES.join("|")})(?=/|$)`
);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within I18nProvider");
  return context;
};

const toRootPath = (localePrefix: "" | `/${SupportedLanguage}`, path: string) => {
  if (!path) return localePrefix || "/";
  // Absolute URI scheme (e.g. https:, mailto:) — return as-is
  if (/^[a-z][a-z\d+.-]*:/i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const sanitized = normalized.replace(/\/\/+/g, "/");
  if (sanitized === "/") return localePrefix || "/";

  if (localePrefix && LOCALE_PREFIX_RE.test(sanitized)) {
    const withoutLocale = sanitized.replace(LOCALE_PREFIX_RE, "");
    const relative = withoutLocale.startsWith("/") ? withoutLocale.substring(1) : withoutLocale;
    return relative ? `${localePrefix}/${relative}` : localePrefix;
  }

  if (
    localePrefix &&
    (sanitized === localePrefix || sanitized.startsWith(`${localePrefix}/`))
  )
    return sanitized;

  return `${localePrefix || ""}${sanitized}`;
};

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const withoutLocale = useMemo<LocaleContextValue>(() => {
    const toRoot = (path: string) => toRootPath("", path);
    return { locale: undefined, localePrefix: "", toRoot };
  }, []);

  return (
    <Routes>
      {SUPPORTED_LANGUAGES.map((code) => (
        <Route key={code} path={`${code}/*`} element={<Lang code={code}>{children}</Lang>} />
      ))}
      <Route
        path="*"
        element={
          <LocaleContext.Provider value={withoutLocale}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </LocaleContext.Provider>
        }
      />
    </Routes>
  );
};

const Lang: FC<PropsWithChildren<{ code: SupportedLanguage }>> = ({
  code,
  children,
}) => {
  const localePrefix = `/${code}` as const;
  const locale = code;
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, localePrefix, toRoot: (path) => toRootPath(localePrefix, path) }),
    [locale, localePrefix]
  );

  useLayoutEffect(() => {
    i18n.changeLanguage(code);
  }, [code]);

  return (
    <LocaleContext.Provider value={value}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LocaleContext.Provider>
  );
};
