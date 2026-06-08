import type { CSSProperties } from "react";
import type { DealModule, ModuleControlProfile } from "../types";

interface ControlProfileProps {
  module: DealModule;
  profile: ModuleControlProfile;
}

export function ControlProfile({ module, profile }: ControlProfileProps) {
  const profileFacts = [
    { label: "Environment", value: profile.environment },
    { label: "Release window", value: profile.releaseWindow },
    { label: "SLA target", value: profile.slaTarget },
    { label: "Escalation", value: profile.escalation },
  ];

  return (
    <section
      className="panel control-profile"
      style={{ "--accent": module.accent } as CSSProperties}
      aria-labelledby="control-profile-title"
    >
      <div className="panel__header">
        <div>
          <span className="section-kicker">Control profile</span>
          <h2 id="control-profile-title">{module.name} operating model</h2>
        </div>
        <span className="control-profile__owner">{module.owner}</span>
      </div>

      <div className="control-profile__facts">
        {profileFacts.map((fact) => (
          <article key={fact.label}>
            <span>{fact.label}</span>
            <strong>{fact.value}</strong>
          </article>
        ))}
      </div>

      <div className="workflow-list" aria-label={`${module.name} workflows`}>
        {profile.workflows.map((workflow) => (
          <article className="workflow-card" key={workflow.id}>
            <div>
              <span>{workflow.cadence}</span>
              <h3>{workflow.title}</h3>
              <p>{workflow.description}</p>
            </div>
            <div className="workflow-card__footer">
              <strong>{workflow.automation}</strong>
              <div aria-label="Required roles">
                {workflow.requiredRoles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
