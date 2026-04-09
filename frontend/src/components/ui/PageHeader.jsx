import React from "react";

export function PageHeader({ title, subtitle }) {
  return (
    <section className="page-header">
      <div className="page-header-copy">
        {title ? <h1>{title}</h1> : null}
        {subtitle ? <p className="page-header-subtitle">{subtitle}</p> : null}
      </div>
    </section>
  );
}
