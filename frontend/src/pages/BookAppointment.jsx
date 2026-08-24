import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./BookAppointment.css";

function BookAppointment() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    patientEmail: userEmail,
    doctorName: "",
    doctorEmail: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  // Fetch all available doctors on load
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await API.get("/doctors/available");
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to load doctors");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If doctor is selected, auto-fill doctorName and doctorEmail
    if (name === "doctorEmail") {
      const selectedDoctor = doctors.find((doc) => doc.email === value);
      if (selectedDoctor) {
        setForm({
          ...form,
          doctorEmail: value,
          doctorName: selectedDoctor.name,
        });
        return;
      }
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await API.post("/appointments/book", form);
      alert("Appointment booked successfully!");
      navigate("/my-appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error.response?.data?.error || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading doctors...</div>;
  }

  return (
    <div className="book-appointment">
      <h2>📅 Book Appointment</h2>

      <form onSubmit={handleSubmit} className="booking-form">

        <div className="form-group">
          <label>Your Name *</label>
          <input
            type="text"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Your Email *</label>
          <input
            type="email"
            name="patientEmail"
            value={form.patientEmail}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Select Doctor *</label>
          <select
            name="doctorEmail"
            value={form.doctorEmail}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.email}>
                {doc.name} - {doc.specialization}
              </option>
            ))}
          </select>
          {form.doctorName && (
            <small>Selected: {form.doctorName}</small>
          )}
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="form-group">
          <label>Time *</label>
          <input
            type="time"
            name="appointmentTime"
            value={form.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason / Symptoms</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your symptoms or reason for visit..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="btn-book" disabled={submitting}>
            {submitting ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookAppointment;