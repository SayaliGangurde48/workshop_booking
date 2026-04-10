import React from "react";

import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

export function WorkshopTypeDetailsPage({ page }) {
  return (
    <>
      <PageHeader
        title={page.name}
        subtitle="Review the workshop summary, expected duration, attachments, and terms before planning a request."
      />

      <section className="split-layout">
        <Card title="Workshop summary" description="Core information coordinators and instructors need before taking action.">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Workshop name</dt>
              <dd>{page.name}</dd>
            </div>
            <div className="detail-row">
              <dt>Duration</dt>
              <dd>{page.duration} day{page.duration === 1 ? "" : "s"}</dd>
            </div>
            <div className="detail-row">
              <dt>Description</dt>
              <dd>{page.description}</dd>
            </div>
            <div className="detail-row">
              <dt>Terms and conditions</dt>
              <dd>{page.terms}</dd>
            </div>
          </dl>
        </Card>

        <Card title="Attachments" description="Reference material that supports planning and workshop preparation.">
          {page.attachments.length ? (
            <div className="section-stack">
              {page.attachments.map((attachment) => (
                <a key={attachment.url} href={attachment.url} className="attachment-card">
                  <strong>{attachment.label}</strong>
                  <span>{attachment.filename}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="muted-text mb-0">No attachments have been uploaded for this workshop type yet.</p>
          )}
        </Card>
      </section>
    </>
  );
}
