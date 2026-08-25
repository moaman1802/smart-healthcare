import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MyLabTests.css";

function MyLabTests() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      const response = await API.get(`/lab/patient/${userEmail}`);
      setLabTests(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching lab tests:", error);
      alert("Failed to load lab tests");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "status-pending";
      case "IN_PROGRESS": return "status-progress";
      case "COMPLETED": return "status-completed";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING": return "⏳ Pending";
      case "IN_PROGRESS": return "🔄 In Progress";
      case "COMPLETED": return "✅ Completed";
      case "CANCELLED": return "❌ Cancelled";
      default: return status;
    }
  };

  const filteredTests = labTests.filter((test) => {
    if (filter === "ALL") return true;
    return test.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading lab tests...</div>;
  }

  return (
    <div className="my-lab-tests">
      <div className="lab-header">
        <h2>🔬 My Lab Tests</h2>
        <span className="lab-count">{labTests.length} total</span>
      </div>

      <div className="filter-bar">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        <button className={filter === "IN_PROGRESS" ? "active" : ""} onClick={() => setFilter("IN_PROGRESS")}>In Progress</button>
        <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
        <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>

      {filteredTests.length === 0 ? (
        <div className="empty-state">
          <p>No lab tests found.</p>
        </div>
      ) : (
        <div className="tests-list">
          {filteredTests.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <h3>{test.testName}</h3>
                <span className={`status-badge ${getStatusColor(test.status)}`}>
                  {getStatusBadge(test.status)}
                </span>
              </div>
              <div className="test-details">
                <div className="test-row">
                  <span className="test-label">👨‍⚕️ Doctor:</span>
                  <span className="test-value">{test.doctorName}</span>
                </div>
                <div className="test-row">
                  <span className="test-label">🧪 Type:</span>
                  <span className="test-value">{test.testType || "N/A"}</span>
                </div>
                <div className="test-row">
                  <span className="test-label">📅 Date:</span>
                  <span className="test-value">{test.testDate}</span>
                </div>
                {test.result && (
                  <div className="test-row">
                    <span className="test-label">📊 Result:</span>
                    <span className="test-value">{test.result}</span>
                  </div>
                )}
                {test.normalRange && (
                  <div className="test-row">
                    <span className="test-label">📈 Normal Range:</span>
                    <span className="test-value">{test.normalRange}</span>
                  </div>
                )}
                {test.remarks && (
                  <div className="test-row">
                    <span className="test-label">📝 Remarks:</span>
                    <span className="test-value">{test.remarks}</span>
                  </div>
                )}
                {test.reportUrl && (
                  <div className="test-row">
                    <span className="test-label">🔗 Report:</span>
                    <span className="test-value">
                      <a href={test.reportUrl} target="_blank" rel="noopener noreferrer">
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

export default MyLabTests;