import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminDoctors.css";

function AdminDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // 🔥 NEW: Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState("ALL");
  const [specializations, setSpecializations] = useState([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    experience: "",
    qualification: "",
    available: true,
  });

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors/all");
      setDoctors(response.data);
      // 🔥 NEW: Extract unique specializations for filter
      const specs = [...new Set(response.data.map(d => d.specialization).filter(Boolean))];
      setSpecializations(specs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to load doctors");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔥 NEW: Search by name
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchDoctors();
      return;
    }
    try {
      const response = await API.get(`/doctors/search/name?name=${searchQuery}`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 🔥 NEW: Filter by specialization
  const handleFilter = async (specialization) => {
    setFilterSpecialization(specialization);
    if (specialization === "ALL") {
      fetchDoctors();
      return;
    }
    try {
      const response = await API.get(`/doctors/search/specialization?specialization=${specialization}`);
      setDoctors(response.data);
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Open modal for add/edit
  const openModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setForm({
        name: doctor.name,
        specialization: doctor.specialization,
        email: doctor.email,
        phone: doctor.phone || "",
        experience: doctor.experience || "",
        qualification: doctor.qualification || "",
        available: doctor.available,
      });
    } else {
      setEditingDoctor(null);
      setForm({
        name: "",
        specialization: "",
        email: "",
        phone: "",
        experience: "",
        qualification: "",
        available: true,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setForm({
      name: "",
      specialization: "",
      email: "",
      phone: "",
      experience: "",
      qualification: "",
      available: true,
    });
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingDoctor) {
        await API.put(`/doctors/admin/update/${editingDoctor.id}`, form);
        alert("Doctor updated successfully!");
      } else {
        await API.post("/doctors/admin/add", form);
        alert("Doctor added successfully!");
      }
      closeModal();
      fetchDoctors();
    } catch (error) {
      console.error("Error saving doctor:", error);
      alert(error.response?.data?.error || "Failed to save doctor");
    }
  };

  // Delete doctor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await API.delete(`/doctors/admin/delete/${id}`);
      alert("Doctor deleted successfully!");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Failed to delete doctor");
    }
  };

  // Toggle availability
  const handleToggle = async (id) => {
    try {
      await API.patch(`/doctors/admin/toggle/${id}`);
      fetchDoctors();
    } catch (error) {
      console.error("Error toggling availability:", error);
      alert("Failed to toggle availability");
    }
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="admin-doctors">
      <div className="admin-header">
        <h2>👨‍⚕️ Manage Doctors</h2>
        <button className="btn-add" onClick={() => openModal()}>
          + Add New Doctor
        </button>
      </div>

      {/* 🔥 NEW: Search & Filter Toolbar */}
      <div className="doctors-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
          {searchQuery && (
            <button className="clear-btn" onClick={() => { setSearchQuery(""); fetchDoctors(); }}>✕</button>
          )}
        </div>
        <div className="filter-box">
          <button
            className={filterSpecialization === "ALL" ? "active" : ""}
            onClick={() => handleFilter("ALL")}
          >
            All
          </button>
          {specializations.map((spec) => (
            <button
              key={spec}
              className={filterSpecialization === spec ? "active" : ""}
              onClick={() => handleFilter(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
                  No doctors found. Add one!
                </td>
              </tr>
            ) : (
              doctors.map((doc, index) => (
                <tr key={doc.id}>
                  <td>{index + 1}</td>
                  <td>{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.email}</td>
                  <td>{doc.phone || "N/A"}</td>
                  <td>{doc.experience || "N/A"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        doc.available ? "available" : "unavailable"
                      }`}
                      onClick={() => handleToggle(doc.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {doc.available ? "✅ Available" : "❌ Unavailable"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openModal(doc)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(doc.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/doctor/${doc.id}`)}
                      title="View Details"
                    >
                      👁️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Specialization *</label>
                <input
                  type="text"
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 10 years"
                />
              </div>

              <div className="form-group">
                <label>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="e.g. MBBS, MD"
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={form.available}
                    onChange={handleChange}
                  />
                  Available for appointments
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingDoctor ? "Update" : "Add"} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDoctors;