import type { CSSProperties } from "react";
import type { DashboardMetric } from "../types";

interface MetricsGridProps {
  metrics: DashboardMetric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section className="metrics-grid" aria-label="Global platform metrics">
      {metrics.map((metric, index) => (
        <article className="metric-card reveal" key={metric.label} style={{ "--order": index } as CSSProperties}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
