import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminUsers.css";

function AdminUsers() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "PATIENT"
  });

  // Redirect if not admin
  useEffect(() => {
    if (!token || userRole !== "ADMIN") {
      navigate("/dashboard");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users/all");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers();
      return;
    }
    try {
      const response = await API.get(`/users/search?query=${searchQuery}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleFilter = async (role) => {
    setFilterRole(role);
    if (role === "ALL") {
      fetchUsers();
      return;
    }
    try {
      const response = await API.get(`/users/role/${role}`);
      setUsers(response.data);
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/delete/${id}`);
      alert("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FIX: Editing ke waqt agar password khali hai, toh usko payload se hata do
      let payload = { ...form };
      if (editingUser && !payload.password) {
        delete payload.password;
      }

      if (editingUser) {
        await API.put(`/users/update/${editingUser.id}`, payload);
        alert("User updated successfully!");
      } else {
        // FIX: Admin panel se Add User karne ke liye sahi endpoint
        await API.post("/users", payload);
        alert("User added successfully!");
      }
      setShowModal(false);
      setEditingUser(null);
      setForm({ name: "", email: "", password: "", phone: "", role: "PATIENT" });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || "Operation failed");
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setForm({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone || "",
        role: user.role
      });
    } else {
      setEditingUser(null);
      setForm({ name: "", email: "", password: "", phone: "", role: "PATIENT" });
    }
    setShowModal(true);
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-users">
      <div className="users-header">
        <h2>👥 User Management</h2>
        <button className="btn-add" onClick={() => openModal()}>
          + Add User
        </button>
      </div>

      {/* Search & Filter */}
      <div className="users-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>
        <div className="filter-box">
          <button
            className={filterRole === "ALL" ? "active" : ""}
            onClick={() => handleFilter("ALL")}
          >
            All
          </button>
          <button
            className={filterRole === "ADMIN" ? "active" : ""}
            onClick={() => handleFilter("ADMIN")}
          >
            Admin
          </button>
          <button
            className={filterRole === "DOCTOR" ? "active" : ""}
            onClick={() => handleFilter("DOCTOR")}
          >
            Doctor
          </button>
          <button
            className={filterRole === "PATIENT" ? "active" : ""}
            onClick={() => handleFilter("PATIENT")}
          >
            Patient
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">No users found</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "N/A"}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.verified ? (
                      <span className="verified">✅ Yes</span>
                    ) : (
                      <span className="unverified">❌ No</span>
                    )}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => openModal(user)}>
                      ✏️
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                      🗑️
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
        <div className="modal-overlay" onClick={() => { setShowModal(false); setEditingUser(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingUser ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div className="form-group">
                <label>{editingUser ? "Password (leave blank to keep current)" : "Password *"}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); setEditingUser(null); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingUser ? "Update" : "Add"} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;