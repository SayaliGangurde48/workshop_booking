import React from "react";

import { Card } from "../components/ui/Card";
import { FormField } from "../components/ui/FormField";
import { MiniBarChart } from "../components/ui/MiniBarChart";
import { PageHeader } from "../components/ui/PageHeader";
import { Pagination, Table } from "../components/ui/Table";

export function StatisticsPage({ page, meta }) {
  const count = page.pagination?.count || 0;

  return (
    <>
      <PageHeader
        title="Workshop Statistics"
        subtitle="Browse upcoming workshops, filter the results, and compare coverage at a glance."
      />

      <section className="stats-layout">
        <Card title="Filters" description="Filter the list by date, workshop type, state, or personal involvement.">
          <form method="get" action={meta.formAction} className="stats-filter-grid">
            {page.form.fields.map((field) => (
              field.name === "show_workshops" ? (
                <div className="field-span-2" key={field.name}>
                  <FormField field={field} />
                </div>
              ) : (
                <div key={field.name}>
                  <FormField field={field} />
                </div>
              )
            ))}
            <div className="form-actions field-span-2">
              <button type="submit" className="btn btn-primary">Apply filters</button>
              <button type="submit" className="btn btn-outline-info" name="download" value="download">Download CSV</button>
              <a href={meta.formAction} className="btn btn-outline-secondary">Clear</a>
            </div>
          </form>
        </Card>

        <Card
          title="Insights"
          description={`${count} workshop${count === 1 ? "" : "s"}, ${page.charts.states.labels.length} state${page.charts.states.labels.length === 1 ? "" : "s"}, ${page.charts.types.labels.length} workshop type${page.charts.types.labels.length === 1 ? "" : "s"}.`}
        >
          <div className="chart-grid compact">
            <div className="chart-card">
              <h3>State coverage</h3>
              <MiniBarChart labels={page.charts.states.labels} values={page.charts.states.values} />
            </div>
            <div className="chart-card">
              <h3>Workshop types</h3>
              <MiniBarChart labels={page.charts.types.labels} values={page.charts.types.values} />
            </div>
          </div>
        </Card>
      </section>

      <Card title="Workshop results" description="Filtered workshop data stays easy to scan and compare.">
        <Table
          columns={[
            { key: "index", label: "Sr no.", render: (row) => row.index },
            { key: "coordinator", label: "Coordinator", render: (row) => row.coordinator },
            { key: "institute", label: "Institute", render: (row) => row.institute },
            { key: "instructor", label: "Instructor", render: (row) => row.instructor },
            { key: "workshop", label: "Workshop", render: (row) => row.workshop },
            { key: "date", label: "Date", render: (row) => row.date },
          ]}
          rows={page.results}
          emptyMessage="No workshops match the selected filters."
        />
        <div className="mt-4">
          <Pagination pagination={page.pagination} />
        </div>
      </Card>
    </>
  );
}
