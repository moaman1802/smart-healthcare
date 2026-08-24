import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./PatientDetails.css";

function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await API.get(`/patients/${id}`);
      setPatient(response.data);
      // After patient loaded, fetch medical history
      fetchMedicalHistory(response.data.email);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching patient:", error);
      alert("Failed to load patient details");
      setLoading(false);
    }
  };

  const fetchMedicalHistory = async (email) => {
    setHistoryLoading(true);
    try {
      const [appRes, presRes, repRes] = await Promise.all([
        API.get(`/appointments/patient/${email}`),
        API.get(`/prescriptions/patient/${email}`),
        API.get(`/reports/patient/${email}`)
      ]);
      setAppointments(appRes.data || []);
      setPrescriptions(presRes.data || []);
      setReports(repRes.data || []);
    } catch (error) {
      console.error("Error fetching medical history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading patient details...</div>;
  if (!patient) return <div className="error">Patient not found</div>;

  return (
    <div className="patient-details">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>👤 Patient Profile</h2>
      </div>

      {/* Patient Info Card */}
      <div className="patient-info-card">
        <div className="info-row">
          <span className="label">Name</span>
          <span className="value">{patient.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Email</span>
          <span className="value">{patient.email}</span>
        </div>
        <div className="info-row">
          <span className="label">Phone</span>
          <span className="value">{patient.phone || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="label">Age</span>
          <span className="value">{patient.age || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="label">Gender</span>
          <span className="value">{patient.gender || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="label">Blood Group</span>
          <span className="value blood">{patient.bloodGroup || "N/A"}</span>
        </div>
        <div className="info-row">
          <span className="label">Address</span>
          <span className="value">{patient.address || "N/A"}</span>
        </div>
      </div>

      {/* Medical History Tabs */}
      <div className="history-tabs">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          📋 Profile
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => setActiveTab("appointments")}
        >
          📅 Appointments ({appointments.length})
        </button>
        <button
          className={activeTab === "prescriptions" ? "active" : ""}
          onClick={() => setActiveTab("prescriptions")}
        >
          💊 Prescriptions ({prescriptions.length})
        </button>
        <button
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          📋 Reports ({reports.length})
        </button>
      </div>

      <div className="history-content">
        {historyLoading && <p className="loading-text">Loading history...</p>}

        {activeTab === "profile" && (
          <div className="profile-summary">
            <h3>Profile Summary</h3>
            <p><strong>Total Appointments:</strong> {appointments.length}</p>
            <p><strong>Total Prescriptions:</strong> {prescriptions.length}</p>
            <p><strong>Total Reports:</strong> {reports.length}</p>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="history-list">
            {appointments.length === 0 ? (
              <p className="empty">No appointments found.</p>
            ) : (
              appointments.map((app) => (
                <div key={app.id} className="history-item">
                  <div className="item-header">
                    <span className="item-title">👨‍⚕️ {app.doctorName}</span>
                    <span className={`status-badge ${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="item-details">
                    <span>📅 {app.appointmentDate}</span>
                    <span>🕐 {app.appointmentTime}</span>
                    <span>📧 {app.doctorEmail}</span>
                    {app.reason && <span>📝 {app.reason}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "prescriptions" && (
          <div className="history-list">
            {prescriptions.length === 0 ? (
              <p className="empty">No prescriptions found.</p>
            ) : (
              prescriptions.map((pres) => (
                <div key={pres.id} className="history-item">
                  <div className="item-header">
                    <span className="item-title">💊 {pres.medicineName}</span>
                    <span className={`status-badge ${pres.status.toLowerCase()}`}>
                      {pres.status}
                    </span>
                  </div>
                  <div className="item-details">
                    <span>👨‍⚕️ Dr. {pres.doctorName}</span>
                    <span>📅 {pres.prescribedDate}</span>
                    <span>💊 {pres.dosage}</span>
                    <span>🕐 {pres.frequency}</span>
                    <span>📆 {pres.duration}</span>
                    {pres.instructions && <span>📝 {pres.instructions}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="history-list">
            {reports.length === 0 ? (
              <p className="empty">No reports found.</p>
            ) : (
              reports.map((rep) => (
                <div key={rep.id} className="history-item">
                  <div className="item-header">
                    <span className="item-title">📋 {rep.reportTitle}</span>
                    <span className={`status-badge ${rep.status.toLowerCase()}`}>
                      {rep.status}
                    </span>
                  </div>
                  <div className="item-details">
                    <span>👨‍⚕️ Dr. {rep.doctorName}</span>
                    <span>📅 {rep.reportDate}</span>
                    <span>📋 {rep.reportType}</span>
                    {rep.reportUrl && (
                      <a href={rep.reportUrl} target="_blank" rel="noopener noreferrer">
                        🔗 View Report
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDetails;