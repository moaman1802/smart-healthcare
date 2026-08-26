import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/Toast";
import "./AdminPatients.css";

function AdminPatients() {
  const navigate = useNavigate();
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("ALL");
  const [filterGender, setFilterGender] = useState("ALL");
  const [bloodGroups, setBloodGroups] = useState([]);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    address: "",
  });

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients/admin/all");
      setPatients(response.data);
      const groups = [...new Set(response.data.map(p => p.bloodGroup).filter(Boolean))];
      setBloodGroups(groups);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast.showToast("Failed to load patients", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Search by name
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchPatients();
      return;
    }
    try {
      const response = await API.get(`/patients/search/name?name=${searchQuery}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Search error:", error);
      toast.showToast("Search failed", "error");
    }
  };

  // Filter by blood group
  const handleFilterByBloodGroup = async (bloodGroup) => {
    setFilterBloodGroup(bloodGroup);
    if (bloodGroup === "ALL") {
      fetchPatients();
      return;
    }
    try {
      const response = await API.get(`/patients/search/bloodgroup?bloodGroup=${bloodGroup}`);
      setPatients(response.data);
    } catch (error) {
      console.error("Filter error:", error);
      toast.showToast("Filter failed", "error");
    }
  };

  // Filter by gender
  const handleFilterByGender = (gender) => {
    setFilterGender(gender);
    fetchPatients();
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Open modal for add/edit
  const openModal = (patient = null) => {
    if (patient) {
      setEditingPatient(patient);
      setForm({
        name: patient.name,
        email: patient.email,
        phone: patient.phone || "",
        age: patient.age || "",
        gender: patient.gender || "",
        bloodGroup: patient.bloodGroup || "",
        address: patient.address || "",
      });
    } else {
      setEditingPatient(null);
      setForm({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        bloodGroup: "",
        address: "",
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setForm({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      bloodGroup: "",
      address: "",
    });
  };

  // Submit add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingPatient) {
        await API.put(`/patients/update/${editingPatient.id}`, form);
        toast.showToast("Patient updated successfully!", "success");
      } else {
        await API.post("/patients/admin/add", form);
        toast.showToast("Patient added successfully!", "success");
      }
      closeModal();
      fetchPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.showToast(error.response?.data?.error || "Failed to save patient", "error");
    }
  };

  // Delete patient
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await API.delete(`/patients/admin/delete/${id}`);
      toast.showToast("Patient deleted successfully!", "success");
      fetchPatients();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.showToast("Failed to delete patient", "error");
    }
  };

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  const filteredPatients = filterGender === "ALL" 
    ? patients 
    : patients.filter(p => p.gender === filterGender);

  return (
    <div className="admin-patients">
      <div className="admin-header">
        <h2>👤 Patient Management</h2>
        <button className="btn-add" onClick={() => openModal()}>
          + Add New Patient
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="patients-toolbar">
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
            <button className="clear-btn" onClick={() => { setSearchQuery(""); fetchPatients(); }}>✕</button>
          )}
        </div>
        <div className="filter-box">
          <span className="filter-label">Blood Group:</span>
          <button
            className={filterBloodGroup === "ALL" ? "active" : ""}
            onClick={() => handleFilterByBloodGroup("ALL")}
          >
            All
          </button>
          {bloodGroups.map((group) => (
            <button
              key={group}
              className={filterBloodGroup === group ? "active" : ""}
              onClick={() => handleFilterByBloodGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
        <div className="filter-box">
          <span className="filter-label">Gender:</span>
          <button
            className={filterGender === "ALL" ? "active" : ""}
            onClick={() => handleFilterByGender("ALL")}
          >
            All
          </button>
          <button
            className={filterGender === "Male" ? "active" : ""}
            onClick={() => handleFilterByGender("Male")}
          >
            Male
          </button>
          <button
            className={filterGender === "Female" ? "active" : ""}
            onClick={() => handleFilterByGender("Female")}
          >
            Female
          </button>
          <button
            className={filterGender === "Other" ? "active" : ""}
            onClick={() => handleFilterByGender("Other")}
          >
            Other
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-row">
                  No patients found. Add one!
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient, index) => (
                <tr key={patient.id}>
                  <td>{index + 1}</td>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone || "N/A"}</td>
                  <td>{patient.age || "N/A"}</td>
                  <td>{patient.gender || "N/A"}</td>
                  <td>
                    <span className="blood-badge">{patient.bloodGroup || "N/A"}</span>
                  </td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openModal(patient)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(patient.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/patient/${patient.id}`)}
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
            <h3>{editingPatient ? "Edit Patient" : "Add New Patient"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
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
                  disabled={!!editingPatient}
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
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingPatient ? "Update" : "Add"} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPatients;