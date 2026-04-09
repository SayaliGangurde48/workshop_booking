import React from "react";

export function Card({ title, description, action, children, className = "content-card" }) {
  return (
    <section className={className}>
      {(title || description || action) ? (
        <div className="header-actions mb-4">
          <div className="card-header-copy">
            {title ? <h2>{title}</h2> : null}
            {description ? <p className="section-description mb-0">{description}</p> : null}
          </div>
          {action ? <div className="card-header-action">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
