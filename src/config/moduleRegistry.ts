import type { ModuleKey } from "../types";

export interface ModuleRuntimeConfig {
  key: ModuleKey;
  apiBaseUrl: string;
  healthPath: string;
  docsPath: string;
}

export const moduleRuntimeConfig: Record<ModuleKey, ModuleRuntimeConfig> = {
  dealhost: {
    key: "dealhost",
    apiBaseUrl: import.meta.env.VITE_DEALHOST_API_URL ?? "http://127.0.0.1:9080",
    healthPath: "/api/gateway/health/",
    docsPath: "/docs/dealhost",
  },
  dealiot: {
    key: "dealiot",
    apiBaseUrl: import.meta.env.VITE_DEALIOT_API_URL ?? "http://127.0.0.1:9081",
    healthPath: "/api/iot/health/",
    docsPath: "/docs/dealiot",
  },
  dealdata: {
    key: "dealdata",
    apiBaseUrl: import.meta.env.VITE_DEALDATA_API_URL ?? "http://127.0.0.1:9082",
    healthPath: "/api/data/health/",
    docsPath: "/docs/dealdata",
  },
};
