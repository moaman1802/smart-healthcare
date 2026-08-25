import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddBed.css";

function AddBed() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    bedNumber: "",
    ward: "",
    roomNumber: "",
    bedType: "General",
    status: "AVAILABLE",
    dailyRate: "",
    description: "",
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const state = location.state;
    if (state?.bed) {
      setEditing(state.bed);
      setForm({
        bedNumber: state.bed.bedNumber || "",
        ward: state.bed.ward || "",
        roomNumber: state.bed.roomNumber || "",
        bedType: state.bed.bedType || "General",
        status: state.bed.status || "AVAILABLE",
        dailyRate: state.bed.dailyRate || "",
        description: state.bed.description || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await API.put(`/beds/admin/update/${editing.id}`, form);
        alert("✅ Bed updated!");
      } else {
        await API.post("/beds/admin/add", form);
        alert("✅ Bed added!");
      }
      navigate("/beds");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bed">
      <div className="bed-header">
        <h2>🛏️ {editing ? "Edit" : "Add"} Bed</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="bed-form">
        <div className="form-row">
          <div className="form-group">
            <label>Bed Number *</label>
            <input type="text" name="bedNumber" value={form.bedNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Ward *</label>
            <select name="ward" value={form.ward} onChange={handleChange} required>
              <option value="">Select Ward</option>
              <option value="General">General</option>
              <option value="ICU">ICU</option>
              <option value="Maternity">Maternity</option>
              <option value="Pediatric">Pediatric</option>
              <option value="Orthopedic">Orthopedic</option>
              <option value="Private">Private</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Room Number</label>
            <input type="text" name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="e.g. A-101" />
          </div>
          <div className="form-group">
            <label>Bed Type</label>
            <select name="bedType" value={form.bedType} onChange={handleChange}>
              <option value="General">General</option>
              <option value="ICU">ICU</option>
              <option value="VIP">VIP</option>
              <option value="Isolation">Isolation</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Daily Rate (₹)</label>
            <input type="number" name="dailyRate" value={form.dailyRate} onChange={handleChange} min="0" step="0.01" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="2" placeholder="Any notes about the bed..." />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : "💾 Save"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddBed;