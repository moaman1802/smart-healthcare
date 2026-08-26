import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../api/api";
import Notifications from '../components/Notifications';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "PATIENT";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard data states
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalDoctors: 0,
    totalReports: 0,
    totalPatients: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentStats, setAppointmentStats] = useState([
    { name: "Pending", value: 0 },
    { name: "Confirmed", value: 0 },
    { name: "Completed", value: 0 },
    { name: "Cancelled", value: 0 },
  ]);

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        API.get("/dashboard/stats"),
        API.get("/dashboard/recent?limit=5"),
      ]);

      setStats({
        totalAppointments: statsRes.data.totalAppointments || 0,
        totalDoctors: statsRes.data.totalDoctors || 0,
        totalReports: statsRes.data.totalReports || 0,
        totalPatients: statsRes.data.totalPatients || 0,
      });
      setRecentActivities(recentRes.data);

      const total = statsRes.data.totalAppointments || 1;
      setAppointmentStats([
        { name: "Pending", value: Math.floor(total * 0.3) },
        { name: "Confirmed", value: Math.floor(total * 0.4) },
        { name: "Completed", value: Math.floor(total * 0.2) },
        { name: "Cancelled", value: Math.floor(total * 0.1) },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // ===== ROLE-BASED SIDEBAR NAV =====
  const getSidebarNav = () => {
    const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

    if (userRole === "ADMIN") {
      return [
        ...common,
        { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
        { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
        { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
        { icon: "👥", label: "Manage Users", path: "/admin/users" },
        { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
        { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
        { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
        { icon: "📦", label: "Inventory", path: "/inventory" },
        { icon: "💰", label: "Bills", path: "/admin/bills" },
        { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
        { icon: "🛏️", label: "Beds", path: "/beds" },
        { icon: "🏥", label: "Admissions", path: "/admissions" },
        { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
        { icon: "🏛️", label: "Manage Wards", path: "/wards" },
        { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
        { icon: "📊", label: "Reports & Analytics", path: "/reports" },
        { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
        { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" }, // ✅ NEW
      ];
    }

    if (userRole === "DOCTOR") {
      return [
        ...common,
        { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
        { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
        { icon: "📝", label: "Add Report", path: "/add-report" },
        { icon: "📋", label: "My Reports", path: "/doctor/reports" },
        { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
        { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
        { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
        { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
        { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
      ];
    }

    // PATIENT
    return [
      ...common,
      { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
      { icon: "📋", label: "My Appointments", path: "/my-appointments" },
      { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
      { icon: "📋", label: "My Reports", path: "/my-reports" },
      { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
      { icon: "💰", label: "My Bills", path: "/my-bills" },
      { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
      { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
    ];
  };

  // ===== ROLE-BASED QUICK ACTIONS =====
  const getQuickActions = () => {
    if (userRole === "ADMIN") {
      return [
        { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
        { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
        { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
        { icon: "👥", label: "Manage Users", path: "/admin/users" },
        { icon: "💊", label: "Pharmacy", path: "/pharmacy" },
        { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
        { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
        { icon: "📦", label: "Inventory", path: "/inventory" },
        { icon: "💰", label: "Bills", path: "/admin/bills" },
        { icon: "💰", label: "Billing", path: "/billing/dashboard" },
        { icon: "🛏️", label: "Beds", path: "/beds" },
        { icon: "🏥", label: "Admissions", path: "/admissions" },
        { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
        { icon: "🏛️", label: "Wards", path: "/wards" },
        { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
        { icon: "📊", label: "Reports", path: "/reports" },
        { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
        { icon: "⚙️", label: "Settings", path: "/admin/settings" }, // ✅ NEW
      ];
    }
    if (userRole === "DOCTOR") {
      return [
        { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
        { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
        { icon: "📝", label: "Add Report", path: "/add-report" },
        { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
        { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
        { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
        { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
        { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
      ];
    }
    // PATIENT
    return [
      { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
      { icon: "📋", label: "My Appointments", path: "/my-appointments" },
      { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
      { icon: "📋", label: "My Reports", path: "/my-reports" },
      { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
      { icon: "💰", label: "My Bills", path: "/my-bills" },
      { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
    ];
  };

  // ===== ROLE-BASED STATS =====
  const getStats = () => {
    const allStats = [
      { icon: "📅", label: "Appointments", value: stats.totalAppointments },
      { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
      { icon: "📋", label: "Reports", value: stats.totalReports },
      { icon: "👤", label: "Patients", value: stats.totalPatients },
    ];
    if (userRole === "ADMIN") return allStats;
    if (userRole === "DOCTOR") return allStats;
    return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>🏥 Smart Health</h2>
          <button className="close-sidebar" onClick={closeSidebar}>✕</button>
        </div>
        <nav>
          {getSidebarNav().map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(item.path);
                closeSidebar();
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>
              Welcome back, <strong>{userName}</strong> 👋 (Role: {userRole})
            </p>
          </div>
          <div className="header-right">
            <Notifications />
            <div className="user-info">
              <span>👤</span>
              <span>{userName}</span>
            </div>
          </div>
        </header>

        {/* Stats */}
        <section className="stats">
          {getStats().map((stat, idx) => (
            <div key={idx} className="stat-card">
              <span className="stat-icon">{stat.icon}</span>
              <h3>{stat.label}</h3>
              <p>{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="charts-section">
          <h2>📊 Analytics</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Appointment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {appointmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Weekly Appointments (Sample)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { day: "Mon", count: 4 },
                    { day: "Tue", count: 7 },
                    { day: "Wed", count: 5 },
                    { day: "Thu", count: 9 },
                    { day: "Fri", count: 6 },
                    { day: "Sat", count: 3 },
                    { day: "Sun", count: 2 },
                  ]}
                >
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f4c81" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-grid">
            {getQuickActions().map((action, idx) => (
              <button key={idx} onClick={() => navigate(action.path)}>
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2>🕐 Recent Activity</h2>
          <div className="activity-card">
            {recentActivities.length === 0 ? (
              <p>No recent activity.</p>
            ) : (
              <ul className="activity-list">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <span className="activity-icon">
                      {activity.type === "APPOINTMENT" ? "📅" : "📋"}
                    </span>
                    <span className="activity-message">{activity.message}</span>
                    <span className="activity-date">{activity.date}</span>
                    <span
                      className={`activity-status ${activity.status?.toLowerCase()}`}
                    >
                      {activity.status || ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;