/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string;
  readonly VITE_API_KEY: string;
  readonly VITE_SOCKET: string;
  readonly VITE_ANALYTICS_API: string;
  readonly VITE_ANALYTICS_SOCKET: string;
  readonly VITE_ROUTES_ENABLED?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_THORCHAIN_MODULE_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;

declare module "*.csv" {
  const content: Record<string, string>[];
  export default content;
}
