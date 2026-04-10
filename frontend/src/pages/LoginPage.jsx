import React from "react";

import { AuthPage } from "./AuthPage";

export function LoginPage({ page, meta }) {
  return (
    <AuthPage
      title="Sign in"
      subtitle="Sign in to review requests, confirmations, and workshop updates."
      formDescription="Enter your username and password to manage proposals, confirmations, and workshop updates."
      footer={<p className="mb-0">New here? <a href="/workshop/register/">Create a coordinator account</a></p>}
      submitLabel="Sign in"
      secondaryAction={<a href="/reset/password_reset/" className="btn btn-outline-secondary">Forgot password</a>}
      action={meta.formAction}
      csrfToken={meta.csrfToken}
      form={page.form}
    />
  );
}
