import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddBill.css";

function AddBill() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    patientEmail: "",
    patientName: "",
    doctorEmail: "",
    doctorName: "",
    appointmentId: "",
    serviceType: "Consultation",
    amount: "",
    tax: "0",
    description: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPatients();
    fetchAppointments();
    const state = location.state;
    if (state?.patientEmail) {
      setForm(prev => ({ ...prev, patientEmail: state.patientEmail, patientName: state.patientName || "" }));
    }
    if (state?.appointmentId) {
      setForm(prev => ({ ...prev, appointmentId: state.appointmentId }));
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients/admin/all");
      setPatients(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments/all");
      setAppointments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatientSelect = (e) => {
    const email = e.target.value;
    const patient = patients.find(p => p.email === email);
    if (patient) {
      setForm(prev => ({ ...prev, patientEmail: email, patientName: patient.name }));
    }
  };

  const handleAppointmentSelect = (e) => {
    const id = e.target.value ? Number(e.target.value) : "";
    const app = appointments.find(a => a.id === id);
    if (app) {
      setForm(prev => ({
        ...prev,
        appointmentId: id,
        patientEmail: app.patientEmail,
        patientName: app.patientName,
        doctorEmail: app.doctorEmail,
        doctorName: app.doctorName,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientEmail || !form.amount) {
      alert("Please fill patient and amount");
      return;
    }
    setLoading(true);
    try {
      await API.post("/bills/generate", form);
      alert("✅ Bill generated successfully!");
      navigate("/admin/bills");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to generate bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-bill">
      <div className="bill-header">
        <h2>💰 Generate Bill</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="bill-form">
        <div className="form-row">
          <div className="form-group">
            <label>Patient *</label>
            <select value={form.patientEmail} onChange={handlePatientSelect} required>
              <option value="">Select Patient</option>
              {patients.map(p => <option key={p.id} value={p.email}>{p.name} - {p.email}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Patient Name</label>
            <input type="text" value={form.patientName} readOnly />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Link Appointment (Optional)</label>
            <select value={form.appointmentId} onChange={handleAppointmentSelect}>
              <option value="">-- Not linked --</option>
              {appointments.map(a => <option key={a.id} value={a.id}>{a.patientName} - {a.appointmentDate}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor</label>
            <input type="text" value={form.doctorName} readOnly />
          </div>
        </div>
        <hr />
        <div className="form-row">
          <div className="form-group">
            <label>Service Type *</label>
            <select name="serviceType" value={form.serviceType} onChange={handleChange} required>
              <option value="Consultation">Consultation</option>
              <option value="Lab Test">Lab Test</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Surgery">Surgery</option>
              <option value="IPD">IPD (Inpatient)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount (₹) *</label>
            <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="e.g. 500" min="0" step="0.01" required />
          </div>
        </div>
        <div className="form-group">
          <label>Tax (₹)</label>
          <input type="number" name="tax" value={form.tax} onChange={handleChange} placeholder="e.g. 18" min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Additional details..." />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? "Generating..." : "💳 Generate Bill"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddBill;