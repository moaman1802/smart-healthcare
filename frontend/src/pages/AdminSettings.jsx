import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminSettings.css";

function AdminSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile
  const [profile, setProfile] = useState({
    hospitalName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    email: "",
    website: "",
    registrationNumber: "",
    establishedYear: "",
    about: "",
    workingHours: "",
    emergencyContact: "",
  });

  // Departments
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState({ name: "", description: "", headOfDepartment: "", status: "ACTIVE" });
  const [editingDept, setEditingDept] = useState(null);

  // Settings
  const [settings, setSettings] = useState([]);
  const [filterCategory, setFilterCategory] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [profileRes, deptRes, settingsRes] = await Promise.all([
        API.get("/admin/settings/profile"),
        API.get("/admin/settings/departments"),
        API.get("/admin/settings/settings"),
      ]);
      setProfile(profileRes.data);
      setDepartments(deptRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      alert("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // ===== Profile =====
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put("/admin/settings/profile", profile);
      alert("Hospital profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // ===== Departments =====
  const handleDeptSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await API.put(`/admin/settings/departments/${editingDept.id}`, newDept);
        alert("Department updated!");
      } else {
        await API.post("/admin/settings/departments", newDept);
        alert("Department added!");
      }
      setNewDept({ name: "", description: "", headOfDepartment: "", status: "ACTIVE" });
      setEditingDept(null);
      const res = await API.get("/admin/settings/departments");
      setDepartments(res.data);
    } catch (error) {
      alert("Failed to save department");
    }
  };

  const handleDeptDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await API.delete(`/admin/settings/departments/${id}`);
      const res = await API.get("/admin/settings/departments");
      setDepartments(res.data);
    } catch (error) {
      alert("Failed to delete department");
    }
  };

  const handleEditDept = (dept) => {
    setEditingDept(dept);
    setNewDept({ ...dept });
  };

  // ===== Settings =====
  const handleSettingUpdate = async (key, value) => {
    try {
      await API.put(`/admin/settings/${key}`, { value });
      // Update local state
      setSettings(prev => prev.map(s => s.settingKey === key ? { ...s, settingValue: value } : s));
      alert("Setting updated!");
    } catch (error) {
      alert("Failed to update setting");
    }
  };

  const filteredSettings = filterCategory === "ALL"
    ? settings
    : settings.filter(s => s.category === filterCategory);

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h2>⚙️ Admin Settings</h2>
      </div>

      {/* Tabs */}
      <div className="settings-tabs">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          🏥 Hospital Profile
        </button>
        <button className={activeTab === "departments" ? "active" : ""} onClick={() => setActiveTab("departments")}>
          🏛️ Departments
        </button>
        <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>
          ⚙️ System Settings
        </button>
        <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
          🔐 Security
        </button>
        <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>
          📧 Notifications
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="settings-content">
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Hospital Name *</label>
                <input type="text" name="hospitalName" value={profile.hospitalName} onChange={handleProfileChange} required />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input type="text" name="registrationNumber" value={profile.registrationNumber} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input type="text" name="address" value={profile.address} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" value={profile.city} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>State</label>
                <input type="text" name="state" value={profile.state} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Pin Code</label>
                <input type="text" name="pinCode" value={profile.pinCode} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" value={profile.phone} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Website</label>
                <input type="text" name="website" value={profile.website} onChange={handleProfileChange} />
              </div>
              <div className="form-group">
                <label>Established Year</label>
                <input type="text" name="establishedYear" value={profile.establishedYear} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Working Hours</label>
                <input type="text" name="workingHours" value={profile.workingHours} onChange={handleProfileChange} placeholder="e.g. 9:00 AM - 5:00 PM" />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input type="text" name="emergencyContact" value={profile.emergencyContact} onChange={handleProfileChange} />
              </div>
            </div>
            <div className="form-group">
              <label>About Hospital</label>
              <textarea name="about" value={profile.about} onChange={handleProfileChange} rows="4" />
            </div>
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? "Saving..." : "💾 Save Profile"}
            </button>
          </form>
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === "departments" && (
        <div className="settings-content">
          <div className="dept-form-container">
            <h3>{editingDept ? "Edit Department" : "Add New Department"}</h3>
            <form onSubmit={handleDeptSubmit} className="dept-form">
              <input type="text" placeholder="Department Name" value={newDept.name} onChange={(e) => setNewDept({ ...newDept, name: e.target.value })} required />
              <input type="text" placeholder="Description" value={newDept.description} onChange={(e) => setNewDept({ ...newDept, description: e.target.value })} />
              <input type="text" placeholder="Head of Department" value={newDept.headOfDepartment} onChange={(e) => setNewDept({ ...newDept, headOfDepartment: e.target.value })} />
              <select value={newDept.status} onChange={(e) => setNewDept({ ...newDept, status: e.target.value })}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <button type="submit">{editingDept ? "Update" : "Add"} Department</button>
              {editingDept && <button type="button" onClick={() => { setEditingDept(null); setNewDept({ name: "", description: "", headOfDepartment: "", status: "ACTIVE" }); }}>Cancel</button>}
            </form>
          </div>

          <div className="dept-list">
            <h3>All Departments</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Head</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length === 0 ? (
                    <tr><td colSpan="6" className="empty-row">No departments found.</td></tr>
                  ) : (
                    departments.map((dept, idx) => (
                      <tr key={dept.id}>
                        <td>{idx + 1}</td>
                        <td>{dept.name}</td>
                        <td>{dept.description || "N/A"}</td>
                        <td>{dept.headOfDepartment || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${dept.status === "ACTIVE" ? "status-active" : "status-inactive"}`}>
                            {dept.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEditDept(dept)}>✏️</button>
                          <button className="btn-delete" onClick={() => handleDeptDelete(dept.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="settings-content">
          <div className="settings-filter">
            <button className={filterCategory === "ALL" ? "active" : ""} onClick={() => setFilterCategory("ALL")}>All</button>
            <button className={filterCategory === "GENERAL" ? "active" : ""} onClick={() => setFilterCategory("GENERAL")}>General</button>
            <button className={filterCategory === "SECURITY" ? "active" : ""} onClick={() => setFilterCategory("SECURITY")}>Security</button>
            <button className={filterCategory === "NOTIFICATION" ? "active" : ""} onClick={() => setFilterCategory("NOTIFICATION")}>Notification</button>
            <button className={filterCategory === "APPEARANCE" ? "active" : ""} onClick={() => setFilterCategory("APPEARANCE")}>Appearance</button>
          </div>

          <div className="settings-list">
            {filteredSettings.length === 0 ? (
              <div className="empty-state">No settings found.</div>
            ) : (
              filteredSettings.map((setting) => (
                <div key={setting.id} className="setting-item">
                  <div className="setting-info">
                    <span className="setting-key">{setting.settingKey}</span>
                    <span className="setting-description">{setting.description}</span>
                    <span className="setting-category">{setting.category}</span>
                  </div>
                  <div className="setting-control">
                    {setting.dataType === "BOOLEAN" ? (
                      <button
                        className={`toggle-btn ${setting.settingValue === "true" ? "on" : "off"}`}
                        onClick={() => handleSettingUpdate(setting.settingKey, setting.settingValue === "true" ? "false" : "true")}
                      >
                        {setting.settingValue === "true" ? "✅ ON" : "❌ OFF"}
                      </button>
                    ) : (
                      <input
                        type={setting.dataType === "INTEGER" ? "number" : "text"}
                        value={setting.settingValue}
                        onChange={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        onBlur={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        className="setting-input"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="settings-content">
          <div className="security-settings">
            <h3>🔐 Security Settings</h3>
            {settings.filter(s => s.category === "SECURITY").length === 0 ? (
              <div className="empty-state">No security settings found.</div>
            ) : (
              settings.filter(s => s.category === "SECURITY").map((setting) => (
                <div key={setting.id} className="setting-item">
                  <div className="setting-info">
                    <span className="setting-key">{setting.settingKey}</span>
                    <span className="setting-description">{setting.description}</span>
                  </div>
                  <div className="setting-control">
                    {setting.dataType === "BOOLEAN" ? (
                      <button
                        className={`toggle-btn ${setting.settingValue === "true" ? "on" : "off"}`}
                        onClick={() => handleSettingUpdate(setting.settingKey, setting.settingValue === "true" ? "false" : "true")}
                      >
                        {setting.settingValue === "true" ? "✅ ON" : "❌ OFF"}
                      </button>
                    ) : (
                      <input
                        type="number"
                        value={setting.settingValue}
                        onChange={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        onBlur={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        className="setting-input"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="settings-content">
          <div className="notification-settings">
            <h3>📧 Notification Settings</h3>
            {settings.filter(s => s.category === "NOTIFICATION").length === 0 ? (
              <div className="empty-state">No notification settings found.</div>
            ) : (
              settings.filter(s => s.category === "NOTIFICATION").map((setting) => (
                <div key={setting.id} className="setting-item">
                  <div className="setting-info">
                    <span className="setting-key">{setting.settingKey}</span>
                    <span className="setting-description">{setting.description}</span>
                  </div>
                  <div className="setting-control">
                    {setting.dataType === "BOOLEAN" ? (
                      <button
                        className={`toggle-btn ${setting.settingValue === "true" ? "on" : "off"}`}
                        onClick={() => handleSettingUpdate(setting.settingKey, setting.settingValue === "true" ? "false" : "true")}
                      >
                        {setting.settingValue === "true" ? "✅ ON" : "❌ OFF"}
                      </button>
                    ) : (
                      <input
                        type="number"
                        value={setting.settingValue}
                        onChange={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        onBlur={(e) => handleSettingUpdate(setting.settingKey, e.target.value)}
                        className="setting-input"
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSettings;