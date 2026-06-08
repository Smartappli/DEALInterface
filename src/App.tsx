import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import { CommandCenter } from "./components/CommandCenter";
import { ControlProfile } from "./components/ControlProfile";
import { ActivityFeed } from "./components/ActivityFeed";
import { MetricsGrid } from "./components/MetricsGrid";
import { ModuleCard } from "./components/ModuleCard";
import { ModuleDetail } from "./components/ModuleDetail";
import { OperatorQueue } from "./components/OperatorQueue";
import { TopologyMap } from "./components/TopologyMap";
import { moduleRuntimeConfig } from "./config/moduleRegistry";
import { activityFeed, dashboardMetrics, dealModules, moduleControlProfiles, operatorActions } from "./data/dashboard";
import type { ActionPriority, ModuleKey } from "./types";

const actionPriorityRank: Record<ActionPriority, number> = {
  critical: 0,
  high: 1,
  normal: 2,
};

export default function App() {
  const [activeKey, setActiveKey] = useState<ModuleKey>("dealhost");
  const activeModule = useMemo(
    () => dealModules.find((module) => module.key === activeKey) ?? dealModules[0],
    [activeKey],
  );
  const activeProfile = moduleControlProfiles[activeModule.key];
  const nextAction = useMemo(
    () =>
      [...operatorActions].sort((left, right) => actionPriorityRank[left.priority] - actionPriorityRank[right.priority])[0] ??
      null,
    [],
  );
  const nextActionModule = nextAction ? dealModules.find((module) => module.key === nextAction.moduleKey) : undefined;

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="DEALInterface navigation">
        <a className="brand" href="#top" aria-label="DEALInterface home">
          <span className="brand__mark">DI</span>
          <span>
            <strong>DEALInterface</strong>
            <small>Unified control plane</small>
          </span>
        </a>

        <nav className="module-nav" aria-label="Module navigation">
          {dealModules.map((module) => (
            <button
              className={module.key === activeKey ? "module-nav__item module-nav__item--active" : "module-nav__item"}
              key={module.key}
              onClick={() => setActiveKey(module.key)}
              type="button"
            >
              <span style={{ background: module.accent }} aria-hidden="true" />
              {module.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <span>Next operator action</span>
          {nextAction ? (
            <>
              <strong>{nextAction.title}</strong>
              <p>
                {nextActionModule?.name} / {nextAction.due}. {nextAction.detail}
              </p>
            </>
          ) : (
            <>
              <strong>No pending action</strong>
              <p>All operator queues are clear across the current control plane.</p>
            </>
          )}
        </div>
      </aside>

      <main className="main-surface" id="top">
        <section className="hero">
          <div className="hero__content reveal" style={{ "--order": 0 } as CSSProperties}>
            <span className="section-kicker">Suite management</span>
            <h1>Manage DEALHost, DEALIot and DEALData from one deliberate interface.</h1>
            <p>
              DEALInterface keeps product modules independent while centralizing identity, operations,
              governance and support workflows in a single console.
            </p>
            <div className="hero__actions" aria-label="Primary actions">
              <a href="#modules">Inspect modules</a>
              <a href="#control-plane">Open workflows</a>
            </div>
          </div>

          <div className="hero-console reveal" style={{ "--order": 1 } as CSSProperties}>
            <span>Control plane readiness</span>
            <strong>84%</strong>
            <p>Shared access, audit and operations surfaces are ready for API integration.</p>
            <div className="hero-console__bar" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>

        <MetricsGrid metrics={dashboardMetrics} />

        <section className="module-section" id="modules" aria-labelledby="modules-title">
          <div className="section-heading">
            <span className="section-kicker">Modules</span>
            <h2 id="modules-title">Product surfaces remain isolated; management stays unified.</h2>
          </div>
          <div className="module-grid">
            {dealModules.map((module, index) => (
              <ModuleCard
                isActive={module.key === activeKey}
                key={module.key}
                module={module}
                onSelect={setActiveKey}
                order={index + 2}
              />
            ))}
          </div>
        </section>

        <section className="dashboard-grid" id="control-plane">
          <ModuleDetail module={activeModule} runtime={moduleRuntimeConfig[activeModule.key]} />
          <OperatorQueue
            actions={operatorActions}
            activeKey={activeKey}
            modules={dealModules}
            onSelectModule={setActiveKey}
          />
          <ControlProfile module={activeModule} profile={activeProfile} />
          <TopologyMap activeKey={activeKey} modules={dealModules} />
          <CommandCenter />
          <ActivityFeed items={activityFeed} />
        </section>
      </main>
    </div>
  );
}

