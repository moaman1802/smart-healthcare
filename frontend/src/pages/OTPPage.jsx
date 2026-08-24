import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./OTPPage.css";

function OTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  // Check if email is passed from register
  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = localStorage.getItem("tempEmail");
    
    if (stateEmail) {
      setEmail(stateEmail);
      localStorage.setItem("tempEmail", stateEmail);
    } else if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (paste && /^\d+$/.test(paste)) {
      const pasteArray = paste.split("");
      const newOtp = [...otp];
      pasteArray.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      
      // Focus last filled input
      const lastIndex = Math.min(pasteArray.length - 1, 5);
      inputRefs.current[lastIndex].focus();
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/otp/generate", {
        email: email,
        purpose: "REGISTRATION"
      });
      
      setSuccess("✅ OTP sent successfully! Check your console.");
      setShowOtpInput(true);
      localStorage.setItem("tempEmail", email);
    } catch (error) {
      setError(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await API.post("/auth/verify-otp", {
        email: email,
        otp: otpCode
      });

      if (response.data.verified) {
        setSuccess("✅ OTP verified successfully!");
        localStorage.removeItem("tempEmail");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
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
      
      setSuccess("✅ OTP resent successfully!");
      setResendCooldown(30);
      
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
    <div className="otp-container">
      <div className="otp-card">
        <h2>📧 OTP Verification</h2>
        <p className="subtitle">Enter your email to receive OTP</p>

        {/* Email Input */}
        <form onSubmit={handleSendOTP}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={showOtpInput}
              className="email-input"
              required
            />
          </div>

          {!showOtpInput && (
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "📨 Send OTP"}
            </button>
          )}
        </form>

        {/* OTP Input Section */}
        {showOtpInput && (
          <form onSubmit={handleVerifyOTP} className="otp-form">
            <p className="otp-label">Enter 6-digit OTP sent to <strong>{email}</strong></p>

            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="otp-box"
                  autoFocus={index === 0}
                  inputMode="numeric"
                  pattern="[0-9]"
                />
              ))}
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "✅ Verify OTP"}
            </button>

            <div className="resend-section">
              <button 
                type="button"
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
          </form>
        )}

        <p className="back-link">
          <span onClick={() => navigate("/register")}>← Back to Register</span>
        </p>
      </div>
    </div>
  );
}

export default OTPPage;