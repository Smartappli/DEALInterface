/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEALHOST_API_URL?: string;
  readonly VITE_DEALIOT_API_URL?: string;
  readonly VITE_DEALDATA_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
