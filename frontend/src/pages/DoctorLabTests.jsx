import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./DoctorLabTests.css";

function DoctorLabTests() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await API.get(`/lab/doctor/${userEmail}`);
      setTests(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load lab tests");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/lab/status/${id}?status=${status}`);
      alert("Status updated!");
      fetchTests();
    } catch (error) {
      alert("Failed to update status");
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

  const filteredTests = tests.filter(t => filter === "ALL" || t.status === filter);

  if (loading) return <div className="loading">Loading lab tests...</div>;

  return (
    <div className="doctor-lab-tests">
      <div className="dr-header">
        <h2>🔬 My Lab Tests (Doctor)</h2>
        <button className="btn-add" onClick={() => navigate("/add-lab-test")}>+ Add Test</button>
      </div>

      <div className="filter-bar">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        <button className={filter === "IN_PROGRESS" ? "active" : ""} onClick={() => setFilter("IN_PROGRESS")}>In Progress</button>
        <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
        <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>

      {filteredTests.length === 0 ? (
        <div className="empty-state"><p>No lab tests found.</p></div>
      ) : (
        <div className="tests-list">
          {filteredTests.map(test => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <h3>{test.testName}</h3>
                <span className={`status-badge ${getStatusColor(test.status)}`}>
                  {test.status}
                </span>
              </div>
              <div className="test-details">
                <p><strong>👤 Patient:</strong> {test.patientName} ({test.patientEmail})</p>
                <p><strong>🧪 Type:</strong> {test.testType || "N/A"}</p>
                <p><strong>📅 Date:</strong> {test.testDate}</p>
                {test.result && <p><strong>📊 Result:</strong> {test.result}</p>}
                {test.normalRange && <p><strong>📈 Normal Range:</strong> {test.normalRange}</p>}
                {test.remarks && <p><strong>📝 Remarks:</strong> {test.remarks}</p>}
                {test.reportUrl && <p><strong>🔗 Report:</strong> <a href={test.reportUrl} target="_blank" rel="noopener noreferrer">View</a></p>}
              </div>
              <div className="test-actions">
                <select onChange={(e) => handleStatusUpdate(test.id, e.target.value)} value={test.status}>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorLabTests;