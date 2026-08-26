import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";
import { useToast } from "../components/Toast";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loginMode, setLoginMode] = useState("password"); // "password" or "otp"
  
  // Password Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP Login State
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const [loading, setLoading] = useState(false);

  // ===== PASSWORD LOGIN =====
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userRole", response.data.role);

      toast.showToast("✅ Login successful!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.showToast(error.response?.data?.error || "Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===== SEND OTP =====
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!otpEmail || !otpEmail.includes("@")) {
      toast.showToast("Please enter a valid email", "error");
      return;
    }

    setLoading(true);

    try {
      await API.post("/otp/generate", {
        email: otpEmail,
        purpose: "LOGIN"
      });
      
      toast.showToast("✅ OTP sent successfully! Check your console.", "success");
      setOtpSent(true);
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
      toast.showToast(error.response?.data?.error || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  // ===== OTP LOGIN (Direct) =====
  const handleOTPLogin = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.showToast("Please enter a valid 6-digit OTP", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/otp-login", {
        email: otpEmail,
        otp: otp
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("userName", response.data.name);
      localStorage.setItem("userRole", response.data.role);

      toast.showToast("✅ OTP Login successful!", "success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      toast.showToast(error.response?.data?.error || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>🏥 Smart Healthcare</h2>
          <p>Welcome back! Please login to your account</p>
        </div>

        {/* Login Mode Tabs */}
        <div className="login-tabs">
          <button
            className={`tab-btn ${loginMode === "password" ? "active" : ""}`}
            onClick={() => { setLoginMode("password"); }}
          >
            🔐 Password
          </button>
          <button
            className={`tab-btn ${loginMode === "otp" ? "active" : ""}`}
            onClick={() => { setLoginMode("otp"); setOtpSent(false); }}
          >
            📧 OTP
          </button>
        </div>

        {/* ===== PASSWORD LOGIN FORM ===== */}
        {loginMode === "password" && (
          <form onSubmit={handlePasswordLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "🔐 Login with Password"}
            </button>
          </form>
        )}

        {/* ===== OTP LOGIN FORM ===== */}
        {loginMode === "otp" && (
          <>
            {!otpSent ? (
              <form onSubmit={handleSendOTP}>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "📨 Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOTPLogin}>
                <div className="form-group">
                  <label>OTP sent to <strong>{otpEmail}</strong></label>
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "✅ Verify & Login"}
                </button>

                <div className="resend-section">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={resendCooldown > 0}
                    className="resend-btn"
                  >
                    {resendCooldown > 0
                      ? `Resend OTP (${resendCooldown}s)`
                      : "🔄 Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    className="back-btn"
                  >
                    ← Change Email
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        <div className="login-footer">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;