import type { ModuleRuntimeConfig } from "../config/moduleRegistry";
import { statusCopy } from "../lib/status";
import type { DealModule } from "../types";
import { StatusPill } from "./StatusPill";

interface ModuleDetailProps {
  module: DealModule;
  runtime: ModuleRuntimeConfig;
}

export function ModuleDetail({ module, runtime }: ModuleDetailProps) {
  const healthUrl = `${runtime.apiBaseUrl}${runtime.healthPath}`;

  return (
    <section className="panel module-detail" aria-labelledby="module-detail-title">
      <div className="panel__header module-detail__header">
        <div>
          <span className="section-kicker">Selected module</span>
          <h2 id="module-detail-title">{module.name}</h2>
        </div>
        <StatusPill status={module.status} />
      </div>

      <p className="module-detail__summary">{statusCopy[module.status]}</p>

      <div className="runtime-card">
        <span>Runtime endpoint</span>
        <strong>{runtime.apiBaseUrl}</strong>
        <a href={healthUrl} rel="noreferrer" target="_blank">
          Open health probe
        </a>
      </div>

      <div className="module-detail__metrics">
        {module.metrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.trend}</small>
          </article>
        ))}
      </div>

      <div className="detail-columns">
        <div>
          <h3>Managed capabilities</h3>
          <ul>
            {module.capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Connected systems</h3>
          <ul>
            {module.integrations.map((integration) => (
              <li key={integration}>{integration}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
