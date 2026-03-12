import React from "react";

const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
      <div className="stat-card-header">
        <span className="stat-icon" style={{ color }}>{icon}</span>
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value" style={{ color }}>{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  );
};

export default StatCard;
