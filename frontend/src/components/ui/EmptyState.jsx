import React from "react";

export function EmptyState({ title, description, actions }) {
  return (
    <section className="notice-card">
      <h2>{title}</h2>
      <p className="section-description mb-0">{description}</p>
      <div className="form-actions mt-4">{actions}</div>
    </section>
  );
}
