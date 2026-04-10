import React, { useState } from "react";

import { Card } from "../components/ui/Card";
import { ErrorNotice, FormField } from "../components/ui/FormField";
import { PageHeader } from "../components/ui/PageHeader";

export function ProposeWorkshopPage({ page, meta }) {
  const workshopField = page.form.fields.find((field) => field.name === "workshop_type");
  const [selectedWorkshopType, setSelectedWorkshopType] = useState(workshopField?.value || "");

  return (
    <>
      <PageHeader
        title="Propose a Workshop"
        subtitle="Choose a workshop type, select a date, and submit your request."
      />

      <section className="split-layout">
        <Card title="Proposal form" description="Use the form below to request a workshop and preferred date.">
          <ErrorNotice errors={page.form.non_field_errors} />
          <form method="post" action={meta.formAction} className="section-stack">
            <input type="hidden" name="csrfmiddlewaretoken" value={meta.csrfToken} />
            {page.form.fields.map((field) => {
              if (field.name === "workshop_type") {
                return (
                  <div key={field.name} onChange={(event) => setSelectedWorkshopType(event.target.value)}>
                    <FormField field={field} />
                  </div>
                );
              }

              return <FormField key={field.name} field={field} />;
            })}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Submit proposal</button>
              <a href={page.status_url} className="btn btn-outline-secondary">Back to status</a>
            </div>
          </form>
        </Card>

        <Card title="Workshop details" description="Check the selected workshop requirements before you submit the request.">
          <div className="detail-list">
            <div className="detail-row">
              <dt>Workshop</dt>
              <dd>{workshopField?.options?.find((option) => option.value === selectedWorkshopType)?.label || "Select a workshop type"}</dd>
            </div>
            <div className="detail-row">
              <dt>Terms</dt>
              <dd>{page.terms_by_workshop_type?.[selectedWorkshopType] || "Terms and conditions will appear here once a workshop type is selected."}</dd>
            </div>
            <div className="detail-row">
              <dt>Reference</dt>
              <dd><a href={page.types_url}>Browse workshop types</a></dd>
            </div>
          </div>
        </Card>
      </section>
    </>
  );
}
