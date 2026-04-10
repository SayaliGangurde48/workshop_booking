import React from "react";

import { Card } from "../components/ui/Card";
import { ErrorNotice, FormField } from "../components/ui/FormField";
import { PageHeader } from "../components/ui/PageHeader";
import { StatusBadge } from "../components/ui/Table";

export function WorkshopDetailsPage({ page, meta }) {
  return (
    <>
      <PageHeader
        title={page.title}
        subtitle="Review the workshop timeline, coordinator details, and discussion history."
      />

      <section className="split-layout">
        <Card title="Workshop summary" description="The current workshop status and ownership at a glance.">
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Workshop type</dt>
              <dd><a href={page.workshop_type_url}>{page.title}</a></dd>
            </div>
            <div className="detail-row">
              <dt>Date</dt>
              <dd>{page.date}</dd>
            </div>
            <div className="detail-row">
              <dt>Coordinator</dt>
              <dd>{page.coordinator_name}</dd>
            </div>
            <div className="detail-row">
              <dt>Status</dt>
              <dd><StatusBadge status={page.status} /></dd>
            </div>
            {page.instructor_name ? (
              <div className="detail-row">
                <dt>Instructor</dt>
                <dd>{page.instructor_name}</dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <Card title="Post a comment" description="Keep workshop communication attached to the record for easier follow-up.">
          <ErrorNotice errors={page.form.non_field_errors} />
          <form method="post" action={meta.formAction} className="section-stack">
            <input type="hidden" name="csrfmiddlewaretoken" value={meta.csrfToken} />
            {page.form.fields.map((field) => <FormField key={field.name} field={field} />)}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Post comment</button>
            </div>
          </form>
        </Card>
      </section>

      <Card title="Comments" description="Conversation history stays attached to the workshop for easier tracking later.">
        <div className="section-stack">
          {page.comments.length ? page.comments.map((comment) => (
            <article className="list-card" key={comment.id}>
              <div className="header-actions mb-3">
                <div>
                  <h4 className="mb-1">
                    <a href={comment.profile_url}>{comment.author}</a>
                  </h4>
                  <p className="muted-text mb-0">{comment.created_date}</p>
                </div>
                {!comment.public ? <span className="badge badge-dark">Hidden</span> : null}
              </div>
              <p className="mb-0">{comment.comment}</p>
            </article>
          )) : (
            <p className="muted-text mb-0">No comments have been added yet.</p>
          )}
        </div>
      </Card>
    </>
  );
}
