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

  // 🔥 NEW: Availability Check State
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [available, setAvailable] = useState(false);

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

  // 🔥 NEW: Check Availability
  const checkAvailability = async () => {
    if (!form.doctorEmail || !form.appointmentDate) {
      alert("Please select doctor and date first");
      return;
    }
    try {
      const dayOfWeek = new Date(form.appointmentDate).toLocaleString('en-us', { weekday: 'long' }).toUpperCase();
      const response = await API.get(`/availability/slots?doctorEmail=${form.doctorEmail}&dayOfWeek=${dayOfWeek}`);
      setAvailableSlots(response.data);
      setAvailabilityChecked(true);
      setAvailable(response.data.length > 0);
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("Failed to check availability");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset availability when doctor or date changes
    if (name === "doctorEmail" || name === "appointmentDate") {
      setAvailabilityChecked(false);
      setAvailableSlots([]);
    }

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

  // 🔥 NEW: Select slot and auto-fill time
  const selectSlot = (slot) => {
    setForm({
      ...form,
      appointmentTime: slot,
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

        {/* 🔥 NEW: Availability Check Section */}
        {form.doctorEmail && form.appointmentDate && (
          <div className="form-group availability-section">
            <button type="button" className="btn-check-avail" onClick={checkAvailability}>
              🔍 Check Available Slots
            </button>
            {availabilityChecked && (
              <div className="slots-container">
                {available ? (
                  <>
                    <p className="avail-success">✅ Available slots:</p>
                    <div className="slots-list">
                      {availableSlots.map((slot, i) => (
                        <span
                          key={i}
                          className={`slot-chip ${form.appointmentTime === slot ? "selected" : ""}`}
                          onClick={() => selectSlot(slot)}
                        >
                          {slot}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="avail-error">❌ No available slots for this day</p>
                )}
              </div>
            )}
          </div>
        )}

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