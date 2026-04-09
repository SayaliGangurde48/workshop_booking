import React from "react";

import { buildPageHref } from "../../lib/dom";

export function StatusBadge({ status }) {
  const statusClass = status === "Accepted" ? "badge-success" : "badge-warning";
  return <span className={`badge ${statusClass}`}>{status}</span>;
}

export function Pagination({ pagination }) {
  if (!pagination || pagination.num_pages <= 1) {
    return null;
  }

  return (
    <nav className="paginator-wrap" aria-label="Pagination">
      <ul className="pagination pagination-sm">
        {pagination.has_previous ? (
          <li className="page-item">
            <a className="page-link" href={buildPageHref(pagination.previous_page_number)}>Previous</a>
          </li>
        ) : null}
        <li className="page-item active">
          <span className="page-link">{pagination.number}</span>
        </li>
        {pagination.has_next ? (
          <li className="page-item">
            <a className="page-link" href={buildPageHref(pagination.next_page_number)}>Next</a>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}

export function Table({ columns, rows, emptyMessage }) {
  return (
    <div className="data-table">
      <div className="mobile-table-list" aria-hidden="true">
        {rows.length ? rows.map((row, rowIndex) => (
          <article className="mobile-table-card" key={row.id || rowIndex}>
            {columns.map((column) => (
              <div className="mobile-table-row" key={column.key}>
                <span className="mobile-table-label">{column.label}</span>
                <div className="mobile-table-value">{column.render(row)}</div>
              </div>
            ))}
          </article>
        )) : (
          <div className="muted-text mobile-table-empty">{emptyMessage}</div>
        )}
      </div>

      <div className="data-table-scroll">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => <th key={column.key}>{column.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((column) => (
                  <td key={column.key} data-label={column.label}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            )) : (
              <tr className="table-empty-state">
                <td colSpan={columns.length} className="muted-text empty-table-row">{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
