import React from "react";
import { Link } from "react-router-dom";

export const studentNav = [
  { label: "Dashboard", path: "/student-dashboard" },
  { label: "Classes", path: "/student-classes" },
  { label: "Messages", path: "/messaging" },
  { label: "Profile", path: "/profile-settings" },
];

export const teacherNav = [
  { label: "Dashboard", path: "/teacher-dashboard" },
  { label: "Students", path: "/students" },
  { label: "Messages", path: "/messaging" },
  { label: "Profile", path: "/profile-settings" },
];

export const coachingNav = [
  { label: "Dashboard", path: "/coaching-dashboard" },
  { label: "Teachers", path: "/teachers" },
  { label: "Students", path: "/students" },
  { label: "Profile", path: "/profile-settings" },
];

export const adminNav = [
  { label: "Dashboard", path: "/admin-dashboard" },
  { label: "Users", path: "/users" },
  { label: "Settings", path: "/profile-settings" },
];

export default function DashboardSidebar({ navItems = [] }) {
  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        padding: "20px",
        background: "#f5f5f5",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3>Goal Focus</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {navItems.map((item, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <Link
              to={item.path}
              style={{
                textDecoration: "none",
                color: "#333",
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}