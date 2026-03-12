import React from "react";

// StatCard accepts these props:
// - title: label shown at the top (e.g. "Total Employees")
// - value: main big number or text to highlight (e.g. "20" or "₹87,950")
// - subtitle: smaller helper text below the value (e.g. "19 active")
// - icon: emoji icon shown next to the title
// - color: accent color used for the top border, icon, and value text
const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    // Top border color changes per card to visually distinguish each metric
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>

      {/* Card header: icon + metric title */}
      <div className="stat-card-header">
        <span className="stat-icon" style={{ color }}>{icon}</span>
        <span className="stat-title">{title}</span>
      </div>

      {/* Main value displayed prominently */}
      <div className="stat-value" style={{ color }}>{value}</div>

      {/* Optional subtitle — only renders if provided */}
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}

    </div>
  );
};

export default StatCard;