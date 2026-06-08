import type { CSSProperties } from "react";
import type { DealModule, ModuleKey } from "../types";

interface TopologyMapProps {
  modules: DealModule[];
  activeKey: ModuleKey;
}

export function TopologyMap({ modules, activeKey }: TopologyMapProps) {
  return (
    <section className="panel topology-panel" aria-labelledby="topology-title">
      <div className="panel__header">
        <span className="section-kicker">Architecture</span>
        <h2 id="topology-title">Unified management surface</h2>
      </div>
      <div className="topology-map">
        <div className="topology-core">
          <span>IAM</span>
          <strong>DEALInterface</strong>
          <small>RBAC / Audit / Billing / Support</small>
        </div>
        {modules.map((module, index) => (
          <div
            className={`topology-node topology-node--${index + 1} ${module.key === activeKey ? "topology-node--active" : ""}`}
            key={module.key}
            style={{ "--accent": module.accent } as CSSProperties}
          >
            <span>{module.shortName}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
