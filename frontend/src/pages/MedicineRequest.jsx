import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MedicineRequest.css";

function MedicineRequest() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    medicineName: "",
    requestedQuantity: "",
    requestor: userEmail,
    patientEmail: "",
    notes: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMedicines();
    fetchPatients();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get("/medicines/admin/all");
      setMedicines(res.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients/admin/all");
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicineName || !form.requestedQuantity) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      await API.post("/medicine-requests/create", form);
      alert("✅ Medicine request sent successfully!");
      navigate("/doctor/medicine-requests");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicine-request">
      <div className="mr-header">
        <h2>💊 Request Medicine</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="mr-form">
        <div className="form-group">
          <label>Medicine Name *</label>
          <select name="medicineName" value={form.medicineName} onChange={handleChange} required>
            <option value="">Select Medicine</option>
            {medicines.map(m => (
              <option key={m.id} value={m.name}>{m.name} (Stock: {m.quantity})</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Quantity Required *</label>
          <input type="number" name="requestedQuantity" value={form.requestedQuantity} onChange={handleChange} min="1" required />
        </div>
        <div className="form-group">
          <label>Patient (Optional)</label>
          <select name="patientEmail" value={form.patientEmail} onChange={handleChange}>
            <option value="">-- Not linked --</option>
            {patients.map(p => <option key={p.id} value={p.email}>{p.name} - {p.email}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="3" placeholder="Any additional details..." />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? "Sending..." : "📨 Send Request"}</button>
        </div>
      </form>
    </div>
  );
}

export default MedicineRequest;