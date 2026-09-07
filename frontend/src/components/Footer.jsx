import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./Footer.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Column 1: Brand */}
        <div className="footer-col">
          <h3 className="footer-brand">🏥 Smart Health</h3>
          <p className="footer-tagline">
            Your trusted healthcare partner. We provide quality medical services
            with care and compassion.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/book-appointment">Book Appointment</Link></li>
            <li><Link to="/admin/doctors">Doctors</Link></li>
            <li><Link to="/admin/patients">Patients</Link></li>
            <li><Link to="/my-reports">Medical Reports</Link></li>
          </ul>
        </div>

        {/* Column 3: Services */}
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul className="footer-links">
            <li><Link to="/book-appointment">Appointments</Link></li>
            <li><Link to="/ai-symptom-checker">AI Symptom Checker</Link></li>
            <li><Link to="/pharmacy">Pharmacy</Link></li>
            <li><Link to="/admin/lab">Laboratory</Link></li>
            <li><Link to="/billing/dashboard">Billing</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <ul className="footer-contact">
            <li><FaPhoneAlt /> +91-9999999999</li>
            <li><FaEnvelope /> support@smarthealth.com</li>
            <li><FaMapMarkerAlt /> 123, Health City, Mumbai</li>
            <li><FaClock /> 24/7 Emergency Services</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          &copy; {currentYear} Smart Healthcare. All rights reserved. | 
          <Link to="/privacy"> Privacy Policy</Link> | 
          <Link to="/terms"> Terms of Service</Link>
        </p>
        <p className="footer-disclaimer">
          <FaExclamationTriangle style={{ marginRight: "6px" }} />
          Medical Disclaimer: For medical emergencies, please call 108 or visit your nearest emergency room.
        </p>
      </div>
    </footer>
  );
}

export default Footer;