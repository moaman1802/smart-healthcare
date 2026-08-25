import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./BillingDashboard.css";

function BillingDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [stats, setStats] = useState({
    totalBills: 0,
    pendingBills: 0,
    paidBills: 0,
    partialBills: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    monthlyRevenue: 0,
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
      const res = await API.get("/billing/dashboard/stats");
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching billing stats:", error);
      alert("Failed to load billing dashboard");
      setLoading(false);
    }
  };

  const statCards = [
    { icon: "📄", label: "Total Bills", value: stats.totalBills, color: "#0f4c81", path: "/admin/bills" },
    { icon: "⏳", label: "Pending", value: stats.pendingBills, color: "#f59e0b", path: "/admin/bills?status=PENDING" },
    { icon: "✅", label: "Paid", value: stats.paidBills, color: "#10b981", path: "/admin/bills?status=PAID" },
    { icon: "💰", label: "Revenue", value: `₹${stats.totalRevenue.toFixed(2)}`, color: "#3b82f6", path: "#" },
  ];

  const quickActions = [
    { icon: "➕", label: "Generate Bill", path: "/add-bill" },
    { icon: "📋", label: "All Bills", path: "/admin/bills" },
    { icon: "📊", label: "My Bills", path: "/my-bills" },
  ];

  if (loading) return <div className="loading">Loading billing dashboard...</div>;

  return (
    <div className="billing-dashboard">
      <div className="bd-header">
        <h2>💰 Billing Dashboard</h2>
      </div>

      <section className="bd-stats">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }} onClick={() => stat.path && navigate(stat.path)}>
            <span className="bd-stat-icon">{stat.icon}</span>
            <h3>{stat.label}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="bd-detail-row">
        <div className="bd-detail-card">
          <h3>Pending Amount</h3>
          <p>₹{stats.pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bd-detail-card">
          <h3>Monthly Revenue</h3>
          <p>₹{stats.monthlyRevenue.toFixed(2)}</p>
        </div>
      </div>

      <section className="bd-quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="bd-action-grid">
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

export default BillingDashboard;