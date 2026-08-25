import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./PharmacyDashboard.css";

function PharmacyDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    pendingRequests: 0,
    expiredMedicines: 0,
  });
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
      const [medRes, lowRes, reqRes, expRes] = await Promise.all([
        API.get("/medicines/admin/all"),
        API.get("/medicines/low-stock?threshold=10"),
        API.get("/medicine-requests/status/PENDING"),
        API.get("/medicines/expired"),
      ]);
      setStats({
        totalMedicines: medRes.data.length || 0,
        lowStock: lowRes.data.length || 0,
        pendingRequests: reqRes.data.length || 0,
        expiredMedicines: expRes.data.length || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pharmacy stats:", error);
      setLoading(false);
    }
  };

  const statCards = [
    { icon: "💊", label: "Total Medicines", value: stats.totalMedicines, color: "#0f4c81", path: "/medicines" },
    { icon: "⚠️", label: "Low Stock", value: stats.lowStock, color: "#dc3545", path: "/low-stock" },
    { icon: "📨", label: "Pending Requests", value: stats.pendingRequests, color: "#f59e0b", path: "/medicine-requests" },
    { icon: "⏰", label: "Expired Medicines", value: stats.expiredMedicines, color: "#ef4444", path: "/medicines?filter=expired" },
  ];

  const quickActions = [
    { icon: "➕", label: "Add Medicine", path: "/add-medicine" },
    { icon: "📋", label: "View All Medicines", path: "/medicines" },
    { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
    { icon: "📨", label: "Medicine Requests", path: "/medicine-requests" },
  ];

  if (loading) return <div className="loading">Loading pharmacy dashboard...</div>;

  return (
    <div className="pharmacy-dashboard">
      <div className="pd-header">
        <h2>💊 Pharmacy Dashboard</h2>
      </div>

      {/* Stats */}
      <section className="pd-stats">
        {statCards.map((stat, idx) => (
          <div key={idx} className="pd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }} onClick={() => navigate(stat.path)}>
            <span className="pd-stat-icon">{stat.icon}</span>
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="pd-quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="pd-action-grid">
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

export default PharmacyDashboard;