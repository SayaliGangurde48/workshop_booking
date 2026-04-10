import React from "react";

import { AuthPage } from "./AuthPage";

export function RegisterPage({ page, meta }) {
  return (
    <AuthPage
      title="Create account"
      subtitle="Create a coordinator account to request workshops and track updates."
      formDescription="Fill in your details to register and start planning workshop requests."
      footer={null}
      submitLabel="Create account"
      secondaryAction={<a href="/workshop/login/" className="btn btn-outline-secondary">I already have an account</a>}
      action={meta.formAction}
      csrfToken={meta.csrfToken}
      form={page.form}
    />
  );
}
