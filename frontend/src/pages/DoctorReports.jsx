import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./DoctorReports.css";

function DoctorReports() {
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
      const response = await API.get(`/reports/doctor/${userEmail}`);
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

  const filteredReports = reports.filter((report) => {
    if (filter === "ALL") return true;
    return report.status === filter;
  });

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="doctor-reports">
      <div className="dr-header">
        <h2>📋 My Reports (Doctor)</h2>
        <button className="btn-add" onClick={() => navigate("/add-report")}>
          + Add Report
        </button>
      </div>

      <div className="filter-bar">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
        <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>

      {filteredReports.length === 0 ? (
        <div className="empty-state"><p>No reports found.</p></div>
      ) : (
        <div className="reports-list">
          {filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.reportTitle}</h3>
                <span className={`status-badge ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <div className="report-details">
                <p>👤 Patient: {report.patientName}</p>
                <p>📧 {report.patientEmail}</p>
                <p>📋 {report.reportType || "N/A"}</p>
                <p>📅 {report.reportDate}</p>
                {report.reportUrl && (
                  <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">🔗 View</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorReports;