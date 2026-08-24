import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminAppointments.css";

function AdminAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDoctor, setFilterDoctor] = useState("ALL");
  const [filterPatient, setFilterPatient] = useState("ALL");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await API.get("/appointments/all");
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to load appointments");
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors/all");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients/admin/all");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    fetchAppointments();
  };

  const handleFilterDoctor = async (doctorEmail) => {
    setFilterDoctor(doctorEmail);
    if (doctorEmail === "ALL") {
      fetchAppointments();
      return;
    }
    try {
      const response = await API.get(`/appointments/doctor/${doctorEmail}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Filter doctor error:", error);
    }
  };

  const handleFilterPatient = async (patientEmail) => {
    setFilterPatient(patientEmail);
    if (patientEmail === "ALL") {
      fetchAppointments();
      return;
    }
    try {
      const response = await API.get(`/appointments/patient/${patientEmail}`);
      setAppointments(response.data);
    } catch (error) {
      console.error("Filter patient error:", error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/appointments/${status}/${id}`);
      alert(`Appointment ${status} successfully!`);
      fetchAppointments();
    } catch (error) {
      alert("Failed to update appointment status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await API.delete(`/appointments/admin/delete/${id}`);
      alert("Appointment deleted successfully!");
      fetchAppointments();
    } catch (error) {
      alert("Failed to delete appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "status-pending";
      case "CONFIRMED": return "status-confirmed";
      case "COMPLETED": return "status-completed";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="admin-appointments">
      <div className="admin-header">
        <h2>📅 Appointment Management</h2>
        <button className="btn-add" onClick={() => navigate("/book-appointment")}>
          + Book New
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <span>Status:</span>
          <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
          <button className={filterStatus === "PENDING" ? "active" : ""} onClick={() => handleFilterStatus("PENDING")}>Pending</button>
          <button className={filterStatus === "CONFIRMED" ? "active" : ""} onClick={() => handleFilterStatus("CONFIRMED")}>Confirmed</button>
          <button className={filterStatus === "COMPLETED" ? "active" : ""} onClick={() => handleFilterStatus("COMPLETED")}>Completed</button>
          <button className={filterStatus === "CANCELLED" ? "active" : ""} onClick={() => handleFilterStatus("CANCELLED")}>Cancelled</button>
        </div>

        <div className="filter-group">
          <span>Doctor:</span>
          <select value={filterDoctor} onChange={(e) => handleFilterDoctor(e.target.value)}>
            <option value="ALL">All Doctors</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.email}>{doc.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <span>Patient:</span>
          <select value={filterPatient} onChange={(e) => handleFilterPatient(e.target.value)}>
            <option value="ALL">All Patients</option>
            {patients.map(p => (
              <option key={p.id} value={p.email}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr><td colSpan="7" className="empty-row">No appointments found.</td></tr>
            ) : (
              appointments.map((app, index) => (
                <tr key={app.id}>
                  <td>{index + 1}</td>
                  <td>{app.patientName}</td>
                  <td>{app.doctorName}</td>
                  <td>{app.appointmentDate}</td>
                  <td>{app.appointmentTime}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.status === "PENDING" && (
                      <>
                        <button className="btn-confirm" onClick={() => handleStatusUpdate(app.id, "confirm")}>✅</button>
                        <button className="btn-cancel" onClick={() => handleStatusUpdate(app.id, "cancel")}>❌</button>
                      </>
                    )}
                    {app.status === "CONFIRMED" && (
                      <button className="btn-complete" onClick={() => handleStatusUpdate(app.id, "complete")}>✔️</button>
                    )}
                    <button className="btn-delete" onClick={() => handleDelete(app.id)}>🗑️</button>
                    <button className="btn-view" onClick={() => navigate(`/appointment/${app.id}`)}>👁️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminAppointments;