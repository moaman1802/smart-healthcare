import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddWard.css";

function AddWard() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    totalBeds: "",
    location: "",
    status: "ACTIVE",
    headDoctor: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const state = location.state;
    if (state?.ward) {
      setEditing(state.ward);
      setForm({
        name: state.ward.name || "",
        description: state.ward.description || "",
        totalBeds: state.ward.totalBeds || "",
        location: state.ward.location || "",
        status: state.ward.status || "ACTIVE",
        headDoctor: state.ward.headDoctor || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await API.put(`/wards/admin/update/${editing.id}`, form);
        alert("Ward updated successfully!");
      } else {
        await API.post("/wards/admin/add", form);
        alert("Ward added successfully!");
      }
      navigate("/wards");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save ward");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-ward">
      <div className="aw-header">
        <h2>🏛️ {editing ? "Edit" : "Add"} Ward</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="aw-form">
        <div className="form-group">
          <label>Ward Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Ward A, ICU, General Ward"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="2"
            placeholder="Any details about the ward"
          />
        </div>

        <div className="form-group">
          <label>Total Beds *</label>
          <input
            type="number"
            name="totalBeds"
            value={form.totalBeds}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. 2nd Floor, Building A"
          />
        </div>

        <div className="form-group">
          <label>Head Doctor</label>
          <input
            type="text"
            name="headDoctor"
            value={form.headDoctor}
            onChange={handleChange}
            placeholder="Dr. Name"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Ward"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddWard;