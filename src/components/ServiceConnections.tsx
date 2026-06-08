import type { ModuleRuntimeConfig } from "../config/moduleRegistry";
import type { DealModule, ModuleConnection, ModuleKey, ModuleProbeResult, ProbeStatus } from "../types";
import { StatusPill } from "./StatusPill";

type ConnectionMap = Partial<Record<ModuleKey, ModuleConnection>>;

interface ServiceConnectionsProps {
  activeKey: ModuleKey;
  connections: ConnectionMap;
  isRefreshing: boolean;
  modules: DealModule[];
  runtimes: Record<ModuleKey, ModuleRuntimeConfig>;
  onRefresh: () => void;
  onSelectModule: (key: ModuleKey) => void;
}

const probeStatusLabels: Record<ProbeStatus, string> = {
  online: "Online",
  degraded: "Degraded",
  attention: "Offline",
};

function formatCheckedAt(value?: string) {
  if (!value) {
    return "pending";
  }

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function countOnline(probes: ModuleProbeResult[]) {
  return probes.filter((probe) => probe.status === "online").length;
}

export function ServiceConnections({
  activeKey,
  connections,
  isRefreshing,
  modules,
  runtimes,
  onRefresh,
  onSelectModule,
}: ServiceConnectionsProps) {
  const activeModule = modules.find((module) => module.key === activeKey) ?? modules[0];
  const activeConnection = connections[activeKey];
  const activeRuntime = runtimes[activeKey];

  return (
    <section className="panel service-connections" aria-labelledby="service-connections-title">
      <div className="panel__header">
        <div>
          <span className="section-kicker">Live integrations</span>
          <h2 id="service-connections-title">Connected module APIs</h2>
        </div>
        <button className="refresh-button" disabled={isRefreshing} onClick={onRefresh} type="button">
          {isRefreshing ? "Checking" : "Refresh"}
        </button>
      </div>

      <div className="connection-overview" aria-label="Module connection overview">
        {modules.map((module) => {
          const connection = connections[module.key];
          const probeTotal = runtimes[module.key].probes.length;
          const onlineTotal = connection ? countOnline(connection.probes) : 0;

          return (
            <button
              className={`connection-tile ${module.key === activeKey ? "connection-tile--active" : ""}`}
              key={module.key}
              onClick={() => onSelectModule(module.key)}
              type="button"
            >
              <span>{module.name}</span>
              {connection ? <StatusPill status={connection.status} /> : <strong>Checking</strong>}
              <small>
                {onlineTotal}/{probeTotal} probes / {formatCheckedAt(connection?.checkedAt)}
              </small>
            </button>
          );
        })}
      </div>

      <div className="probe-list" aria-label={`${activeModule.name} live endpoints`}>
        <div className="probe-list__header">
          <h3>{activeModule.name} endpoints</h3>
          <span>{activeRuntime.apiBaseUrl}</span>
        </div>

        {(activeConnection?.probes ?? []).map((probe) => (
          <article className={`probe-card probe-card--${probe.status}`} key={probe.id}>
            <div>
              <span>{probe.label}</span>
              <a href={probe.url} rel="noreferrer" target="_blank">
                {probe.url}
              </a>
            </div>
            <div className="probe-card__status">
              <strong>{probeStatusLabels[probe.status]}</strong>
              <small>
                {probe.httpStatus ? `HTTP ${probe.httpStatus}` : "network"} /{" "}
                {probe.responseTimeMs ? `${probe.responseTimeMs} ms` : "no response"}
              </small>
            </div>
            <p>{probe.detail}</p>
          </article>
        ))}

        {!activeConnection &&
          activeRuntime.probes.map((probe) => {
            const url = `${probe.baseUrl ?? activeRuntime.apiBaseUrl}${probe.path}`;

            return (
              <article className="probe-card probe-card--pending" key={probe.id}>
                <div>
                  <span>{probe.label}</span>
                  <a href={url} rel="noreferrer" target="_blank">
                    {url}
                  </a>
                </div>
                <div className="probe-card__status">
                  <strong>Pending</strong>
                  <small>waiting for first check</small>
                </div>
                <p>The interface will probe this endpoint automatically.</p>
              </article>
            );
          })}
      </div>
    </section>
  );
}
