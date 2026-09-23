/// <reference types="vite/client" />

declare module "*.csv" {
  const content: Record<string, string>[];
  export default content;
}
