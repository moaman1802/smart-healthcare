import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "PATIENT"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/register", form);

      console.log("📝 Register Response:", response);
      console.log("📝 Response Status:", response.status);

      if (response.status === 201) {
        localStorage.setItem("tempEmail", form.email);
        alert("Registration successful! Please verify your email with OTP.");
        
        // ✅ Use setTimeout to ensure state updates before navigation
        setTimeout(() => {
          console.log("🔀 Navigating to OTP page with email:", form.email);
          navigate("/otp-page", { state: { email: form.email } });
        }, 100);
      }
    } catch (error) {
      console.error("❌ Register Error:", error);
      alert(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>🏥 Smart Healthcare</h2>
          <p>Create your account to get started</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "📝 Register"}
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;