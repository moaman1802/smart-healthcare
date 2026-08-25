import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./PrescriptionManagement.css";

function PrescriptionManagement() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get("/prescriptions/admin/all");
      setPrescriptions(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      alert("Failed to load prescriptions");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/prescriptions/status/${id}?status=${status}`);
      alert("Prescription status updated!");
      fetchPrescriptions();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prescription?")) return;
    try {
      await API.delete(`/prescriptions/admin/delete/${id}`);
      alert("Deleted!");
      fetchPrescriptions();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "status-active";
      case "COMPLETED": return "status-completed";
      case "EXPIRED": return "status-expired";
      default: return "";
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search && !p.patientName.toLowerCase().includes(search.toLowerCase()) && !p.medicineName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="loading">Loading prescriptions...</div>;

  return (
    <div className="prescription-management">
      <div className="pm-header">
        <h2>📋 Prescription Management (Pharmacy)</h2>
        <span className="count">{prescriptions.length} total</span>
      </div>

      <div className="pm-filters">
        <div className="pm-search">
          <input type="text" placeholder="Search by patient or medicine..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="pm-filter-group">
          <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
          <button className={filter === "ACTIVE" ? "active" : ""} onClick={() => setFilter("ACTIVE")}>Active</button>
          <button className={filter === "COMPLETED" ? "active" : ""} onClick={() => setFilter("COMPLETED")}>Completed</button>
          <button className={filter === "EXPIRED" ? "active" : ""} onClick={() => setFilter("EXPIRED")}>Expired</button>
        </div>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div className="empty-state">No prescriptions found.</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((p, idx) => (
                <tr key={p.id}>
                  <td>{idx + 1}</td>
                  <td>{p.patientName}</td>
                  <td>{p.medicineName}</td>
                  <td>{p.dosage || "N/A"}</td>
                  <td>{p.frequency || "N/A"}</td>
                  <td>{p.doctorName}</td>
                  <td><span className={`status-badge ${getStatusColor(p.status)}`}>{p.status}</span></td>
                  <td>
                    <select onChange={(e) => handleStatusUpdate(p.id, e.target.value)} value={p.status}>
                      <option value="ACTIVE">Active</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                    <button className="btn-delete" onClick={() => handleDelete(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PrescriptionManagement;