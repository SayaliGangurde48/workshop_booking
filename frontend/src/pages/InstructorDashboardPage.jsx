import React, { useState } from "react";

import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge, Table } from "../components/ui/Table";

export function InstructorDashboardPage({ page, meta }) {
  const [expandedWorkshopId, setExpandedWorkshopId] = useState(null);

  if (page.empty) {
    return (
      <EmptyState
        title="Welcome"
        description="New proposals and confirmed workshops will appear here as soon as coordinators start sending requests."
        actions={[
          <a key="types" href={page.types_url} className="btn btn-primary">Review workshop types</a>,
        ]}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Workshop Status"
        subtitle="Review confirmed sessions, respond to new requests, and update dates when needed."
      />

      <Card title="Accepted workshops" description="Confirmed sessions with coordinator details and quick access to date changes.">
        <Table
          columns={[
            { key: "coordinator_name", label: "Coordinator", render: (row) => <a href={row.coordinator_profile_url}>{row.coordinator_name}</a> },
            { key: "institute", label: "Institute", render: (row) => row.institute },
            { key: "title", label: "Workshop", render: (row) => row.title },
            {
              key: "date",
              label: "Date",
              render: (row) => (
                <div>
                  <div>{row.date}</div>
                  {row.can_change_date ? (
                    <button
                      type="button"
                      className="btn btn-light btn-sm mt-2"
                      onClick={() => setExpandedWorkshopId(expandedWorkshopId === row.id ? null : row.id)}
                    >
                      Change date
                    </button>
                  ) : null}
                  {expandedWorkshopId === row.id ? (
                    <form method="post" action={row.change_date_url} className="inline-form mt-2">
                      <input type="hidden" name="csrfmiddlewaretoken" value={meta.csrfToken} />
                      <input type="date" name="new_date" defaultValue={row.date_iso} className="form-control" />
                      <button type="submit" className="btn btn-outline-secondary btn-sm mt-2">Save</button>
                    </form>
                  ) : null}
                </div>
              ),
            },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={page.accepted}
          emptyMessage="No accepted workshops yet."
        />
      </Card>

      <Card title="Requests waiting for your response" description="Review new proposals and accept them when your schedule allows.">
        <Table
          columns={[
            { key: "coordinator_name", label: "Coordinator", render: (row) => <a href={row.coordinator_profile_url}>{row.coordinator_name}</a> },
            { key: "institute", label: "Institute", render: (row) => row.institute },
            { key: "title", label: "Workshop", render: (row) => row.title },
            { key: "date", label: "Date", render: (row) => row.date },
            { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "action", label: "Action", render: (row) => <div className="table-action"><a href={row.accept_url} className="btn btn-primary btn-sm">Accept request</a></div> },
          ]}
          rows={page.pending}
          emptyMessage="No pending requests right now."
        />
      </Card>
    </>
  );
}
