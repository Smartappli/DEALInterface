const commandGroups = [
  {
    title: "Access",
    items: ["Tenant onboarding", "Role approvals", "Service accounts"],
  },
  {
    title: "Operations",
    items: ["Incident queue", "SLA checks", "Release windows"],
  },
  {
    title: "Governance",
    items: ["Audit exports", "Usage reports", "Policy exceptions"],
  },
];

export function CommandCenter() {
  return (
    <section className="panel command-center" aria-labelledby="command-title">
      <div className="panel__header">
        <span className="section-kicker">Control plane</span>
        <h2 id="command-title">Shared management workflows</h2>
      </div>
      <div className="command-grid">
        {commandGroups.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
