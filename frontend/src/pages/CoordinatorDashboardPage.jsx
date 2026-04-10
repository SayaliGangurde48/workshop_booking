import React from "react";

import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge, Table } from "../components/ui/Table";

export function CoordinatorDashboardPage({ page }) {
  if (page.empty) {
    return (
      <EmptyState
        title="Welcome"
        description="Your requests and confirmed workshops will appear here once you start booking sessions."
        actions={[
          <a key="propose" href={page.propose_url} className="btn btn-primary">Propose a workshop</a>,
          <a key="types" href={page.types_url} className="btn btn-outline-secondary">Browse workshop types</a>,
        ]}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="My Workshops"
        subtitle="Track confirmed sessions and pending proposals from one place."
      />

      <Card title="Accepted workshops" description="Confirmed sessions with instructor details and scheduled dates.">
        <Table
          columns={[
            { key: "title", label: "Workshop", render: (row) => <a href={row.detail_url}>{row.title}</a> },
            { key: "instructor_name", label: "Instructor", render: (row) => row.instructor_name },
            { key: "date", label: "Date", render: (row) => row.date },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={page.accepted}
          emptyMessage="No accepted workshops yet."
        />
      </Card>

      <Card
        title="Pending proposals"
        description="Requests that have been sent and are still waiting for confirmation."
        action={<a href={page.propose_url} className="btn btn-primary">Propose another workshop</a>}
      >
        <Table
          columns={[
            { key: "title", label: "Workshop", render: (row) => <a href={row.detail_url}>{row.title}</a> },
            { key: "date", label: "Date", render: (row) => row.date },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={page.pending}
          emptyMessage="No pending proposals."
        />
      </Card>
    </>
  );
}
