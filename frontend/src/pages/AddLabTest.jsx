import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddLabTest.css";

function AddLabTest() {
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
    testName: "",
    testType: "",
    result: "",
    normalRange: "",
    remarks: "",
    status: "PENDING",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchPatients();

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
    
    if (!form.patientEmail || !form.testName) {
      alert("Please fill patient and test details");
      return;
    }

    setLoading(true);

    try {
      await API.post("/lab/add", form);
      alert("✅ Lab test added successfully!");
      navigate("/doctor/lab");
    } catch (error) {
      console.error("Error adding lab test:", error);
      alert(error.response?.data?.error || "Failed to add lab test");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-lab-test">
      <div className="lab-header">
        <h2>🔬 Add Lab Test</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="lab-form">
        <div className="form-row">
          <div className="form-group">
            <label>Select Patient *</label>
            <select value={form.patientEmail} onChange={handlePatientSelect} required>
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
            <input type="text" value={form.patientName} readOnly />
          </div>
        </div>

        <div className="form-group">
          <label>Doctor</label>
          <input type="text" value={form.doctorName} readOnly />
        </div>

        <hr />

        <h3>🧪 Test Details</h3>

        <div className="form-row">
          <div className="form-group">
            <label>Test Name *</label>
            <input type="text" name="testName" value={form.testName} onChange={handleChange} placeholder="e.g. Complete Blood Count" required />
          </div>
          <div className="form-group">
            <label>Test Type</label>
            <select name="testType" value={form.testType} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Blood">Blood</option>
              <option value="Urine">Urine</option>
              <option value="X-Ray">X-Ray</option>
              <option value="MRI">MRI</option>
              <option value="CT Scan">CT Scan</option>
              <option value="Ultrasound">Ultrasound</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Result</label>
            <input type="text" name="result" value={form.result} onChange={handleChange} placeholder="Enter test result" />
          </div>
          <div className="form-group">
            <label>Normal Range</label>
            <input type="text" name="normalRange" value={form.normalRange} onChange={handleChange} placeholder="e.g. 4.5 - 11.0" />
          </div>
        </div>

        <div className="form-group">
          <label>Remarks / Notes</label>
          <textarea name="remarks" value={form.remarks} onChange={handleChange} rows="3" placeholder="Any additional notes..." />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : "💾 Save Lab Test"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLabTest;