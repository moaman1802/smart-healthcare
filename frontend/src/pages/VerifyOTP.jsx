import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./VerifyOTP.css";

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email from location state or localStorage
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("tempEmail");
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("tempEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // No email found, go back to register
      navigate("/register");
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/verify-otp", {
        email: email,
        otp: otp
      });

      if (response.data.verified) {
        setSuccess("✅ OTP verified successfully! Redirecting to login...");
        localStorage.removeItem("tempEmail");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await API.post("/auth/resend-otp", {
        email: email,
        purpose: "REGISTRATION"
      });
      setSuccess("✅ OTP resent successfully! Check your console/email.");
      setResendCooldown(30);
      
      // Countdown timer
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error) {
      setError(error.response?.data?.error || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <h2>📧 Verify Your Email</h2>
        <p className="subtitle">We sent a 6-digit OTP to <strong>{email}</strong></p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className="otp-input"
              autoFocus
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading || otp.length < 6}>
            {loading ? "Verifying..." : "✅ Verify OTP"}
          </button>
        </form>

        <div className="resend-section">
          <button 
            onClick={handleResend} 
            disabled={resendCooldown > 0}
            className="resend-btn"
          >
            {resendCooldown > 0 
              ? `Resend OTP (${resendCooldown}s)` 
              : "🔄 Resend OTP"
            }
          </button>
        </div>

        <p className="back-link">
          <span onClick={() => navigate("/register")}>← Back to Register</span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;