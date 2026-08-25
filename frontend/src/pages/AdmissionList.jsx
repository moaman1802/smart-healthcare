import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdmissionList.css";

function AdmissionList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const res = await API.get("/admissions/admin/all");
      setAdmissions(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load admissions");
      setLoading(false);
    }
  };

  const handleFilterStatus = async (status) => {
    setFilterStatus(status);
    if (status === "ALL") { fetchAdmissions(); return; }
    try {
      const res = await API.get(`/admissions/status/${status}`);
      setAdmissions(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDischarge = async (id) => {
    if (!window.confirm("Discharge this patient?")) return;
    try {
      await API.patch(`/admissions/discharge/${id}`);
      alert("Patient discharged!");
      fetchAdmissions();
    } catch (error) { alert("Failed to discharge"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admission record?")) return;
    try {
      await API.delete(`/admissions/admin/delete/${id}`);
      alert("Deleted!");
      fetchAdmissions();
    } catch (error) { alert("Failed to delete"); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ADMITTED": return "status-admitted";
      case "DISCHARGED": return "status-discharged";
      case "TRANSFERRED": return "status-transferred";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading admissions...</div>;

  return (
    <div className="admission-list">
      <div className="admission-header">
        <h2>🏥 Patient Admissions</h2>
        <button className="btn-add" onClick={() => navigate("/add-admission")}>+ Admit Patient</button>
      </div>
      <div className="filter-bar">
        <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
        <button className={filterStatus === "ADMITTED" ? "active" : ""} onClick={() => handleFilterStatus("ADMITTED")}>Admitted</button>
        <button className={filterStatus === "DISCHARGED" ? "active" : ""} onClick={() => handleFilterStatus("DISCHARGED")}>Discharged</button>
        <button className={filterStatus === "TRANSFERRED" ? "active" : ""} onClick={() => handleFilterStatus("TRANSFERRED")}>Transferred</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Bed</th>
              <th>Ward</th>
              <th>Admission Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.length === 0 ? (
              <tr><td colSpan="8" className="empty-row">No admissions found.</td></tr>
            ) : (
              admissions.map((ad, idx) => (
                <tr key={ad.id}>
                  <td>{idx + 1}</td>
                  <td>{ad.patientName}</td>
                  <td>{ad.doctorName}</td>
                  <td>{ad.bedNumber}</td>
                  <td>{ad.ward}</td>
                  <td>{ad.admissionDate}</td>
                  <td><span className={`status-badge ${getStatusColor(ad.status)}`}>{ad.status}</span></td>
                  <td>
                    {ad.status === "ADMITTED" && (
                      <button className="btn-discharge" onClick={() => handleDischarge(ad.id)}>🔓 Discharge</button>
                    )}
                    <button className="btn-delete" onClick={() => handleDelete(ad.id)}>🗑️</button>
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

export default AdmissionList;