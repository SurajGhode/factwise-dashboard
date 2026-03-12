import React, { useState, useMemo } from "react";
import employeesRaw from "./data/employees.json";
import StatCard from "./components/StatCard";
import EmployeeGrid from "./components/EmployeeGrid";
import "./App.css";

const DEPARTMENTS = ["All", "Engineering", "Marketing", "Sales", "HR", "Finance"];

export default function App() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // ── Derived stats ─────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = employeesRaw.filter((e) => e.isActive);
    const avgSalary = Math.round(employeesRaw.reduce((s, e) => s + e.salary, 0) / employeesRaw.length);
    const avgRating = (employeesRaw.reduce((s, e) => s + e.performanceRating, 0) / employeesRaw.length).toFixed(2);
    const totalProjects = employeesRaw.reduce((s, e) => s + e.projectsCompleted, 0);
    return { total: employeesRaw.length, active: active.length, avgSalary, avgRating, totalProjects };
  }, []);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return employeesRaw.filter((e) => {
      const name = `${e.firstName} ${e.lastName}`.toLowerCase();
      const matchSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        e.position.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase());
      const matchDept = department === "All" || e.department === department;
      const matchStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" ? e.isActive : !e.isActive);
      return matchSearch && matchDept && matchStatus;
    });
  }, [search, department, statusFilter]);

  // ── Dept breakdown for sidebar ─────────────────────────────────────────────
  const deptBreakdown = useMemo(() => {
    const map = {};
    employeesRaw.forEach((e) => {
      map[e.department] = (map[e.department] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, []);

  return (
    <div className="app">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <span className="logo-mark">FW</span>
            <span className="logo-text">FactWise</span>
          </div>
          <span className="header-divider" />
          <span className="header-title">People Dashboard</span>
        </div>
        <div className="header-right">
          <span className="header-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </header>

      <div className="layout">
        {/* ── Sidebar ────────────────────────────────────────── */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">Departments</p>
            {deptBreakdown.map(([dept, count]) => (
              <button
                key={dept}
                className={`dept-item ${department === dept ? "dept-item-active" : ""}`}
                onClick={() => setDepartment(department === dept ? "All" : dept)}
              >
                <span>{dept}</span>
                <span className="dept-count">{count}</span>
              </button>
            ))}
            {department !== "All" && (
              <button className="clear-filter" onClick={() => setDepartment("All")}>
                ✕ Clear filter
              </button>
            )}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">Top Performers</p>
            {employeesRaw
              .sort((a, b) => b.performanceRating - a.performanceRating)
              .slice(0, 5)
              .map((e) => (
                <div key={e.id} className="top-performer">
                  <div className="tp-info">
                    <span className="tp-name">{e.firstName} {e.lastName}</span>
                    <span className="tp-dept">{e.department}</span>
                  </div>
                  <span className="tp-rating">⭐ {e.performanceRating}</span>
                </div>
              ))}
          </div>
        </aside>

        {/* ── Main Content ────────────────────────────────────── */}
        <main className="main">
          {/* Stat Cards */}
          <div className="stats-row">
            <StatCard title="Total Employees" value={stats.total} subtitle={`${stats.active} active`} icon="👥" color="#3b82f6" />
            <StatCard title="Avg. Salary" value={` ₹${stats.avgSalary.toLocaleString("en-IN")}`} subtitle="across all roles" icon="💰" color="#22c55e" />
            <StatCard title="Avg. Rating" value={`${stats.avgRating} / 5`} subtitle="performance score" icon="📊" color="#f59e0b" />
            <StatCard title="Projects Done" value={stats.totalProjects} subtitle="total completed" icon="✅" color="#8b5cf6" />
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by name, position, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            <div className="filter-group">
              {["All", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  className={`filter-pill ${statusFilter === s ? "filter-pill-active" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            <select
              className="dept-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Grid */}
          <EmployeeGrid rowData={filtered} />
        </main>
      </div>
    </div>
  );
}
