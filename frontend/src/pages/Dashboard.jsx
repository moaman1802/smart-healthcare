import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import API from "../api/api";
import Notifications from '../components/Notifications';
import Footer from '../components/Footer';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

const iconPaths = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  doctor: "M15 20a6 6 0 0 0-12 0M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM16 3v6m-3-3h6",
  patient: "M15 20a6 6 0 0 0-12 0M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M16 11h5m-2.5-2.5v5",
  calendar: "M5 3v4m14-4v4M3 9h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8m6-7a4 4 0 0 1 0 8m4 9v-2a4 4 0 0 0-3-3.87",
  pharmacy: "M4 7h16v14H4zM7 7V4h10v3M8 12h8m-4-3v6",
  prescription: "M6 3h12v18H6zM9 7h6m-6 4h6m-6 4h4",
  alert: "M12 3 2 21h20L12 3Zm0 6v4m0 4h.01",
  inventory: "m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7m-9 4v10",
  bill: "M6 2h12v20l-3-2-3 2-3-2-3 2V2Zm3 5h6m-6 4h6m-6 4h4",
  bed: "M3 18v-8m0 4h18v4M5 14V8h5a3 3 0 0 1 3 3v3m8 4v-8",
  hospital: "M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M8 7h8m-4-3v6M8 13h2m4 0h2M8 17h2m4 0h2",
  ward: "M4 21V5l8-3 8 3v16M8 9h8m-8 4h8m-8 4h8",
  lab: "M9 3h6m-5 0v7l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3m-5 10h8",
  report: "M6 2h9l4 4v16H6zM14 2v5h5m-9 4h5m-5 4h5m-5 4h3",
  robot: "M8 9h8m-8 4h.01m7.99 0h.01M12 5V2m-7 7h14v9H5zM8 21h8",
  settings: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-3.5 1.6 1.2-2 3.4-1.9-.8a7.7 7.7 0 0 1-1.7 1l-.3 2h-4l-.3-2a7.7 7.7 0 0 1-1.7-1l-1.9.8-2-3.4 1.6-1.2a7.6 7.6 0 0 1 0-2L3.2 9.8l2-3.4 1.9.8a7.7 7.7 0 0 1 1.7-1l.3-2h4l.3 2a7.7 7.7 0 0 1 1.7 1l1.9-.8 2 3.4-1.6 1.2a7.6 7.6 0 0 1 0 2Z",
  search: "m21 21-4.3-4.3m2.3-5.2a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z",
  logout: "M10 17l5-5-5-5m5 5H3m9-9V3a2 2 0 0 1 2-2h6v22h-6a2 2 0 0 1-2-2v-1",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M4 6h16M4 12h16M4 18h16",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2",
};

