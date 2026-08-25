import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AppointmentDetails.css";

function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    try {
      const response = await API.get(`/appointments/${id}`);
      setAppointment(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      alert("Failed to load appointment details");
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await API.patch(`/appointments/${status}/${id}`);
      alert(`Appointment ${status} successfully!`);
      fetchAppointment();
    } catch (error) {
      alert("Failed to update appointment status");
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

  if (loading) return <div className="loading">Loading appointment details...</div>;
  if (!appointment) return <div className="error">Appointment not found</div>;

  return (
    <div className="appointment-details">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>📅 Appointment Details</h2>
      </div>

      <div className="details-card">
        <div className="status-section">
          <span className={`status-badge-large ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Patient Name</span>
            <span className="value">{appointment.patientName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Patient Email</span>
            <span className="value">{appointment.patientEmail}</span>
          </div>
          <div className="detail-item">
            <span className="label">Doctor Name</span>
            <span className="value">{appointment.doctorName}</span>
          </div>
          <div className="detail-item">
            <span className="label">Doctor Email</span>
            <span className="value">{appointment.doctorEmail}</span>
          </div>
          <div className="detail-item">
            <span className="label">Appointment Date</span>
            <span className="value">{appointment.appointmentDate}</span>
          </div>
          <div className="detail-item">
            <span className="label">Appointment Time</span>
            <span className="value">{appointment.appointmentTime}</span>
          </div>
          {appointment.reason && (
            <div className="detail-item full-width">
              <span className="label">Reason</span>
              <span className="value">{appointment.reason}</span>
            </div>
          )}
        </div>

        <div className="actions-section">
          {appointment.status === "PENDING" && (
            <>
              <button className="btn-confirm" onClick={() => handleStatusUpdate("confirm")}>
                ✅ Confirm
              </button>
              <button className="btn-cancel" onClick={() => handleStatusUpdate("cancel")}>
                ❌ Cancel
              </button>
            </>
          )}
          {appointment.status === "CONFIRMED" && (
            <button className="btn-complete" onClick={() => handleStatusUpdate("complete")}>
              ✔️ Complete
            </button>
          )}
          <button className="btn-prescribe" onClick={() => navigate("/add-prescription", {
            state: {
              patientEmail: appointment.patientEmail,
              patientName: appointment.patientName,
              appointmentId: appointment.id
            }
          })}>
            💊 Prescribe
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetails;