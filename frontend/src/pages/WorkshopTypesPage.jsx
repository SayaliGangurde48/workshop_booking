import React from "react";

import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Pagination } from "../components/ui/Table";

export function WorkshopTypesPage({ page }) {
  return (
    <>
      <PageHeader
        title="Workshop Types"
        subtitle="Browse the available workshop formats before you plan a request."
      />

      <Card
        title="Workshop catalogue"
        description="Choose a workshop to review its duration, details, and terms."
        action={page.is_instructor ? <a href={page.add_url} className="btn btn-primary">Add workshop type</a> : null}
      >
        <div className="list-card-grid">
          {page.items.map((item) => (
            <article className="list-card" key={item.id}>
              <p className="mini-kicker">Workshop format</p>
              <h3>{item.name}</h3>
              <p className="muted-text mb-3">{item.duration} day{item.duration > 1 ? "s" : ""}</p>
              <p className="mb-3">{item.description}</p>
              <div className="card-inline-meta card-inline-meta-end">
                <a href={item.detail_url} className="btn btn-outline-info">View details</a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4">
          <Pagination pagination={page.pagination} />
        </div>
      </Card>
    </>
  );
}
