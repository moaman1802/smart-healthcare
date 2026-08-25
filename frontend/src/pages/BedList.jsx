
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./BedList.css";

function BedList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterWard, setFilterWard] = useState("ALL");
  const [wards, setWards] = useState([]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      const res = await API.get("/beds/admin/all");
      setBeds(res.data);
      const w = [...new Set(res.data.map(b => b.ward).filter(Boolean))];
      setWards(w);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load beds");
      setLoading(false);
    }
  };

  const handleFilterStatus = async (status) => {
    setFilterStatus(status);
    if (status === "ALL") { fetchBeds(); return; }
    try {
      const res = await API.get(`/beds/status/${status}`);
      setBeds(res.data);
    } catch (error) { console.error(error); }
  };

  const handleFilterWard = async (ward) => {
    setFilterWard(ward);
    if (ward === "ALL") { fetchBeds(); return; }
    try {
      const res = await API.get(`/beds/ward/${ward}`);
      setBeds(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bed?")) return;
    try {
      await API.delete(`/beds/admin/delete/${id}`);
      alert("Deleted!");
      fetchBeds();
    } catch (error) { alert("Failed to delete"); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE": return "status-avail";
      case "OCCUPIED": return "status-occupied";
      case "RESERVED": return "status-reserved";
      case "MAINTENANCE": return "status-maint";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading beds...</div>;

  return (
    <div className="bed-list">
      <div className="bed-header">
        <h2>🛏️ Bed Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-bed")}>+ Add Bed</button>
      </div>
      <div className="bed-toolbar">
        <div className="filter-box">
          <span>Status:</span>
          <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
          <button className={filterStatus === "AVAILABLE" ? "active" : ""} onClick={() => handleFilterStatus("AVAILABLE")}>Available</button>
          <button className={filterStatus === "OCCUPIED" ? "active" : ""} onClick={() => handleFilterStatus("OCCUPIED")}>Occupied</button>
          <button className={filterStatus === "RESERVED" ? "active" : ""} onClick={() => handleFilterStatus("RESERVED")}>Reserved</button>
          <button className={filterStatus === "MAINTENANCE" ? "active" : ""} onClick={() => handleFilterStatus("MAINTENANCE")}>Maintenance</button>
        </div>
        <div className="filter-box">
          <span>Ward:</span>
          <button className={filterWard === "ALL" ? "active" : ""} onClick={() => handleFilterWard("ALL")}>All</button>
          {wards.map(w => <button key={w} className={filterWard === w ? "active" : ""} onClick={() => handleFilterWard(w)}>{w}</button>)}
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Bed Number</th>
              <th>Ward</th>
              <th>Room</th>
              <th>Type</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {beds.length === 0 ? (
              <tr><td colSpan="8" className="empty-row">No beds found.</td></tr>
            ) : (
              beds.map((bed, idx) => (
                <tr key={bed.id}>
                  <td>{idx + 1}</td>
                  <td>{bed.bedNumber}</td>
                  <td>{bed.ward}</td>
                  <td>{bed.roomNumber || "N/A"}</td>
                  <td>{bed.bedType}</td>
                  <td>₹{bed.dailyRate || 0}</td>
                  <td><span className={`status-badge ${getStatusColor(bed.status)}`}>{bed.status}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate("/add-bed", { state: { bed } })}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(bed.id)}>🗑️</button>
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

export default BedList;