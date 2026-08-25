import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./DoctorAppointments.css";

function DoctorAppointments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL"); // 🔥 NEW

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await API.get(`/appointments/doctor/${userEmail}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${status}/${id}`);
      alert(`Appointment ${status} successfully!`);
      fetchAppointments();
    } catch (error) {
      alert("Failed to update appointment");
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

  // 🔥 NEW: Get Filtered Appointments
  const getFilteredAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    let filtered = appointments;

    // Status filter
    if (filterStatus !== "ALL") {
      filtered = filtered.filter(a => a.status === filterStatus);
    }

    // Date filter
    if (dateFilter === "TODAY") {
      filtered = filtered.filter(a => a.appointmentDate === today);
    } else if (dateFilter === "UPCOMING") {
      filtered = filtered.filter(a => a.appointmentDate > today);
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) return <div className="loading">Loading appointments...</div>;

  return (
    <div className="doctor-appointments">
      <div className="app-header">
        <h2>👨‍⚕️ My Appointments</h2>
        <span className="count">{appointments.length} total</span>
      </div>

      <div className="filter-bar">
        <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => setFilterStatus("ALL")}>All</button>
        <button className={filterStatus === "PENDING" ? "active" : ""} onClick={() => setFilterStatus("PENDING")}>Pending</button>
        <button className={filterStatus === "CONFIRMED" ? "active" : ""} onClick={() => setFilterStatus("CONFIRMED")}>Confirmed</button>
        <button className={filterStatus === "COMPLETED" ? "active" : ""} onClick={() => setFilterStatus("COMPLETED")}>Completed</button>
        <button className={filterStatus === "CANCELLED" ? "active" : ""} onClick={() => setFilterStatus("CANCELLED")}>Cancelled</button>
        {/* 🔥 NEW: Date Filter */}
        <button className={dateFilter === "TODAY" ? "active" : ""} onClick={() => setDateFilter("TODAY")}>Today</button>
        <button className={dateFilter === "UPCOMING" ? "active" : ""} onClick={() => setDateFilter("UPCOMING")}>Upcoming</button>
        {dateFilter !== "ALL" && (
          <button className="active" onClick={() => setDateFilter("ALL")}>Clear</button>
        )}
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state"><p>No appointments found.</p></div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((app) => (
            <div key={app.id} className="appointment-card">
              <div className="card-header">
                <h3>👤 {app.patientName}</h3>
                <span className={`status-badge ${getStatusColor(app.status)}`}>{app.status}</span>
              </div>
              <div className="card-details">
                <p>📅 {app.appointmentDate} | 🕐 {app.appointmentTime}</p>
                <p>📧 {app.patientEmail}</p>
                {app.reason && <p>📝 {app.reason}</p>}
              </div>
              <div className="card-actions">
                {app.status === "PENDING" && (
                  <>
                    <button className="btn-confirm" onClick={() => handleStatus(app.id, "confirm")}>✅ Confirm</button>
                    <button className="btn-cancel" onClick={() => handleStatus(app.id, "cancel")}>❌ Cancel</button>
                  </>
                )}
                {app.status === "CONFIRMED" && (
                  <button className="btn-complete" onClick={() => handleStatus(app.id, "complete")}>✔️ Complete</button>
                )}
                <button 
                  className="btn-prescribe" 
                  onClick={() => navigate("/add-prescription", { 
                    state: { 
                      patientEmail: app.patientEmail, 
                      patientName: app.patientName, 
                      appointmentId: app.id 
                    } 
                  })}
                >
                  💊 Prescribe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorAppointments;