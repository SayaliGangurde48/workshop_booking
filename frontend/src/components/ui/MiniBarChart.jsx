import React from "react";

export function MiniBarChart({ labels, values }) {
  if (!labels?.length || !values?.length) {
    return <div className="chart-empty"><p className="mb-0">No chart data yet.</p></div>;
  }

  const max = Math.max(...values, 1);

  return (
    <div className="mini-chart">
      {labels.map((label, index) => {
        const value = values[index] || 0;
        const height = `${Math.max((value / max) * 100, value > 0 ? 16 : 0)}%`;

        return (
          <div className="mini-chart-item" key={`${label}-${index}`}>
            <div className="mini-chart-bar-wrap">
              <span className="mini-chart-value">{value}</span>
              <div className="mini-chart-bar" style={{ height }} />
            </div>
            <span className="mini-chart-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
