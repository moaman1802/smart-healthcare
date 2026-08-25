import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddReport.css";

function AddReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = localStorage.getItem("userName") || "";

  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patientEmail: "",
    patientName: "",
    doctorEmail: userEmail,
    doctorName: userName,
    reportType: "",
    reportTitle: "",
    reportUrl: "",
    status: "PENDING",
  });

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

  const handlePatientSelect = (e) => {
    const email = e.target.value;
    const patient = patients.find(p => p.email === email);
    if (patient) {
      setForm(prev => ({
        ...prev,
        patientEmail: email,
        patientName: patient.name,
      }));
    }
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
    
    if (!form.patientEmail || !form.reportTitle) {
      alert("Please fill patient and report details");
      return;
    }

    setLoading(true);

    try {
      await API.post("/reports/add", form);
      alert("✅ Report added successfully!");
      navigate("/doctor/reports");
    } catch (error) {
      console.error("Error adding report:", error);
      alert(error.response?.data?.error || "Failed to add report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-report">
      <div className="report-header">
        <h2>📋 Add Medical Report</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="report-form">

        <div className="form-row">
          <div className="form-group">
            <label>Select Patient *</label>
            <select
              value={form.patientEmail}
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
              value={form.patientName}
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <input
            type="text"
            value={form.doctorName}
            readOnly
          />
        </div>

        <hr />

        <h3>📄 Report Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Report Title *</label>
            <input
              type="text"
              name="reportTitle"
              value={form.reportTitle}
              onChange={handleChange}
              placeholder="e.g. Complete Blood Count"
              required
            />
          </div>

          <div className="form-group">
            <label>Report Type</label>
            <input
              type="text"
              name="reportType"
              value={form.reportType}
              onChange={handleChange}
              placeholder="e.g. Blood Test, X-Ray, MRI"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Report URL / File Link</label>
          <input
            type="text"
            name="reportUrl"
            value={form.reportUrl}
            onChange={handleChange}
            placeholder="https://example.com/report.pdf"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Report"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddReport;