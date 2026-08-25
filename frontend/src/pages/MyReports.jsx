import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MyReports.css";

function MyReports() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await API.get(`/reports/patient/${userEmail}`);
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to load reports");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "status-pending";
      case "COMPLETED": return "status-completed";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return "⏳ Pending";
      case "COMPLETED": return "✅ Completed";
      case "CANCELLED": return "❌ Cancelled";
      default: return status;
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "ALL") return true;
    return report.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading reports...</div>;
  }

  return (
    <div className="my-reports">
      <div className="reports-header">
        <h2>📋 My Medical Reports</h2>
        <span className="reports-count">{reports.length} total</span>
      </div>

      <div className="filter-bar">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
        <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state">
          <p>No reports found.</p>
        </div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.reportTitle}</h3>
                <span className={`status-badge ${getStatusColor(report.status)}`}>
                  {getStatusBadge(report.status)}
                </span>
              </div>

              <div className="report-details">
                <div className="report-row">
                  <span className="report-label">👨‍⚕️ Doctor:</span>
                  <span className="report-value">{report.doctorName}</span>
                </div>
                <div className="report-row">
                  <span className="report-label">📋 Type:</span>
                  <span className="report-value">{report.reportType || "N/A"}</span>
                </div>
                <div className="report-row">
                  <span className="report-label">📅 Date:</span>
                  <span className="report-value">{report.reportDate}</span>
                </div>
                {report.reportUrl && (
                  <div className="report-row">
                    <span className="report-label">🔗 Link:</span>
                    <span className="report-value">
                      <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                        View Report
                      </a>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReports;