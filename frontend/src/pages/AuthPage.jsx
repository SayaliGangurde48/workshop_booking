import React from "react";

import { Card } from "../components/ui/Card";
import { ErrorNotice, FormField } from "../components/ui/FormField";

export function AuthPage({
  title,
  subtitle,
  formDescription,
  footer,
  submitLabel,
  secondaryAction,
  action,
  csrfToken,
  form,
}) {
  return (
    <section className="auth-wrap">
      <div className="auth-heading">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <Card className="auth-card auth-card-elevated">
        {formDescription ? <p className="section-description">{formDescription}</p> : null}
        <ErrorNotice errors={form.non_field_errors} />
        <form method="post" action={action} className="section-stack">
          <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken} />
          <div className="form-grid">
            {form.fields.map((field) => (
              <div
                key={field.name}
                className={field.name === "institute" || field.name === "description" || field.name === "terms_and_conditions" ? "field-span-2" : ""}
              >
                <FormField field={field} />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">{submitLabel}</button>
            {secondaryAction}
          </div>
        </form>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </Card>
    </section>
  );
}
