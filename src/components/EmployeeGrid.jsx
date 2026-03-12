import React, { useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, provideGlobalGridOptions } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: "legacy" });

// ── Custom Cell Renderers ─────────────────────────────────────────────────────
const StatusBadge = ({ value }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11.5, fontWeight: 600,
    background: value ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.1)",
    color: value ? "#22c55e" : "#ef4444",
  }}>
    <span style={{ fontSize: 7 }}>●</span>
    {value ? "Active" : "Inactive"}
  </span>
);

const RatingBar = ({ value }) => {
  if (value == null) return null;
  const pct = (value / 5) * 100;
  const color = value >= 4.5 ? "#22c55e" : value >= 4.0 ? "#3b82f6" : value >= 3.5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div style={{ flex: 1, height: 6, background: "#2a2f3d", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 30, fontFamily: "monospace" }}>
        {value.toFixed(1)}
      </span>
    </div>
  );
};

const SalaryCell = ({ value }) => (
  <span style={{ fontFamily: "monospace", fontWeight: 600, color: "#22c55e", fontSize: 13 }}>
     ₹{value.toLocaleString()}
  </span>
);

const DeptBadge = ({ value }) => {
  const colors = {
    Engineering: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
    Marketing:   { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
    Sales:       { bg: "rgba(249,115,22,0.15)", text: "#fb923c" },
    HR:          { bg: "rgba(34,197,94,0.15)",  text: "#4ade80" },
    Finance:     { bg: "rgba(234,179,8,0.15)",  text: "#facc15" },
  };
  const c = colors[value] || { bg: "rgba(156,163,175,0.15)", text: "#9ca3af" };
  return (
    <span style={{
      background: c.bg, color: c.text,
      padding: "3px 10px", borderRadius: 6,
      fontSize: 12, fontWeight: 600, whiteSpace: "nowrap"
    }}>
      {value}
    </span>
  );
};

const SkillsTags = ({ value }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "10px 0" }}>
    {(value || []).map((s) => (
      <span key={s} style={{
        padding: "2px 8px", background: "#1e2330",
        border: "1px solid #363c4f", borderRadius: 5,
        fontSize: 11, color: "#8b909e", whiteSpace: "nowrap"
      }}>{s}</span>
    ))}
  </div>
);

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `hsl(${Math.abs(hash) % 360}, 55%, 45%)`;
}

const NameCell = ({ data }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 34, height: 34, minWidth: 34, borderRadius: "50%",
      background: stringToColor(`${data.firstName}${data.lastName}`),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 12, fontWeight: 700, color: "white",
    }}>
      {data.firstName[0]}{data.lastName[0]}
    </div>
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#e8eaf0", lineHeight: 1.3 }}>
        {data.firstName} {data.lastName}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f70" }}>{data.email}</div>
    </div>
  </div>
);

// ── EmployeeGrid ──────────────────────────────────────────────────────────────
const EmployeeGrid = ({ rowData }) => {
  const gridRef = useRef(null);

  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    filter: true,
  }), []);

  const columnDefs = useMemo(() => [
    {
      headerName: "Employee", field: "firstName", width: 260, pinned: "left",
      cellRenderer: NameCell, filter: "agTextColumnFilter",
      valueGetter: (p) => `${p.data.firstName} ${p.data.lastName}`,
    },
    { headerName: "Department", field: "department", width: 155, cellRenderer: DeptBadge, filter: "agSetColumnFilter" },
    { headerName: "Position", field: "position", width: 200, filter: "agTextColumnFilter" },
    { headerName: "Location", field: "location", width: 140, filter: "agSetColumnFilter" },
    { headerName: "Salary", field: "salary", width: 140, cellRenderer: SalaryCell, filter: "agNumberColumnFilter", sort: "desc" },
    { headerName: "Performance", field: "performanceRating", width: 190, cellRenderer: RatingBar, filter: "agNumberColumnFilter" },
    { headerName: "Projects", field: "projectsCompleted", width: 110, filter: "agNumberColumnFilter", cellStyle: { textAlign: "center", fontWeight: 600, color: "#e8eaf0" } },
    { headerName: "Age", field: "age", width: 90, filter: "agNumberColumnFilter", cellStyle: { textAlign: "center", color: "#8b909e" } },
    {
      headerName: "Hire Date", field: "hireDate", width: 140, filter: "agDateColumnFilter",
      valueFormatter: (p) => new Date(p.value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }),
      cellStyle: { color: "#8b909e" },
    },
    { headerName: "Skills", field: "skills", width: 290, cellRenderer: SkillsTags, filter: false, sortable: false, autoHeight: true },
    { headerName: "Manager", field: "manager", width: 170, filter: "agTextColumnFilter", valueFormatter: (p) => p.value || "—", cellStyle: { color: "#8b909e" } },
    {
      headerName: "Status", field: "isActive", width: 120, cellRenderer: StatusBadge, filter: "agSetColumnFilter",
      filterParams: { values: [true, false], valueFormatter: (p) => (p.value ? "Active" : "Inactive") },
    },
  ], []);

  const handleExport = useCallback(() => {
    gridRef.current?.api?.exportDataAsCsv({ fileName: "employees_export.csv" });
  }, []);

  return (
    <div className="grid-wrapper">
      <div className="grid-toolbar">
        <span className="grid-count">{rowData.length} employees</span>
        <button className="export-btn" onClick={handleExport}>⬇ Export CSV</button>
      </div>
      <div className="ag-theme-quartz-dark grid-container">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20]}
          rowHeight={64}
          headerHeight={48}
          animateRows={true}
          suppressMovableColumns={false}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};

export default EmployeeGrid;