function VectorIcon({ name, size = 18 }) {
  return (
    <svg
      aria-hidden="true"
      className="vector-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={iconPaths[name] || iconPaths.dashboard} />
    </svg>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "PATIENT";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Dashboard data states
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalDoctors: 0,
    totalReports: 0,
    totalPatients: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appointmentStats, setAppointmentStats] = useState([
    { name: "Pending", value: 0 },
    { name: "Confirmed", value: 0 },
    { name: "Completed", value: 0 },
    { name: "Cancelled", value: 0 },
  ]);

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userName
  )}&background=2f6fed&color=ffffff&bold=true&rounded=true&size=128`;

  const logoImg = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png";
  const heroIllustration = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
  const statImages = {
    Appointments: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
    Doctors: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    Reports: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
    Patients: "https://cdn-icons-png.flaticon.com/512/4185/4185481.png",
  };
  const statAccent = {
    Appointments: "blue",
    Doctors: "purple",
    Reports: "amber",
    Patients: "green",
  };

  // 🔥 Search handlers
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/admin/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/admin/patients");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // ===== DOCTORS SHOWCASE =====
  const doctorShowcase = [
    {
      specialization: "Cardiologist",
      sub: "Heart & Vascular Care",
      content: [
        "Expert heart care with advanced diagnosis, treatment, and personalized guidance for maintaining a healthy heart and managing cardiovascular conditions"
      ],
      image:
        "https://eremedium.in/wp-content/uploads/2022/06/18-Importance-of-Cardiology-Videos.jpg"
    },
    {
      specialization: "General Physician",
      sub: "Primary Care & Family Medicine",
      content: [
        "Providing comprehensive healthcare through expert consultations, routine health checkups, accurate diagnosis, and effective treatment. Our General Physicians help manage common illnesses, infections, chronic health conditions, and everyday medical concerns while focusing on personalized and preventive patient care."
      ],
      image: "https://www.camryhospitals.shenoydemo.org/wp-content/uploads/2022/12/general-physician.jpg",
    },
    {
      specialization: "Orthopedic Surgeon",
      sub: "Bone, Joint & Muscle Treatment",
      content: [
        "Providing specialized care for bones, joints, muscles, and the overall musculoskeletal system. Our Orthopedic Surgeons offer expert consultation, accurate diagnosis, and effective treatment for injuries, fractures, joint problems, arthritis, and other orthopedic conditions."
      ],
      image: "https://img.magnific.com/free-photo/chiropractor-provides-aid-patient_482257-90376.jpg?semt=ais_hybrid&w=740&q=80",
    },
    {
      specialization: "Neurologist",
      sub: "Brain & Nervous System Care",
      content: [
        "Providing specialized care for conditions affecting the brain, spinal cord, and nervous system. Our Neurologists offer expert consultation, accurate diagnosis, and personalized treatment for headaches, migraines, seizures, nerve disorders, and other neurological conditions."
      ],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQeukqG-TALhO9ZbqMZmA8p4rwwW2aSv6F3bgsM9FJzjPC4_xnI47R448&s=10",
    },
  ];

  // ===== LAB SHOWCASE =====
  const labShowcase = [
    {
      title: "Pathology Lab",
      sub: "Blood Tests, Biopsies & Diagnostic Screening",
      content: [
        "Reliable diagnostic testing with accurate blood tests, biopsies, health screenings, and laboratory investigations. Our Pathology Lab uses advanced technology and reliable procedures to provide timely results that help doctors make informed decisions and support effective patient care."
      ],
      image: "https://static.vecteezy.com/system/resources/thumbnails/072/461/013/small/female-scientist-using-microscope-in-laboratory-setting-free-photo.jpg",
    },
    {
      title: "Diagnostic Lab",
      sub: "Advanced Sample Analysis & Reporting",
      content: [
        "Advanced diagnostic services with accurate sample analysis, laboratory testing, health screenings, and detailed reporting. Our Diagnostic Lab uses modern technology and reliable testing procedures to deliver timely, precise results that support doctors in diagnosis and effective patient care."
      ],
      image: "https://franchiseindia.s3.ap-south-1.amazonaws.com/uploads/content/fi/art/pathology-behind-launching-a-dia-950c1f7f2e.jpg",
    },
  ];

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        API.get("/dashboard/stats"),
        API.get("/dashboard/recent?limit=5"),
      ]);

      setStats({
        totalAppointments: statsRes.data.totalAppointments || 0,
        totalDoctors: statsRes.data.totalDoctors || 0,
        totalReports: statsRes.data.totalReports || 0,
        totalPatients: statsRes.data.totalPatients || 0,
      });
      setRecentActivities(recentRes.data);

      const total = statsRes.data.totalAppointments || 1;
      setAppointmentStats([
        { name: "Pending", value: Math.floor(total * 0.3) },
        { name: "Confirmed", value: Math.floor(total * 0.4) },
        { name: "Completed", value: Math.floor(total * 0.2) },
        { name: "Cancelled", value: Math.floor(total * 0.1) },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  // ===== ROLE-BASED SIDEBAR NAV =====
  const getSidebarNav = () => {
    const common = [{ icon: "dashboard", label: "Dashboard", path: "/dashboard" }];

    if (userRole === "ADMIN") {
      return [
        ...common,
        { icon: "doctor", label: "Manage Doctors", path: "/admin/doctors" },
        { icon: "patient", label: "Manage Patients", path: "/admin/patients" },
        { icon: "calendar", label: "Manage Appointments", path: "/admin/appointments" },
        { icon: "users", label: "Manage Users", path: "/admin/users" },
        { icon: "pharmacy", label: "Pharmacy Dashboard", path: "/pharmacy" },
        { icon: "prescription", label: "Prescriptions", path: "/prescriptions/manage" },
        { icon: "alert", label: "Low Stock Alerts", path: "/low-stock" },
        { icon: "inventory", label: "Inventory", path: "/inventory" },
        { icon: "bill", label: "Bills", path: "/admin/bills" },
        { icon: "bill", label: "Billing Dashboard", path: "/billing/dashboard" },
        { icon: "bed", label: "Beds", path: "/beds" },
        { icon: "hospital", label: "Admissions", path: "/admissions" },
        { icon: "hospital", label: "IPD Dashboard", path: "/ipd/dashboard" },
        { icon: "ward", label: "Manage Wards", path: "/wards" },
        { icon: "lab", label: "Laboratory", path: "/admin/lab" },
        { icon: "report", label: "Reports & Analytics", path: "/reports" },
        { icon: "robot", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "robot", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
        { icon: "settings", label: "Admin Settings", path: "/admin/settings" },
      ];
    }

    if (userRole === "DOCTOR") {
      return [
        ...common,
        { icon: "calendar", label: "My Appointments", path: "/doctor/appointments" },
        { icon: "prescription", label: "Add Prescription", path: "/add-prescription" },
        { icon: "report", label: "Add Report", path: "/add-report" },
        { icon: "report", label: "My Reports", path: "/doctor/reports" },
        { icon: "pharmacy", label: "Request Medicine", path: "/medicine-request" },
        { icon: "lab", label: "Add Lab Test", path: "/add-lab-test" },
        { icon: "lab", label: "My Lab Tests", path: "/doctor/lab" },
        { icon: "hospital", label: "Admit Patient", path: "/add-admission" },
        { icon: "robot", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "robot", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
      ];
    }

    // PATIENT
    return [
      ...common,
      { icon: "calendar", label: "Book Appointment", path: "/book-appointment" },
      { icon: "calendar", label: "My Appointments", path: "/my-appointments" },
      { icon: "prescription", label: "My Prescriptions", path: "/my-prescriptions" },
      { icon: "report", label: "My Reports", path: "/my-reports" },
      { icon: "lab", label: "My Lab Tests", path: "/my-lab-tests" },
      { icon: "bill", label: "My Bills", path: "/my-bills" },
      { icon: "robot", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
      { icon: "robot", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
    ];
  };

  // ===== ROLE-BASED STATS =====
  const getStats = () => {
    const allStats = [
      { icon: "calendar", label: "Appointments", value: stats.totalAppointments },
      { icon: "doctor", label: "Doctors", value: stats.totalDoctors },
      { icon: "report", label: "Reports", value: stats.totalReports },
      { icon: "patient", label: "Patients", value: stats.totalPatients },
    ];
    if (userRole === "ADMIN") return allStats;
    if (userRole === "DOCTOR") return allStats;
    return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={toggleSidebar} aria-label="Open navigation">
        <VectorIcon name="menu" />
      </button>
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img className="sidebar-logo" src={logoImg} alt="Smart Health logo" style={{ height: "auto" }} />
            <h2>Smart Health</h2>
          </div>
          <button className="close-sidebar" onClick={closeSidebar} aria-label="Close navigation">
            <VectorIcon name="close" />
          </button>
        </div>

        <nav>
          {getSidebarNav().map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                navigate(item.path);
                closeSidebar();
              }}
            >
              <span className="nav-icon"><VectorIcon name={item.icon} /></span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <img className="sidebar-avatar" src={avatarUrl} alt={`${userName} avatar`} style={{ height: "auto" }} />
          <div className="sidebar-profile-text">
            <p className="sidebar-profile-name">{userName}</p>
            <span className="sidebar-profile-role">{userRole}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <VectorIcon name="logout" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Top bar */}
        <header className="topbar">
          <h1 className="topbar-title"><VectorIcon name="dashboard" /> Dashboard</h1>

          {/* 🔥 SEARCH BAR — NOW FUNCTIONAL */}
          <div className="topbar-search">
            <span className="search-icon" onClick={handleSearch} style={{ cursor: "pointer" }}>
              <VectorIcon name="search" />
            </span>
            <input
              type="text"
              placeholder="Search Patient Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchQuery && (
              <span
                className="clear-search"
                onClick={() => setSearchQuery("")}
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#9ca3af",
                  padding: "0 4px",
                  marginLeft: "4px",
                }}
              >
                ✕
              </span>
            )}
          </div>

          <div className="topbar-right">
            <Notifications />
            <div className="user-info">
              <img className="user-info-avatar" src={avatarUrl} alt={`${userName} avatar`} style={{ height: "auto" }} />
              <div className="user-info-text">
                <span className="user-info-name">{userName}</span>
                <span className="user-info-role">{userRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero banner */}
        <section className="hero-banner">
          <div className="hero-text">
            <p className="hero-label">Welcome back</p>
            <h2>{userName}</h2>
            <p className="hero-sub">Role: {userRole}</p>
            <div className="hero-metrics">
              <div className="hero-metric">
                <span className="hero-metric-label">Appointments</span>
                <span className="hero-metric-value">{stats.totalAppointments}</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-label">Reports</span>
                <span className="hero-metric-value">{stats.totalReports}</span>
              </div>
            </div>
          </div>
          <img className="hero-illustration" src={heroIllustration} alt="Healthcare illustration" style={{ height: "auto" }} />
        </section>

        {/* Stats */}
        <section className="stats">
          {getStats().map((stat, idx) => (
            <div key={idx} className={`stat-card accent-${statAccent[stat.label] || "blue"}`}>
              <div className="stat-icon-wrap">
                <img className="stat-icon-img" src={statImages[stat.label]} alt={stat.label} style={{ height: "auto" }} />
                <span className="stat-icon"><VectorIcon name={stat.icon} /></span>
              </div>
              <div className="stat-text">
                <h3>{stat.label}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="charts-section">
          <h2><VectorIcon name="report" /> Analytics</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Appointment Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={appointmentStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {appointmentStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Weekly Appointments (Sample)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { day: "Mon", count: 4 },
                    { day: "Tue", count: 7 },
                    { day: "Wed", count: 5 },
                    { day: "Thu", count: 9 },
                    { day: "Fri", count: 6 },
                    { day: "Sat", count: 3 },
                    { day: "Sun", count: 2 },
                  ]}
                >
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2f6fed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* ===== DOCTORS & LAB SHOWCASE ===== */}
        <section className="showcase-section">
          <div className="section-title-row">
            <h2><VectorIcon name="doctor" /> Our Doctors</h2>
            <span className="section-line"></span>
          </div>
          {doctorShowcase.map((doc, idx) => (
            <div key={idx} className={`doctor-row ${idx % 2 === 1 ? 'image-left' : ''}`}>
              <div className="doctor-content">
                <h3>{doc.specialization}</h3>
                <div className="specialty-sub">{doc.sub}</div>
                {doc.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <span className="cta-link" onClick={() => navigate("/admin/doctors")}>
                  View all doctors →
                </span>
              </div>
              <div className="doctor-image">
                <img src={doc.image} alt={doc.specialization} style={{ height: "auto" }} />
              </div>
            </div>
          ))}

          <div className="section-title-row" style={{ marginTop: "30px" }}>
            <h2><VectorIcon name="lab" /> Laboratory Services</h2>
            <span className="section-line"></span>
          </div>
          {labShowcase.map((lab, idx) => (
            <div key={idx} className={`lab-row ${idx % 2 === 1 ? 'image-left' : ''}`}>
              <div className="lab-content">
                <h3>{lab.title}</h3>
                <div className="lab-sub">{lab.sub}</div>
                {lab.content.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
                <span className="cta-link" onClick={() => navigate("/admin/lab")}>
                  Explore lab services →
                </span>
              </div>
              <div className="lab-image">
                <img src={lab.image} alt={lab.title} style={{ height: "auto" }} />
              </div>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2><VectorIcon name="clock" /> Recent Activity</h2>
          <div className="activity-card">
            {recentActivities.length === 0 ? (
              <>
                <p>No recent activity.</p>
                <img
                  className="empty-state-image"
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                  alt="No recent activity"
                  style={{ height: "auto" }}
                />
              </>
            ) : (
              <ul className="activity-list">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="activity-item">
                    <span className="activity-icon">
                      {activity.type === "APPOINTMENT" ? "📅" : "📋"}
                    </span>
                    <span className="activity-message">{activity.message}</span>
                    <span className="activity-date">{activity.date}</span>
                    <span
                      className={`activity-status ${activity.status?.toLowerCase()}`}
                    >
                      {activity.status || ""}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

export default Dashboard;