import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminLabTests.css";

function AdminLabTests() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const res = await API.get("/lab/admin/all");
      setTests(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load lab tests");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab test?")) return;
    try {
      await API.delete(`/lab/admin/delete/${id}`);
      alert("Deleted!");
      fetchTests();
    } catch (error) {
      alert("Failed to delete");
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

  const filteredTests = tests.filter(t => {
    if (filter !== "ALL" && t.status !== filter) return false;
    if (search && !t.patientName.toLowerCase().includes(search.toLowerCase()) && !t.testName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="loading">Loading lab tests...</div>;

  return (
    <div className="admin-lab-tests">
      <div className="admin-header">
        <h2>🔬 Laboratory Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-lab-test")}>+ Add Test</button>
      </div>

      <div className="filters">
        <div className="search-box">
          <input type="text" placeholder="Search by patient or test..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="filter-group">
          <span>Status:</span>
          <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
          <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
          <button className={filter === "IN_PROGRESS" ? "active" : ""} onClick={() => setFilter("IN_PROGRESS")}>In Progress</button>
          <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
          <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr><td colSpan="8" className="empty-row">No lab tests found.</td></tr>
            ) : (
              filteredTests.map((test, idx) => (
                <tr key={test.id}>
                  <td>{idx + 1}</td>
                  <td>{test.testName}</td>
                  <td>{test.patientName}</td>
                  <td>{test.doctorName}</td>
                  <td>{test.testType || "N/A"}</td>
                  <td>{test.testDate}</td>
                  <td><span className={`status-badge ${getStatusColor(test.status)}`}>{test.status}</span></td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(test.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLabTests;