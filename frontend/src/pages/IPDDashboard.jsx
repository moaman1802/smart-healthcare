import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./IPDDashboard.css";

function IPDDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    totalAdmissions: 0,
    activeAdmissions: 0,
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    totalWards: 0,
    availableWards: 0,
  });
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/ipd/dashboard/stats");
      setStats(res.data);
      
      // Fetch recent admissions separately
      const recentRes = await API.get("/admissions/active");
      const sorted = recentRes.data.sort((a, b) => b.id - a.id).slice(0, 5);
      setRecentAdmissions(sorted);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching IPD dashboard:", error);
      alert("Failed to load IPD dashboard");
      setLoading(false);
    }
  };

  const statCards = [
    { icon: "🏥", label: "Active Admissions", value: stats.activeAdmissions, color: "#0f4c81" },
    { icon: "🛏️", label: "Total Beds", value: stats.totalBeds, color: "#3b82f6" },
    { icon: "✅", label: "Available Beds", value: stats.availableBeds, color: "#10b981" },
    { icon: "❌", label: "Occupied Beds", value: stats.occupiedBeds, color: "#ef4444" },
    { icon: "🏛️", label: "Wards", value: stats.totalWards, color: "#8b5cf6" },
    { icon: "🟢", label: "Wards with Beds", value: stats.availableWards, color: "#06b6d4" },
  ];

  const quickActions = [
    { icon: "➕", label: "Admit Patient", path: "/add-admission" },
    { icon: "📋", label: "View Admissions", path: "/admissions" },
    { icon: "🛏️", label: "Manage Beds", path: "/beds" },
    { icon: "🏛️", label: "Manage Wards", path: "/wards" },
  ];

  if (loading) return <div className="loading">Loading IPD Dashboard...</div>;

  return (
    <div className="ipd-dashboard">
      <div className="ipd-header">
        <h2>🏥 IPD / Bed Management Dashboard</h2>
      </div>

      <section className="ipd-stats">
        {statCards.map((stat, idx) => (
          <div key={idx} className="ipd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
            <span className="ipd-stat-icon">{stat.icon}</span>
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="ipd-recent">
        <h3>🕐 Recent Admissions</h3>
        {recentAdmissions.length === 0 ? (
          <p>No recent admissions.</p>
        ) : (
          <ul className="ipd-recent-list">
            {recentAdmissions.map((ad) => (
              <li key={ad.id}>
                {ad.patientName} → Bed {ad.bedNumber} ({ad.ward})
                <span className="ipd-recent-date">{ad.admissionDate}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="ipd-quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="ipd-action-grid">
          {quickActions.map((action, idx) => (
            <button key={idx} onClick={() => navigate(action.path)}>
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default IPDDashboard;