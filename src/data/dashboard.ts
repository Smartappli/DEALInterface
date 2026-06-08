import type { ActivityItem, DashboardMetric, DealModule } from "../types";

export const dealModules: DealModule[] = [
  {
    key: "dealhost",
    name: "DEALHost",
    shortName: "Host",
    summary: "Provisioning, gateways, domains and runtime operations for hosted apps.",
    owner: "Platform team",
    status: "online",
    accent: "#f59f00",
    endpointLabel: "APISIX gateway",
    capabilities: ["Deployments", "Domains", "Runtime logs", "Tenant quotas"],
    metrics: [
      { label: "Apps", value: "42", trend: "+6 this week" },
      { label: "Gateways", value: "8", trend: "all healthy" },
      { label: "P95 latency", value: "128 ms", trend: "stable" },
    ],
    integrations: ["APISIX", "Valkey", "NATS", "Django"],
  },
  {
    key: "dealiot",
    name: "DEALIot",
    shortName: "IoT",
    summary: "Device fleets, telemetry intake, automations and edge policy control.",
    owner: "IoT operations",
    status: "degraded",
    accent: "#009b8e",
    endpointLabel: "Telemetry API",
    capabilities: ["Device registry", "Telemetry", "Rules engine", "Edge updates"],
    metrics: [
      { label: "Devices", value: "18.4k", trend: "+312 today" },
      { label: "Ingest", value: "2.8M", trend: "events / hour" },
      { label: "Alerts", value: "11", trend: "needs triage" },
    ],
    integrations: ["MQTT", "NATS", "Edge agents", "Alerting"],
  },
  {
    key: "dealdata",
    name: "DEALData",
    shortName: "Data",
    summary: "Data ingestion, catalog, lineage and governed analytical workspaces.",
    owner: "Data platform",
    status: "online",
    accent: "#2f6f9f",
    endpointLabel: "Data control API",
    capabilities: ["Pipelines", "Catalog", "Lineage", "Access policies"],
    metrics: [
      { label: "Datasets", value: "286", trend: "+19 curated" },
      { label: "Pipelines", value: "73", trend: "4 scheduled" },
      { label: "Freshness", value: "96%", trend: "within SLA" },
    ],
    integrations: ["Object storage", "Warehouse", "IAM", "Audit logs"],
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Managed modules", value: "3", detail: "single control plane" },
  { label: "Active tenants", value: "128", detail: "cross-module access" },
  { label: "Open actions", value: "17", detail: "11 IoT, 4 Host, 2 Data" },
  { label: "Automation rate", value: "84%", detail: "routine tasks covered" },
];

export const activityFeed: ActivityItem[] = [
  {
    module: "DEALHost",
    title: "Gateway route promoted",
    detail: "Production API route synced through APISIX standalone config.",
    time: "10 min",
    severity: "online",
  },
  {
    module: "DEALIot",
    title: "Telemetry lag above threshold",
    detail: "Two ingestion partitions need scaling before the next peak window.",
    time: "24 min",
    severity: "degraded",
  },
  {
    module: "DEALData",
    title: "Dataset policy updated",
    detail: "Finance catalog now requires approval for external exports.",
    time: "41 min",
    severity: "online",
  },
  {
    module: "IAM",
    title: "Service account rotation due",
    detail: "Four tokens expire in the next seven days.",
    time: "1 h",
    severity: "attention",
  },
];
