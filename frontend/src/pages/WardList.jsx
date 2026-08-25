import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./WardList.css";

function WardList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const res = await API.get("/wards/admin/all");
      setWards(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wards:", error);
      alert("Failed to load wards");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ward?")) return;
    try {
      await API.delete(`/wards/admin/delete/${id}`);
      alert("Ward deleted!");
      fetchWards();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  if (loading) return <div className="loading">Loading wards...</div>;

  return (
    <div className="ward-list">
      <div className="wl-header">
        <h2>🏛️ Ward Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-ward")}>+ Add Ward</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Total Beds</th>
              <th>Available</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {wards.length === 0 ? (
              <tr><td colSpan="7" className="empty-row">No wards found.</td></tr>
            ) : (
              wards.map((w, idx) => (
                <tr key={w.id}>
                  <td>{idx + 1}</td>
                  <td>{w.name}</td>
                  <td>{w.totalBeds}</td>
                  <td>{w.availableBeds}</td>
                  <td>{w.location || "N/A"}</td>
                  <td>
                    <span className={`status-badge ${w.status === "ACTIVE" ? "status-active" : "status-inactive"}`}>
                      {w.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate("/add-ward", { state: { ward: w } })}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(w.id)}>🗑️</button>
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

export default WardList;