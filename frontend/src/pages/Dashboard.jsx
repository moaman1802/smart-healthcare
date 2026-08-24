import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

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
          <button onClick={() => { navigate("/dashboard"); closeSidebar(); }}>
            📊 Dashboard
          </button>
          <button onClick={() => { navigate("/book-appointment"); closeSidebar(); }}>
            📅 Book Appointment
          </button>
          <button onClick={() => { navigate("/my-appointments"); closeSidebar(); }}>
            📋 My Appointments
          </button>
          <button onClick={() => { navigate("/my-prescriptions"); closeSidebar(); }}>
            💊 My Prescriptions
          </button>
          <button onClick={() => { navigate("/add-prescription"); closeSidebar(); }}>
            📝 Add Prescription
          </button>
          <button onClick={() => { navigate("/doctor/appointments"); closeSidebar(); }}>
            📋 My Appointments (Doctor)
          </button>
          <button onClick={() => { navigate("/admin/doctors"); closeSidebar(); }}>
            👨‍⚕️ Manage Doctors
          </button>
          <button onClick={() => { navigate("/admin/patients"); closeSidebar(); }}>
            👤 Manage Patients
          </button>
          <button onClick={() => { navigate("/admin/appointments"); closeSidebar(); }}>
            📅 Manage Appointments
          </button>
          <button onClick={() => { navigate("/admin/users"); closeSidebar(); }}>
            👥 Manage Users
          </button>
          <button onClick={() => { navigate("/ai-symptom-checker"); closeSidebar(); }}>
            🤖 AI Symptom Checker
          </button>
          <button onClick={closeSidebar}>
            📋 Medical Reports
          </button>
          <button onClick={closeSidebar}>
            ⚙️ Profile
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1>📊 Dashboard</h1>
            <p>Welcome back, <strong>{userName}</strong> 👋</p>
          </div>
          <div className="user-info">
            <span>👤</span>
            <span>{userName}</span>
          </div>
        </header>

        {/* Statistics */}
        <section className="stats">
          <div className="stat-card">
            <span className="stat-icon">📅</span>
            <h3>Appointments</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👨‍⚕️</span>
            <h3>Doctors</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📋</span>
            <h3>Reports</h3>
            <p>0</p>
          </div>
          <div className="stat-card">
            <span className="stat-icon">👤</span>
            <h3>Patients</h3>
            <p>0</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-grid">
            <button onClick={() => navigate("/book-appointment")}>
              <span>📅</span>
              Book Appointment
            </button>
            <button onClick={() => navigate("/my-appointments")}>
              <span>📋</span>
              My Appointments
            </button>
            <button onClick={() => navigate("/my-prescriptions")}>
              <span>💊</span>
              My Prescriptions
            </button>
            <button onClick={() => navigate("/add-prescription")}>
              <span>📝</span>
              Add Prescription
            </button>
            <button onClick={() => navigate("/doctor/appointments")}>
              <span>📋</span>
              My Appointments (Doctor)
            </button>
            <button onClick={() => navigate("/admin/doctors")}>
              <span>👨‍⚕️</span>
              Manage Doctors
            </button>
            <button onClick={() => navigate("/admin/patients")}>
              <span>👤</span>
              Manage Patients
            </button>
            <button onClick={() => navigate("/admin/appointments")}>
              <span>📅</span>
              Manage Appointments
            </button>
            <button onClick={() => navigate("/admin/users")}>
              <span>👥</span>
              Manage Users
            </button>
            <button onClick={() => navigate("/ai-symptom-checker")}>
              <span>🤖</span>
              AI Symptom Checker
            </button>
            <button>
              <span>📋</span>
              Medical Reports
            </button>
            <button>
              <span>⚙️</span>
              Profile
            </button>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2>🕐 Recent Activity</h2>
          <div className="activity-card">
            <p>No recent activity.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;