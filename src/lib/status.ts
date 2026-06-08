import type { ModuleHealth } from "../types";

export const statusLabels: Record<ModuleHealth, string> = {
  online: "Operational",
  degraded: "Degraded",
  attention: "Action needed",
};

export const statusCopy: Record<ModuleHealth, string> = {
  online: "Ready for production workflows.",
  degraded: "Service is available, but an operator should inspect capacity or latency.",
  attention: "A human decision or approval is needed before automation continues.",
};
