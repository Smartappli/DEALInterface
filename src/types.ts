export type ModuleKey = "dealhost" | "dealiot" | "dealdata";

export type ModuleHealth = "online" | "degraded" | "attention";

export interface DealModule {
  key: ModuleKey;
  name: string;
  shortName: string;
  summary: string;
  owner: string;
  status: ModuleHealth;
  accent: string;
  endpointLabel: string;
  capabilities: string[];
  metrics: Array<{
    label: string;
    value: string;
    trend: string;
  }>;
  integrations: string[];
}

export interface DashboardMetric {
  label: string;
  value: string;
  detail: string;
}

export interface ActivityItem {
  module: string;
  title: string;
  detail: string;
  time: string;
  severity: ModuleHealth;
}
