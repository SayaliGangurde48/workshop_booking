import React from "react";

import { Card } from "../components/ui/Card";
import { ErrorNotice, FormField } from "../components/ui/FormField";
import { PageHeader } from "../components/ui/PageHeader";
import { Table } from "../components/ui/Table";

export function ProfilePage({ page, meta }) {
  if (page.mode === "view") {
    return (
      <>
        <PageHeader
          title={page.title}
          subtitle="Review contact details and recent workshop activity in one place."
        />

        <section className="split-layout">
          <Card title="Coordinator details" description="Key contact and institution information.">
            <dl className="detail-list">
              {page.details.map((detail) => (
                <div className="detail-row" key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          </Card>

          <Card title="Workshop history" description="Previous or pending workshops connected to this coordinator.">
            <Table
              columns={[
                { key: "instructor", label: "Instructor", render: (row) => row.instructor || <span className="badge badge-warning">Pending</span> },
                { key: "date", label: "Date", render: (row) => row.date },
                { key: "workshop_type", label: "Workshop type", render: (row) => row.workshop_type },
              ]}
              rows={page.workshops}
              emptyMessage="No workshops recorded yet."
            />
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit profile"
        subtitle="Keep your contact details and institution information current so workshop communication stays reliable."
      />

      <Card title="Profile details" description="Update your personal and institution information in one place.">
        <ErrorNotice errors={page.form.non_field_errors} />
        <form action={meta.formAction} method="post" className="section-stack">
          <input type="hidden" name="csrfmiddlewaretoken" value={meta.csrfToken} />
          <div className="form-grid">
            {page.form.fields.map((field) => (
              <div key={field.name} className={field.name === "institute" ? "field-span-2" : ""}>
                <FormField field={field} />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Save profile</button>
            <a href={page.cancel_url} className="btn btn-outline-secondary">Cancel</a>
          </div>
        </form>
      </Card>
    </>
  );
}
