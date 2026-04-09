import React from "react";

export function PageIntro({ title, description }) {
  if (!title && !description) {
    return null;
  }

  return (
    <section className="page-header">
      <div className="page-header-copy">
        {title ? <h1>{title}</h1> : null}
        {description ? <p className="page-header-subtitle">{description}</p> : null}
      </div>
    </section>
  );
}
