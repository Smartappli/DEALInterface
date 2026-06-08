import type { ModuleHealth } from "../types";
import { statusLabels } from "../lib/status";

interface StatusPillProps {
  status: ModuleHealth;
}

export function StatusPill({ status }: StatusPillProps) {
  return <span className={`status-pill status-pill--${status}`}>{statusLabels[status]}</span>;
}
