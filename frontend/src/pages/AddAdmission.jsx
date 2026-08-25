import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddAdmission.css";

function AddAdmission() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patientEmail: "",
    patientName: "",
    doctorEmail: "",
    doctorName: "",
    bedId: "",
    bedNumber: "",
    ward: "",
    reason: "",
    diagnosis: "",
    notes: "",
    status: "ADMITTED",
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchPatients();
    fetchBeds();
    fetchDoctors();
    const state = location.state;
    if (state?.patientEmail) {
      setForm(prev => ({ ...prev, patientEmail: state.patientEmail, patientName: state.patientName || "" }));
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get("/patients/admin/all");
      setPatients(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchBeds = async () => {
    try {
      const res = await API.get("/beds/available");
      setBeds(res.data);
    } catch (error) { console.error(error); }
  };

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors/all");
      setDoctors(res.data);
    } catch (error) { console.error(error); }
  };

  const handlePatientSelect = (e) => {
    const email = e.target.value;
    const patient = patients.find(p => p.email === email);
    if (patient) {
      setForm(prev => ({ ...prev, patientEmail: email, patientName: patient.name }));
    }
  };

  const handleDoctorSelect = (e) => {
    const email = e.target.value;
    const doctor = doctors.find(d => d.email === email);
    if (doctor) {
      setForm(prev => ({ ...prev, doctorEmail: email, doctorName: doctor.name }));
    }
  };

  const handleBedSelect = (e) => {
    const id = e.target.value ? Number(e.target.value) : "";
    const bed = beds.find(b => b.id === id);
    if (bed) {
      setForm(prev => ({
        ...prev,
        bedId: id,
        bedNumber: bed.bedNumber,
        ward: bed.ward,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientEmail || !form.bedId) {
      alert("Please select patient and bed");
      return;
    }
    setLoading(true);
    try {
      await API.post("/admissions/admit", form);
      alert("✅ Patient admitted successfully!");
      navigate("/admissions");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to admit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-admission">
      <div className="admission-header">
        <h2>🏥 Admit Patient</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="admission-form">
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
            <label>Doctor *</label>
            <select value={form.doctorEmail} onChange={handleDoctorSelect} required>
              <option value="">Select Doctor</option>
              {doctors.map(d => <option key={d.id} value={d.email}>{d.name} - {d.specialization}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Doctor Name</label>
            <input type="text" value={form.doctorName} readOnly />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Bed *</label>
            <select value={form.bedId} onChange={handleBedSelect} required>
              <option value="">Select Available Bed</option>
              {beds.map(b => <option key={b.id} value={b.id}>{b.bedNumber} - {b.ward} ({b.bedType})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Ward</label>
            <input type="text" value={form.ward} readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Reason for Admission</label>
          <input type="text" name="reason" value={form.reason} onChange={handleChange} placeholder="e.g. Fever, Surgery" />
        </div>
        <div className="form-group">
          <label>Diagnosis</label>
          <input type="text" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="Initial diagnosis" />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows="2" placeholder="Additional notes..." />
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? "Admitting..." : "🏥 Admit Patient"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddAdmission;