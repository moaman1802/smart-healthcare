import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MyPrescriptions.css";

function MyPrescriptions() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await API.get(`/prescriptions/patient/${userEmail}`);
      setPrescriptions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      alert("Failed to load prescriptions");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "status-active";
      case "COMPLETED":
        return "status-completed";
      case "EXPIRED":
        return "status-expired";
      default:
        return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return "🟢 Active";
      case "COMPLETED":
        return "✅ Completed";
      case "EXPIRED":
        return "🔴 Expired";
      default:
        return status;
    }
  };

  const filteredPrescriptions = prescriptions.filter((pres) => {
    if (filter === "ALL") return true;
    return pres.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading prescriptions...</div>;
  }

  return (
    <div className="my-prescriptions">
      <div className="pres-header">
        <h2>📋 My Prescriptions</h2>
        <span className="pres-count">{prescriptions.length} total</span>
      </div>

      <div className="filter-bar">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        <button
          className={filter === "ACTIVE" ? "active" : ""}
          onClick={() => setFilter("ACTIVE")}
        >
          Active
        </button>
        <button
          className={filter === "COMPLETED" ? "active" : ""}
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>
        <button
          className={filter === "EXPIRED" ? "active" : ""}
          onClick={() => setFilter("EXPIRED")}
        >
          Expired
        </button>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="empty-state">
          <p>No prescriptions found.</p>
          {filter !== "ALL" && (
            <button className="btn-clear" onClick={() => setFilter("ALL")}>
              Show all prescriptions
            </button>
          )}
        </div>
      ) : (
        <div className="prescriptions-list">
          {filteredPrescriptions.map((pres) => (
            <div key={pres.id} className="prescription-card">
              <div className="pres-header-row">
                <h3>💊 {pres.medicineName}</h3>
                <span className={`status-badge ${getStatusColor(pres.status)}`}>
                  {getStatusBadge(pres.status)}
                </span>
              </div>

              <div className="pres-details">
                <div className="pres-row">
                  <span className="pres-label">👨‍⚕️ Doctor:</span>
                  <span className="pres-value">{pres.doctorName}</span>
                </div>
                <div className="pres-row">
                  <span className="pres-label">📅 Prescribed:</span>
                  <span className="pres-value">{pres.prescribedDate}</span>
                </div>
                <div className="pres-row">
                  <span className="pres-label">💊 Dosage:</span>
                  <span className="pres-value">{pres.dosage || "N/A"}</span>
                </div>
                <div className="pres-row">
                  <span className="pres-label">🕐 Frequency:</span>
                  <span className="pres-value">{pres.frequency || "N/A"}</span>
                </div>
                <div className="pres-row">
                  <span className="pres-label">📆 Duration:</span>
                  <span className="pres-value">{pres.duration || "N/A"}</span>
                </div>
                {pres.instructions && (
                  <div className="pres-row">
                    <span className="pres-label">📝 Instructions:</span>
                    <span className="pres-value">{pres.instructions}</span>
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

export default MyPrescriptions;