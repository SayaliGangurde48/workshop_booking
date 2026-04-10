import React from "react";

import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { MiniBarChart } from "../components/ui/MiniBarChart";
import { PageHeader } from "../components/ui/PageHeader";

export function TeamStatsPage({ page }) {
  if (!page.teams?.length) {
    return (
      <EmptyState
        title="No teams available"
        description="Join or create a team to start comparing workshop activity across instructors."
        actions={[]}
      />
    );
  }

  return (
    <>
      <PageHeader
        title={page.selected_team_label}
        subtitle="Compare workshop activity across instructors in the selected team."
      />

      <section className="split-layout">
        <Card title="Teams" description="Switch between teams to review instructor activity.">
          <div className="team-list">
            {page.teams.map((team) => (
              <a
                key={team.id}
                href={team.href}
                className={`team-link ${team.active ? "is-active" : ""}`}
                aria-current={team.active ? "page" : undefined}
              >
                <span>{team.label}</span>
                <small>{team.member_count} member{team.member_count === 1 ? "" : "s"}</small>
              </a>
            ))}
          </div>
        </Card>

        <Card title="Activity chart" description="Workshop counts for each instructor in the selected team.">
          <MiniBarChart labels={page.chart.labels} values={page.chart.values} />
        </Card>
      </section>

      <Card title="Member summary" description="A quick view of workshop activity for each instructor in this team.">
        <div className="team-member-grid">
          {page.members.map((member) => (
            <article className="list-card" key={member.name}>
              <p className="mini-kicker">Instructor</p>
              <h3>{member.name}</h3>
              <div className="team-member-meta">
                <strong>{member.count}</strong>
                <span>workshop{member.count === 1 ? "" : "s"}</span>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </>
  );
}
