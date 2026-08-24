import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MyAppointments.css";

function MyAppointments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await API.get(`/appointments/patient/${userEmail}`);
      setAppointments(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      alert("Failed to load appointments");
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await API.patch(`/appointments/cancel/${id}`);
      alert("Appointment cancelled successfully!");
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "status-pending";
      case "CONFIRMED":
        return "status-confirmed";
      case "COMPLETED":
        return "status-completed";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "⏳ Pending";
      case "CONFIRMED":
        return "✅ Confirmed";
      case "COMPLETED":
        return "✔️ Completed";
      case "CANCELLED":
        return "❌ Cancelled";
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filter === "ALL") return true;
    return app.status === filter;
  });

  if (loading) {
    return <div className="loading">Loading appointments...</div>;
  }

  return (
    <div className="my-appointments">
      <div className="app-header">
        <h2>📋 My Appointments</h2>
        <button className="btn-book" onClick={() => navigate("/book-appointment")}>
          + Book New
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        <button
          className={filter === "PENDING" ? "active" : ""}
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </button>
        <button
          className={filter === "CONFIRMED" ? "active" : ""}
          onClick={() => setFilter("CONFIRMED")}
        >
          Confirmed
        </button>
        <button
          className={filter === "COMPLETED" ? "active" : ""}
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>
        <button
          className={filter === "CANCELLED" ? "active" : ""}
          onClick={() => setFilter("CANCELLED")}
        >
          Cancelled
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="empty-state">
          <p>No appointments found.</p>
          <button className="btn-book" onClick={() => navigate("/book-appointment")}>
            Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="appointments-list">
          {filteredAppointments.map((app) => (
            <div key={app.id} className="appointment-card">
              <div className="appointment-header">
                <h3>👨‍⚕️ {app.doctorName}</h3>
                <span className={`status-badge ${getStatusColor(app.status)}`}>
                  {getStatusBadge(app.status)}
                </span>
              </div>

              <div className="appointment-details">
                <p>
                  <strong>📅 Date:</strong> {app.appointmentDate}
                </p>
                <p>
                  <strong>🕐 Time:</strong> {app.appointmentTime}
                </p>
                <p>
                  <strong>📧 Doctor Email:</strong> {app.doctorEmail}
                </p>
                {app.reason && (
                  <p>
                    <strong>📝 Reason:</strong> {app.reason}
                  </p>
                )}
              </div>

              {app.status === "PENDING" || app.status === "CONFIRMED" ? (
                <div className="appointment-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancel(app.id)}
                  >
                    Cancel Appointment
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyAppointments;