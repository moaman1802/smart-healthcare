import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddPrescription.css";

function AddPrescription() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    patientEmail: "",
    patientName: "",
    doctorEmail: userEmail,
    doctorName: userName,
    appointmentId: null,
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
  });

  // Check if patient email is passed from appointment
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPatients();

    // Check if patient email is passed from appointment
    const state = location.state;
    if (state?.patientEmail) {
      setForm(prev => ({
        ...prev,
        patientEmail: state.patientEmail,
        patientName: state.patientName || "",
        appointmentId: state.appointmentId || null,
      }));
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients/admin/all");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAppointments = async (patientEmail) => {
    try {
      const response = await API.get(`/appointments/patient/${patientEmail}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handlePatientSelect = (e) => {
    const email = e.target.value;
    setSelectedPatient(email);
    const patient = patients.find(p => p.email === email);
    if (patient) {
      setForm(prev => ({
        ...prev,
        patientEmail: email,
        patientName: patient.name,
      }));
      fetchAppointments(email);
    }
  };

  const handleAppointmentSelect = (e) => {
    const appId = e.target.value ? Number(e.target.value) : null;
    setForm(prev => ({
      ...prev,
      appointmentId: appId,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.patientEmail || !form.medicineName) {
      alert("Please fill patient and medicine details");
      return;
    }

    setLoading(true);

    try {
      await API.post("/prescriptions/add", form);
      alert("✅ Prescription added successfully!");
      navigate("/doctor-dashboard");
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert(error.response?.data?.error || "Failed to add prescription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-prescription">
      <div className="prescription-header">
        <h2>📋 Add Prescription</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="prescription-form">

        <div className="form-row">
          <div className="form-group">
            <label>Select Patient *</label>
            <select
              value={selectedPatient}
              onChange={handlePatientSelect}
              required
            >
              <option value="">-- Select Patient --</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.email}>
                  {patient.name} - {patient.email}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={form.patientName}
              readOnly
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Patient Email</label>
            <input
              type="email"
              name="patientEmail"
              value={form.patientEmail}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Doctor</label>
            <input
              type="text"
              value={form.doctorName}
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label>Link to Appointment (Optional)</label>
          <select
            value={form.appointmentId || ""}
            onChange={handleAppointmentSelect}
          >
            <option value="">-- Not linked --</option>
            {appointments.map((app) => (
              <option key={app.id} value={app.id}>
                {app.appointmentDate} - {app.appointmentTime} ({app.status})
              </option>
            ))}
          </select>
        </div>

        <hr />

        <h3>💊 Medicine Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Medicine Name *</label>
            <input
              type="text"
              name="medicineName"
              value={form.medicineName}
              onChange={handleChange}
              placeholder="e.g. Paracetamol"
              required
            />
          </div>

          <div className="form-group">
            <label>Dosage</label>
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="e.g. 500mg, 1 tablet"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Frequency</label>
            <input
              type="text"
              name="frequency"
              value={form.frequency}
              onChange={handleChange}
              placeholder="e.g. Twice daily, Once daily"
            />
          </div>

          <div className="form-group">
            <label>Duration</label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              placeholder="e.g. 5 days, 2 weeks"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Instructions</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows="3"
            placeholder="e.g. Take after meals, Avoid alcohol..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Prescription"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPrescription;