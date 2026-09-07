// // // import { useState, useEffect } from "react";
// // // import { Navigate, useNavigate } from "react-router-dom";
// // // import API from "../api/api";
// // // import Notifications from '../components/Notifications';
// // // import {
// // //   PieChart,
// // //   Pie,
// // //   Cell,
// // //   BarChart,
// // //   Bar,
// // //   XAxis,
// // //   YAxis,
// // //   Tooltip,
// // //   Legend,
// // //   ResponsiveContainer,
// // // } from "recharts";
// // // import "./Dashboard.css";

// // // function Dashboard() {
// // //   const navigate = useNavigate();
// // //   const token = localStorage.getItem("token");
// // //   const userName = localStorage.getItem("userName") || "User";
// // //   const userRole = localStorage.getItem("userRole") || "PATIENT";
// // //   const [sidebarOpen, setSidebarOpen] = useState(false);

// // //   // Dashboard data states
// // //   const [stats, setStats] = useState({
// // //     totalAppointments: 0,
// // //     totalDoctors: 0,
// // //     totalReports: 0,
// // //     totalPatients: 0,
// // //   });
// // //   const [recentActivities, setRecentActivities] = useState([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [appointmentStats, setAppointmentStats] = useState([
// // //     { name: "Pending", value: 0 },
// // //     { name: "Confirmed", value: 0 },
// // //     { name: "Completed", value: 0 },
// // //     { name: "Cancelled", value: 0 },
// // //   ]);

// // //   const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

// // //   useEffect(() => {
// // //     if (token) {
// // //       fetchDashboardData();
// // //     }
// // //   }, [token]);

// // //   const fetchDashboardData = async () => {
// // //     try {
// // //       const [statsRes, recentRes] = await Promise.all([
// // //         API.get("/dashboard/stats"),
// // //         API.get("/dashboard/recent?limit=5"),
// // //       ]);

// // //       setStats({
// // //         totalAppointments: statsRes.data.totalAppointments || 0,
// // //         totalDoctors: statsRes.data.totalDoctors || 0,
// // //         totalReports: statsRes.data.totalReports || 0,
// // //         totalPatients: statsRes.data.totalPatients || 0,
// // //       });
// // //       setRecentActivities(recentRes.data);

// // //       const total = statsRes.data.totalAppointments || 1;
// // //       setAppointmentStats([
// // //         { name: "Pending", value: Math.floor(total * 0.3) },
// // //         { name: "Confirmed", value: Math.floor(total * 0.4) },
// // //         { name: "Completed", value: Math.floor(total * 0.2) },
// // //         { name: "Cancelled", value: Math.floor(total * 0.1) },
// // //       ]);

// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error("Error fetching dashboard data:", error);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   if (!token) {
// // //     return <Navigate to="/login" replace />;
// // //   }

// // //   const handleLogout = () => {
// // //     localStorage.removeItem("token");
// // //     localStorage.removeItem("userName");
// // //     localStorage.removeItem("userEmail");
// // //     localStorage.removeItem("userRole");
// // //     navigate("/login");
// // //   };

// // //   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
// // //   const closeSidebar = () => setSidebarOpen(false);

// // //   // ===== ROLE-BASED SIDEBAR NAV =====
// // //   const getSidebarNav = () => {
// // //     const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

// // //     if (userRole === "ADMIN") {
// // //       return [
// // //         ...common,
// // //         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
// // //         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
// // //         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
// // //         { icon: "👥", label: "Manage Users", path: "/admin/users" },
// // //         { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
// // //         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
// // //         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
// // //         { icon: "📦", label: "Inventory", path: "/inventory" },
// // //         { icon: "💰", label: "Bills", path: "/admin/bills" },
// // //         { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
// // //         { icon: "🛏️", label: "Beds", path: "/beds" },
// // //         { icon: "🏥", label: "Admissions", path: "/admissions" },
// // //         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
// // //         { icon: "🏛️", label: "Manage Wards", path: "/wards" },
// // //         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
// // //         { icon: "📊", label: "Reports & Analytics", path: "/reports" },
// // //         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// // //         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// // //         { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" }, // ✅ NEW
// // //       ];
// // //     }

// // //     if (userRole === "DOCTOR") {
// // //       return [
// // //         ...common,
// // //         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
// // //         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
// // //         { icon: "📝", label: "Add Report", path: "/add-report" },
// // //         { icon: "📋", label: "My Reports", path: "/doctor/reports" },
// // //         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
// // //         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
// // //         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
// // //         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
// // //         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// // //         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// // //       ];
// // //     }

// // //     // PATIENT
// // //     return [
// // //       ...common,
// // //       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
// // //       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
// // //       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
// // //       { icon: "📋", label: "My Reports", path: "/my-reports" },
// // //       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
// // //       { icon: "💰", label: "My Bills", path: "/my-bills" },
// // //       { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// // //       { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// // //     ];
// // //   };

// // //   // ===== ROLE-BASED QUICK ACTIONS =====
// // //   const getQuickActions = () => {
// // //     if (userRole === "ADMIN") {
// // //       return [
// // //         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
// // //         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
// // //         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
// // //         { icon: "👥", label: "Manage Users", path: "/admin/users" },
// // //         { icon: "💊", label: "Pharmacy", path: "/pharmacy" },
// // //         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
// // //         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
// // //         { icon: "📦", label: "Inventory", path: "/inventory" },
// // //         { icon: "💰", label: "Bills", path: "/admin/bills" },
// // //         { icon: "💰", label: "Billing", path: "/billing/dashboard" },
// // //         { icon: "🛏️", label: "Beds", path: "/beds" },
// // //         { icon: "🏥", label: "Admissions", path: "/admissions" },
// // //         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
// // //         { icon: "🏛️", label: "Wards", path: "/wards" },
// // //         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
// // //         { icon: "📊", label: "Reports", path: "/reports" },
// // //         { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// // //         { icon: "⚙️", label: "Settings", path: "/admin/settings" }, // ✅ NEW
// // //       ];
// // //     }
// // //     if (userRole === "DOCTOR") {
// // //       return [
// // //         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
// // //         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
// // //         { icon: "📝", label: "Add Report", path: "/add-report" },
// // //         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
// // //         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
// // //         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
// // //         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
// // //         { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// // //       ];
// // //     }
// // //     // PATIENT
// // //     return [
// // //       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
// // //       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
// // //       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
// // //       { icon: "📋", label: "My Reports", path: "/my-reports" },
// // //       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
// // //       { icon: "💰", label: "My Bills", path: "/my-bills" },
// // //       { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// // //     ];
// // //   };

// // //   // ===== ROLE-BASED STATS =====
// // //   const getStats = () => {
// // //     const allStats = [
// // //       { icon: "📅", label: "Appointments", value: stats.totalAppointments },
// // //       { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
// // //       { icon: "📋", label: "Reports", value: stats.totalReports },
// // //       { icon: "👤", label: "Patients", value: stats.totalPatients },
// // //     ];
// // //     if (userRole === "ADMIN") return allStats;
// // //     if (userRole === "DOCTOR") return allStats;
// // //     return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
// // //   };

// // //   if (loading) return <div className="loading">Loading dashboard...</div>;

// // //   return (
// // //     <div className="dashboard">
// // //       {/* Mobile Hamburger */}
// // //       <button className="hamburger" onClick={toggleSidebar}>
// // //         ☰
// // //       </button>
// // //       {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

// // //       {/* Sidebar */}
// // //       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
// // //         <div className="sidebar-header">
// // //           <h2>🏥 Smart Health</h2>
// // //           <button className="close-sidebar" onClick={closeSidebar}>✕</button>
// // //         </div>
// // //         <nav>
// // //           {getSidebarNav().map((item, idx) => (
// // //             <button
// // //               key={idx}
// // //               onClick={() => {
// // //                 navigate(item.path);
// // //                 closeSidebar();
// // //               }}
// // //             >
// // //               {item.icon} {item.label}
// // //             </button>
// // //           ))}
// // //         </nav>
// // //         <button className="logout-btn" onClick={handleLogout}>
// // //           🚪 Logout
// // //         </button>
// // //       </aside>

// // //       {/* Main Content */}
// // //       <main className="dashboard-content">
// // //         <header className="dashboard-header">
// // //           <div>
// // //             <h1>📊 Dashboard</h1>
// // //             <p>
// // //               Welcome back, <strong>{userName}</strong> 👋 (Role: {userRole})
// // //             </p>
// // //           </div>
// // //           <div className="header-right">
// // //             <Notifications />
// // //             <div className="user-info">
// // //               <span>👤</span>
// // //               <span>{userName}</span>
// // //             </div>
// // //           </div>
// // //         </header>

// // //         {/* Stats */}
// // //         <section className="stats">
// // //           {getStats().map((stat, idx) => (
// // //             <div key={idx} className="stat-card">
// // //               <span className="stat-icon">{stat.icon}</span>
// // //               <h3>{stat.label}</h3>
// // //               <p>{stat.value}</p>
// // //             </div>
// // //           ))}
// // //         </section>

// // //         {/* Charts */}
// // //         <section className="charts-section">
// // //           <h2>📊 Analytics</h2>
// // //           <div className="charts-grid">
// // //             <div className="chart-card">
// // //               <h3>Appointment Status</h3>
// // //               <ResponsiveContainer width="100%" height={250}>
// // //                 <PieChart>
// // //                   <Pie
// // //                     data={appointmentStats}
// // //                     dataKey="value"
// // //                     nameKey="name"
// // //                     cx="50%"
// // //                     cy="50%"
// // //                     outerRadius={80}
// // //                   >
// // //                     {appointmentStats.map((entry, index) => (
// // //                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                     ))}
// // //                   </Pie>
// // //                   <Tooltip />
// // //                   <Legend />
// // //                 </PieChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //             <div className="chart-card">
// // //               <h3>Weekly Appointments (Sample)</h3>
// // //               <ResponsiveContainer width="100%" height={250}>
// // //                 <BarChart
// // //                   data={[
// // //                     { day: "Mon", count: 4 },
// // //                     { day: "Tue", count: 7 },
// // //                     { day: "Wed", count: 5 },
// // //                     { day: "Thu", count: 9 },
// // //                     { day: "Fri", count: 6 },
// // //                     { day: "Sat", count: 3 },
// // //                     { day: "Sun", count: 2 },
// // //                   ]}
// // //                 >
// // //                   <XAxis dataKey="day" />
// // //                   <YAxis />
// // //                   <Tooltip />
// // //                   <Bar dataKey="count" fill="#0f4c81" />
// // //                 </BarChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </div>
// // //         </section>

// // //         {/* Quick Actions */}
// // //         <section className="quick-actions">
// // //           <h2>⚡ Quick Actions</h2>
// // //           <div className="action-grid">
// // //             {getQuickActions().map((action, idx) => (
// // //               <button key={idx} onClick={() => navigate(action.path)}>
// // //                 <span>{action.icon}</span>
// // //                 {action.label}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </section>

// // //         {/* Recent Activity */}
// // //         <section className="recent-activity">
// // //           <h2>🕐 Recent Activity</h2>
// // //           <div className="activity-card">
// // //             {recentActivities.length === 0 ? (
// // //               <p>No recent activity.</p>
// // //             ) : (
// // //               <ul className="activity-list">
// // //                 {recentActivities.map((activity, index) => (
// // //                   <li key={index} className="activity-item">
// // //                     <span className="activity-icon">
// // //                       {activity.type === "APPOINTMENT" ? "📅" : "📋"}
// // //                     </span>
// // //                     <span className="activity-message">{activity.message}</span>
// // //                     <span className="activity-date">{activity.date}</span>
// // //                     <span
// // //                       className={`activity-status ${activity.status?.toLowerCase()}`}
// // //                     >
// // //                       {activity.status || ""}
// // //                     </span>
// // //                   </li>
// // //                 ))}
// // //               </ul>
// // //             )}
// // //           </div>
// // //         </section>
// // //       </main>
// // //     </div>
// // //   );
// // // }

// // // export default Dashboard;


// // import { useState, useEffect } from "react";
// // import { Navigate, useNavigate } from "react-router-dom";
// // import API from "../api/api";
// // import Notifications from '../components/Notifications';
// // import {
// //   PieChart,
// //   Pie,
// //   Cell,
// //   BarChart,
// //   Bar,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   Legend,
// //   ResponsiveContainer,
// // } from "recharts";
// // import "./Dashboard.css";

// // function Dashboard() {
// //   const navigate = useNavigate();
// //   const token = localStorage.getItem("token");
// //   const userName = localStorage.getItem("userName") || "User";
// //   const userRole = localStorage.getItem("userRole") || "PATIENT";
// //   const [sidebarOpen, setSidebarOpen] = useState(false);

// //   // Dashboard data states
// //   const [stats, setStats] = useState({
// //     totalAppointments: 0,
// //     totalDoctors: 0,
// //     totalReports: 0,
// //     totalPatients: 0,
// //   });
// //   const [recentActivities, setRecentActivities] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [appointmentStats, setAppointmentStats] = useState([
// //     { name: "Pending", value: 0 },
// //     { name: "Confirmed", value: 0 },
// //     { name: "Completed", value: 0 },
// //     { name: "Cancelled", value: 0 },
// //   ]);

// //   const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

// //   // auto-generated avatar image URL based on the logged-in user's name.
// //   const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
// //     userName
// //   )}&background=2f6fed&color=ffffff&bold=true&rounded=true&size=128`;

// //   // themed icon images for the sidebar logo, stat cards, and hero banner
// //   const logoImg = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png";
// //   const heroIllustration = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
// //   const statImages = {
// //     Appointments: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
// //     Doctors: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
// //     Reports: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
// //     Patients: "https://cdn-icons-png.flaticon.com/512/4185/4185481.png",
// //   };
// //   const statAccent = {
// //     Appointments: "blue",
// //     Doctors: "purple",
// //     Reports: "amber",
// //     Patients: "green",
// //   };

// //   useEffect(() => {
// //     if (token) {
// //       fetchDashboardData();
// //     }
// //   }, [token]);

// //   const fetchDashboardData = async () => {
// //     try {
// //       const [statsRes, recentRes] = await Promise.all([
// //         API.get("/dashboard/stats"),
// //         API.get("/dashboard/recent?limit=5"),
// //       ]);

// //       setStats({
// //         totalAppointments: statsRes.data.totalAppointments || 0,
// //         totalDoctors: statsRes.data.totalDoctors || 0,
// //         totalReports: statsRes.data.totalReports || 0,
// //         totalPatients: statsRes.data.totalPatients || 0,
// //       });
// //       setRecentActivities(recentRes.data);

// //       const total = statsRes.data.totalAppointments || 1;
// //       setAppointmentStats([
// //         { name: "Pending", value: Math.floor(total * 0.3) },
// //         { name: "Confirmed", value: Math.floor(total * 0.4) },
// //         { name: "Completed", value: Math.floor(total * 0.2) },
// //         { name: "Cancelled", value: Math.floor(total * 0.1) },
// //       ]);

// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching dashboard data:", error);
// //       setLoading(false);
// //     }
// //   };

// //   if (!token) {
// //     return <Navigate to="/login" replace />;
// //   }

// //   const handleLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("userName");
// //     localStorage.removeItem("userEmail");
// //     localStorage.removeItem("userRole");
// //     navigate("/login");
// //   };

// //   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
// //   const closeSidebar = () => setSidebarOpen(false);

// //   // ===== ROLE-BASED SIDEBAR NAV =====
// //   const getSidebarNav = () => {
// //     const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

// //     if (userRole === "ADMIN") {
// //       return [
// //         ...common,
// //         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
// //         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
// //         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
// //         { icon: "👥", label: "Manage Users", path: "/admin/users" },
// //         { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
// //         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
// //         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
// //         { icon: "📦", label: "Inventory", path: "/inventory" },
// //         { icon: "💰", label: "Bills", path: "/admin/bills" },
// //         { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
// //         { icon: "🛏️", label: "Beds", path: "/beds" },
// //         { icon: "🏥", label: "Admissions", path: "/admissions" },
// //         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
// //         { icon: "🏛️", label: "Manage Wards", path: "/wards" },
// //         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
// //         { icon: "📊", label: "Reports & Analytics", path: "/reports" },
// //         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// //         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// //         { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" }, // ✅ NEW
// //       ];
// //     }

// //     if (userRole === "DOCTOR") {
// //       return [
// //         ...common,
// //         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
// //         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
// //         { icon: "📝", label: "Add Report", path: "/add-report" },
// //         { icon: "📋", label: "My Reports", path: "/doctor/reports" },
// //         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
// //         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
// //         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
// //         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
// //         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// //         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// //       ];
// //     }

// //     // PATIENT
// //     return [
// //       ...common,
// //       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
// //       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
// //       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
// //       { icon: "📋", label: "My Reports", path: "/my-reports" },
// //       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
// //       { icon: "💰", label: "My Bills", path: "/my-bills" },
// //       { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
// //       { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
// //     ];
// //   };

// //   // ===== ROLE-BASED QUICK ACTIONS =====
// //   const getQuickActions = () => {
// //     if (userRole === "ADMIN") {
// //       return [
// //         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
// //         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
// //         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
// //         { icon: "👥", label: "Manage Users", path: "/admin/users" },
// //         { icon: "💊", label: "Pharmacy", path: "/pharmacy" },
// //         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
// //         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
// //         { icon: "📦", label: "Inventory", path: "/inventory" },
// //         { icon: "💰", label: "Bills", path: "/admin/bills" },
// //         { icon: "💰", label: "Billing", path: "/billing/dashboard" },
// //         { icon: "🛏️", label: "Beds", path: "/beds" },
// //         { icon: "🏥", label: "Admissions", path: "/admissions" },
// //         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
// //         { icon: "🏛️", label: "Wards", path: "/wards" },
// //         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
// //         { icon: "📊", label: "Reports", path: "/reports" },
// //         { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// //         { icon: "⚙️", label: "Settings", path: "/admin/settings" }, // ✅ NEW
// //       ];
// //     }
// //     if (userRole === "DOCTOR") {
// //       return [
// //         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
// //         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
// //         { icon: "📝", label: "Add Report", path: "/add-report" },
// //         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
// //         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
// //         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
// //         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
// //         { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// //       ];
// //     }
// //     // PATIENT
// //     return [
// //       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
// //       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
// //       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
// //       { icon: "📋", label: "My Reports", path: "/my-reports" },
// //       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
// //       { icon: "💰", label: "My Bills", path: "/my-bills" },
// //       { icon: "🤖", label: "AI Assistant", path: "/ai-assistant" },
// //     ];
// //   };

// //   // ===== ROLE-BASED STATS =====
// //   const getStats = () => {
// //     const allStats = [
// //       { icon: "📅", label: "Appointments", value: stats.totalAppointments },
// //       { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
// //       { icon: "📋", label: "Reports", value: stats.totalReports },
// //       { icon: "👤", label: "Patients", value: stats.totalPatients },
// //     ];
// //     if (userRole === "ADMIN") return allStats;
// //     if (userRole === "DOCTOR") return allStats;
// //     return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
// //   };

// //   if (loading) return <div className="loading">Loading dashboard...</div>;

// //   return (
// //     <div className="dashboard">
// //       {/* Mobile Hamburger */}
// //       <button className="hamburger" onClick={toggleSidebar}>
// //         ☰
// //       </button>
// //       {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

// //       {/* Sidebar */}
// //       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
// //         <div className="sidebar-header">
// //           <div className="sidebar-brand">
// //             <img className="sidebar-logo" src={logoImg} alt="Smart Health logo" />
// //             <h2>Smart Health</h2>
// //           </div>
// //           <button className="close-sidebar" onClick={closeSidebar}>✕</button>
// //         </div>

// //         <nav>
// //           {getSidebarNav().map((item, idx) => (
// //             <button
// //               key={idx}
// //               onClick={() => {
// //                 navigate(item.path);
// //                 closeSidebar();
// //               }}
// //             >
// //               <span className="nav-icon">{item.icon}</span>
// //               <span className="nav-label">{item.label}</span>
// //             </button>
// //           ))}
// //         </nav>

// //         {/* sidebar profile block with avatar image */}
// //         <div className="sidebar-profile">
// //           <img className="sidebar-avatar" src={avatarUrl} alt={`${userName} avatar`} />
// //           <div className="sidebar-profile-text">
// //             <p className="sidebar-profile-name">{userName}</p>
// //             <span className="sidebar-profile-role">{userRole}</span>
// //           </div>
// //         </div>

// //         <button className="logout-btn" onClick={handleLogout}>
// //           🚪 Logout
// //         </button>
// //       </aside>

// //       {/* Main Content */}
// //       <main className="dashboard-content">
// //         {/* Top bar */}
// //         <header className="topbar">
// //           <h1 className="topbar-title">📊 Dashboard</h1>

// //           <div className="topbar-search">
// //             <span className="search-icon">🔎</span>
// //             <input type="text" placeholder="Search Patient Name" disabled />
// //           </div>

// //           <div className="topbar-right">
// //             <Notifications />
// //             <div className="user-info">
// //               <img className="user-info-avatar" src={avatarUrl} alt={`${userName} avatar`} />
// //               <div className="user-info-text">
// //                 <span className="user-info-name">{userName}</span>
// //                 <span className="user-info-role">{userRole}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </header>

// //         {/* Hero banner */}
// //         <section className="hero-banner">
// //           <div className="hero-text">
// //             <p className="hero-label">Welcome back</p>
// //             <h2>
// //               {userName} <span>👋</span>
// //             </h2>
// //             <p className="hero-sub">Role: {userRole}</p>
// //             <div className="hero-metrics">
// //               <div className="hero-metric">
// //                 <span className="hero-metric-label">Appointments</span>
// //                 <span className="hero-metric-value">{stats.totalAppointments}</span>
// //               </div>
// //               <div className="hero-metric">
// //                 <span className="hero-metric-label">Reports</span>
// //                 <span className="hero-metric-value">{stats.totalReports}</span>
// //               </div>
// //             </div>
// //           </div>
// //           <img className="hero-illustration" src={heroIllustration} alt="Healthcare illustration" />
// //         </section>

// //         {/* Stats */}
// //         <section className="stats">
// //           {getStats().map((stat, idx) => (
// //             <div key={idx} className={`stat-card accent-${statAccent[stat.label] || "blue"}`}>
// //               <div className="stat-icon-wrap">
// //                 <img className="stat-icon-img" src={statImages[stat.label]} alt={stat.label} />
// //                 <span className="stat-icon">{stat.icon}</span>
// //               </div>
// //               <div className="stat-text">
// //                 <h3>{stat.label}</h3>
// //                 <p>{stat.value}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </section>

// //         {/* Charts */}
// //         <section className="charts-section">
// //           <h2>📊 Analytics</h2>
// //           <div className="charts-grid">
// //             <div className="chart-card">
// //               <h3>Appointment Status</h3>
// //               <ResponsiveContainer width="100%" height={250}>
// //                 <PieChart>
// //                   <Pie
// //                     data={appointmentStats}
// //                     dataKey="value"
// //                     nameKey="name"
// //                     cx="50%"
// //                     cy="50%"
// //                     outerRadius={80}
// //                   >
// //                     {appointmentStats.map((entry, index) => (
// //                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                     ))}
// //                   </Pie>
// //                   <Tooltip />
// //                   <Legend />
// //                 </PieChart>
// //               </ResponsiveContainer>
// //             </div>
// //             <div className="chart-card">
// //               <h3>Weekly Appointments (Sample)</h3>
// //               <ResponsiveContainer width="100%" height={250}>
// //                 <BarChart
// //                   data={[
// //                     { day: "Mon", count: 4 },
// //                     { day: "Tue", count: 7 },
// //                     { day: "Wed", count: 5 },
// //                     { day: "Thu", count: 9 },
// //                     { day: "Fri", count: 6 },
// //                     { day: "Sat", count: 3 },
// //                     { day: "Sun", count: 2 },
// //                   ]}
// //                 >
// //                   <XAxis dataKey="day" />
// //                   <YAxis />
// //                   <Tooltip />
// //                   <Bar dataKey="count" fill="#2f6fed" radius={[6, 6, 0, 0]} />
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Quick Actions */}
// //         <section className="quick-actions">
// //           <div className="section-title-row">
// //             <h2>⚡ Quick Actions</h2>
// //             <img
// //               className="section-title-icon"
// //               src="https://cdn-icons-png.flaticon.com/512/1170/1170678.png"
// //               alt="Quick actions"
// //             />
// //           </div>
// //           <div className="action-grid">
// //             {getQuickActions().map((action, idx) => (
// //               <button key={idx} onClick={() => navigate(action.path)}>
// //                 <span>{action.icon}</span>
// //                 {action.label}
// //               </button>
// //             ))}
// //           </div>
// //         </section>

// //         {/* Recent Activity */}
// //         <section className="recent-activity">
// //           <h2>🕐 Recent Activity</h2>
// //           <div className="activity-card">
// //             {recentActivities.length === 0 ? (
// //               <>
// //                 <p>No recent activity.</p>
// //                 <img
// //                   className="empty-state-image"
// //                   src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
// //                   alt="No recent activity"
// //                 />
// //               </>
// //             ) : (
// //               <ul className="activity-list">
// //                 {recentActivities.map((activity, index) => (
// //                   <li key={index} className="activity-item">
// //                     <span className="activity-icon">
// //                       {activity.type === "APPOINTMENT" ? "📅" : "📋"}
// //                     </span>
// //                     <span className="activity-message">{activity.message}</span>
// //                     <span className="activity-date">{activity.date}</span>
// //                     <span
// //                       className={`activity-status ${activity.status?.toLowerCase()}`}
// //                     >
// //                       {activity.status || ""}
// //                     </span>
// //                   </li>
// //                 ))}
// //               </ul>
// //             )}
// //           </div>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // }

// // export default Dashboard;

// import { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import API from "../api/api";
// import Notifications from '../components/Notifications';
// import Footer from '../components/Footer';  // ✅ Add this import

// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "./Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userName = localStorage.getItem("userName") || "User";
//   const userRole = localStorage.getItem("userRole") || "PATIENT";
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Dashboard data states
//   const [stats, setStats] = useState({
//     totalAppointments: 0,
//     totalDoctors: 0,
//     totalReports: 0,
//     totalPatients: 0,
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [appointmentStats, setAppointmentStats] = useState([
//     { name: "Pending", value: 0 },
//     { name: "Confirmed", value: 0 },
//     { name: "Completed", value: 0 },
//     { name: "Cancelled", value: 0 },
//   ]);

//   const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

//   // auto-generated avatar image URL based on the logged-in user's name.
//   const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     userName
//   )}&background=2f6fed&color=ffffff&bold=true&rounded=true&size=128`;

//   // themed icon images for the sidebar logo, stat cards, and hero banner
//   const logoImg = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png";
//   const heroIllustration = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
//   const statImages = {
//     Appointments: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
//     Doctors: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
//     Reports: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
//     Patients: "https://cdn-icons-png.flaticon.com/512/4185/4185481.png",
//   };
//   const statAccent = {
//     Appointments: "blue",
//     Doctors: "purple",
//     Reports: "amber",
//     Patients: "green",
//   };

//   // Doctors showcase (no personal names — generic specialization + detail only)
//   const doctorShowcase = [
//     {
//       specialization: "Cardiologist",
//       detail: "Heart & vascular care",
//       image:
//         "https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/2c/5e/35/e2/76/v1_E10/E109CG4V.jpg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=885&s=4b95f37d2220201e10c2b6791a9a3cf37f308f0315b4ba0ba8308067486aac9",
//     },
//     {
//       specialization: "General Physician",
//       detail: "Routine checkups & consultation",
//       image: "https://c8.alamy.com/comp/REP9D4/doctor-gives-advice-to-his-patient-REP9D4.jpg",
//     },
//     {
//       specialization: "Orthopedic Surgeon",
//       detail: "Bone, joint & muscle treatment",
//       image: "https://max-website20-images.s3.ap-south-1.amazonaws.com/Types_of_Doctors_1c5efbe677.jpg",
//     },
//     {
//       specialization: "Neurologist",
//       detail: "Brain & nervous system care",
//       image:
//         "https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9ycyUyMGRheXxlbnwwfHwwfHx8MA%3D%3D",
//     },
//   ];

//   // Laboratory services showcase
//   const labShowcase = [
//     {
//       title: "Pathology Lab",
//       detail: "Blood tests, biopsies & diagnostic screening",
//       image: "https://thumbs.dreamstime.com/b/medical-lab-technician-pretty-working-32450895.jpg",
//     },
//     {
//       title: "Diagnostic Lab",
//       detail: "Advanced sample analysis & reporting",
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkDlUdQf0RgHMbsp2DsrDVjC25ohee82NLjzuI4DcdW6_a32uQUVE8DY&s=10",
//     },
//   ];

//   useEffect(() => {
//     if (token) {
//       fetchDashboardData();
//     }
//   }, [token]);

//   const fetchDashboardData = async () => {
//     try {
//       const [statsRes, recentRes] = await Promise.all([
//         API.get("/dashboard/stats"),
//         API.get("/dashboard/recent?limit=5"),
//       ]);

//       setStats({
//         totalAppointments: statsRes.data.totalAppointments || 0,
//         totalDoctors: statsRes.data.totalDoctors || 0,
//         totalReports: statsRes.data.totalReports || 0,
//         totalPatients: statsRes.data.totalPatients || 0,
//       });
//       setRecentActivities(recentRes.data);

//       const total = statsRes.data.totalAppointments || 1;
//       setAppointmentStats([
//         { name: "Pending", value: Math.floor(total * 0.3) },
//         { name: "Confirmed", value: Math.floor(total * 0.4) },
//         { name: "Completed", value: Math.floor(total * 0.2) },
//         { name: "Cancelled", value: Math.floor(total * 0.1) },
//       ]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setLoading(false);
//     }
//   };

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userRole");
//     navigate("/login");
//   };

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);

//   // ===== ROLE-BASED SIDEBAR NAV =====
//   const getSidebarNav = () => {
//     const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

//     if (userRole === "ADMIN") {
//       return [
//         ...common,
//         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
//         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
//         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
//         { icon: "👥", label: "Manage Users", path: "/admin/users" },
//         { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
//         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
//         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
//         { icon: "📦", label: "Inventory", path: "/inventory" },
//         { icon: "💰", label: "Bills", path: "/admin/bills" },
//         { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
//         { icon: "🛏️", label: "Beds", path: "/beds" },
//         { icon: "🏥", label: "Admissions", path: "/admissions" },
//         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
//         { icon: "🏛️", label: "Manage Wards", path: "/wards" },
//         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
//         { icon: "📊", label: "Reports & Analytics", path: "/reports" },
//         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//         { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" },
//       ];
//     }

//     if (userRole === "DOCTOR") {
//       return [
//         ...common,
//         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
//         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
//         { icon: "📝", label: "Add Report", path: "/add-report" },
//         { icon: "📋", label: "My Reports", path: "/doctor/reports" },
//         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
//         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
//         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
//         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
//         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//       ];
//     }

//     // PATIENT
//     return [
//       ...common,
//       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
//       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
//       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
//       { icon: "📋", label: "My Reports", path: "/my-reports" },
//       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
//       { icon: "💰", label: "My Bills", path: "/my-bills" },
//       { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//       { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//     ];
//   };

//   // ===== ROLE-BASED STATS =====
//   const getStats = () => {
//     const allStats = [
//       { icon: "📅", label: "Appointments", value: stats.totalAppointments },
//       { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
//       { icon: "📋", label: "Reports", value: stats.totalReports },
//       { icon: "👤", label: "Patients", value: stats.totalPatients },
//     ];
//     if (userRole === "ADMIN") return allStats;
//     if (userRole === "DOCTOR") return allStats;
//     return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
//   };

//   if (loading) return <div className="loading">Loading dashboard...</div>;

//   return (
//     <div className="dashboard">
//       {/* Mobile Hamburger */}
//       <button className="hamburger" onClick={toggleSidebar}>
//         ☰
//       </button>
//       {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

//       {/* Sidebar */}
//       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
//         <div className="sidebar-header">
//           <div className="sidebar-brand">
//             <img className="sidebar-logo" src={logoImg} alt="Smart Health logo" />
//             <h2>Smart Health</h2>
//           </div>
//           <button className="close-sidebar" onClick={closeSidebar}>✕</button>
//         </div>

//         <nav>
//           {getSidebarNav().map((item, idx) => (
//             <button
//               key={idx}
//               onClick={() => {
//                 navigate(item.path);
//                 closeSidebar();
//               }}
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span className="nav-label">{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         {/* sidebar profile block with avatar image */}
//         <div className="sidebar-profile">
//           <img className="sidebar-avatar" src={avatarUrl} alt={`${userName} avatar`} />
//           <div className="sidebar-profile-text">
//             <p className="sidebar-profile-name">{userName}</p>
//             <span className="sidebar-profile-role">{userRole}</span>
//           </div>
//         </div>

//         <button className="logout-btn" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="dashboard-content">
//         {/* Top bar */}
//         <header className="topbar">
//           <h1 className="topbar-title">📊 Dashboard</h1>

//           <div className="topbar-search">
//             <span className="search-icon">🔎</span>
//             <input type="text" placeholder="Search Patient Name" disabled />
//           </div>

//           <div className="topbar-right">
//             <Notifications />
//             <div className="user-info">
//               <img className="user-info-avatar" src={avatarUrl} alt={`${userName} avatar`} />
//               <div className="user-info-text">
//                 <span className="user-info-name">{userName}</span>
//                 <span className="user-info-role">{userRole}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Hero banner */}
//         <section className="hero-banner">
//           <div className="hero-text">
//             <p className="hero-label">Welcome back</p>
//             <h2>
//               {userName} <span>👋</span>
//             </h2>
//             <p className="hero-sub">Role: {userRole}</p>
//             <div className="hero-metrics">
//               <div className="hero-metric">
//                 <span className="hero-metric-label">Appointments</span>
//                 <span className="hero-metric-value">{stats.totalAppointments}</span>
//               </div>
//               <div className="hero-metric">
//                 <span className="hero-metric-label">Reports</span>
//                 <span className="hero-metric-value">{stats.totalReports}</span>
//               </div>
//             </div>
//           </div>
//           <img className="hero-illustration" src={heroIllustration} alt="Healthcare illustration" />
//         </section>

//         {/* Stats */}
//         <section className="stats">
//           {getStats().map((stat, idx) => (
//             <div key={idx} className={`stat-card accent-${statAccent[stat.label] || "blue"}`}>
//               <div className="stat-icon-wrap">
//                 <img className="stat-icon-img" src={statImages[stat.label]} alt={stat.label} />
//                 <span className="stat-icon">{stat.icon}</span>
//               </div>
//               <div className="stat-text">
//                 <h3>{stat.label}</h3>
//                 <p>{stat.value}</p>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* Charts */}
//         <section className="charts-section">
//           <h2>📊 Analytics</h2>
//           <div className="charts-grid">
//             <div className="chart-card">
//               <h3>Appointment Status</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={appointmentStats}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                   >
//                     {appointmentStats.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="chart-card">
//               <h3>Weekly Appointments (Sample)</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart
//                   data={[
//                     { day: "Mon", count: 4 },
//                     { day: "Tue", count: 7 },
//                     { day: "Wed", count: 5 },
//                     { day: "Thu", count: 9 },
//                     { day: "Fri", count: 6 },
//                     { day: "Sat", count: 3 },
//                     { day: "Sun", count: 2 },
//                   ]}
//                 >
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#2f6fed" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </section>

//         {/* Doctors & Lab Showcase (replaces the old duplicate Quick Actions grid) */}
//         <section className="showcase-section">
//           <div className="section-title-row">
//             <h2>👨‍⚕️ Our Doctors</h2>
//           </div>
//           <div className="doctor-grid">
//             {doctorShowcase.map((doc, idx) => (
//               <div key={idx} className="doctor-card" onClick={() => navigate("/admin/doctors")}>
//                 <img src={doc.image} alt={doc.specialization} className="doctor-card-img" />
//                 <div className="doctor-card-body">
//                   <h3>{doc.specialization}</h3>
//                   <p>{doc.detail}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="section-title-row" style={{ marginTop: "22px" }}>
//             <h2>🔬 Laboratory Services</h2>
//           </div>
//           <div className="lab-grid">
//             {labShowcase.map((lab, idx) => (
//               <div key={idx} className="lab-card" onClick={() => navigate("/admin/lab")}>
//                 <img src={lab.image} alt={lab.title} className="lab-card-img" />
//                 <div className="lab-card-body">
//                   <h3>{lab.title}</h3>
//                   <p>{lab.detail}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Recent Activity */}
//         <section className="recent-activity">
//           <h2>🕐 Recent Activity</h2>
//           <div className="activity-card">
//             {recentActivities.length === 0 ? (
//               <>
//                 <p>No recent activity.</p>
//                 <img
//                   className="empty-state-image"
//                   src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
//                   alt="No recent activity"
//                 />
//               </>
//             ) : (
//               <ul className="activity-list">
//                 {recentActivities.map((activity, index) => (
//                   <li key={index} className="activity-item">
//                     <span className="activity-icon">
//                       {activity.type === "APPOINTMENT" ? "📅" : "📋"}
//                     </span>
//                     <span className="activity-message">{activity.message}</span>
//                     <span className="activity-date">{activity.date}</span>
//                     <span
//                       className={`activity-status ${activity.status?.toLowerCase()}`}
//                     >
//                       {activity.status || ""}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;
// import { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import API from "../api/api";
// import Notifications from '../components/Notifications';
// import Footer from '../components/Footer';
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import "./Dashboard.css";

// function Dashboard() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userName = localStorage.getItem("userName") || "User";
//   const userRole = localStorage.getItem("userRole") || "PATIENT";
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Dashboard data states
//   const [stats, setStats] = useState({
//     totalAppointments: 0,
//     totalDoctors: 0,
//     totalReports: 0,
//     totalPatients: 0,
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [appointmentStats, setAppointmentStats] = useState([
//     { name: "Pending", value: 0 },
//     { name: "Confirmed", value: 0 },
//     { name: "Completed", value: 0 },
//     { name: "Cancelled", value: 0 },
//   ]);

//   const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#ef4444"];

//   const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//     userName
//   )}&background=2f6fed&color=ffffff&bold=true&rounded=true&size=128`;

//   const logoImg = "https://cdn-icons-png.flaticon.com/512/2966/2966327.png";
//   const heroIllustration = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
//   const statImages = {
//     Appointments: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
//     Doctors: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
//     Reports: "https://cdn-icons-png.flaticon.com/512/2965/2965358.png",
//     Patients: "https://cdn-icons-png.flaticon.com/512/4185/4185481.png",
//   };
//   const statAccent = {
//     Appointments: "blue",
//     Doctors: "purple",
//     Reports: "amber",
//     Patients: "green",
//   };

//   // ===== DOCTORS SHOWCASE WITH DETAILED CONTENT =====
//   const doctorShowcase = [
//     {
//       specialization: "Cardiologist",
//       sub: "Heart & Vascular Care",
//       content: [
//         "Cardiologists are specialized physicians who diagnose and treat conditions of the heart and blood vessels. They manage a wide range of cardiovascular issues including coronary artery disease, heart failure, arrhythmias, and hypertension.",
//         "Using advanced diagnostic tools such as echocardiograms, stress tests, and cardiac catheterization, cardiologists provide comprehensive care for patients with heart conditions. They work closely with patients to develop personalized treatment plans that may include medication, lifestyle modifications, or surgical interventions.",
//         "Preventive cardiology is a key focus, helping patients reduce risk factors such as high cholesterol, smoking, diabetes, and obesity. Regular check-ups with a cardiologist can detect potential heart problems early, significantly improving outcomes and quality of life.",
//         "Our cardiology department is equipped with state-of-the-art technology and staffed by experienced professionals dedicated to delivering compassionate, patient-centered care for all heart-related conditions."
//       ],
//       image:
//         "https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/2c/5e/35/e2/76/v1_E10/E109CG4V.jpg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=885&s=4b95f37d2220201e10c2b6791a9a3cf37f308f0315b4ba0ba8308067486aac9",
//     },
//     {
//       specialization: "General Physician",
//       sub: "Primary Care & Family Medicine",
//       content: [
//         "General Physicians serve as the first point of contact for patients seeking medical care. They provide comprehensive, continuing care for patients of all ages, managing both acute and chronic conditions across a wide spectrum of health issues.",
//         "From routine check-ups and preventive screenings to the management of chronic diseases like diabetes, asthma, and hypertension, general physicians offer holistic healthcare with a focus on overall wellness. They coordinate care with specialists and ensure that patients receive timely, appropriate treatment.",
//         "General physicians also play a vital role in patient education, empowering individuals to take charge of their health through lifestyle modifications, nutrition guidance, and early detection of potential health risks.",
//         "Our general medicine department is committed to providing accessible, compassionate, and evidence-based primary care to families and individuals in our community, ensuring that every patient receives the attention and care they deserve."
//       ],
//       image: "https://c8.alamy.com/comp/REP9D4/doctor-gives-advice-to-his-patient-REP9D4.jpg",
//     },
//     {
//       specialization: "Orthopedic Surgeon",
//       sub: "Bone, Joint & Muscle Treatment",
//       content: [
//         "Orthopedic Surgeons specialize in the diagnosis, treatment, and surgical management of conditions affecting the musculoskeletal system, including bones, joints, ligaments, tendons, and muscles. They treat a wide range of conditions from sports injuries and fractures to degenerative joint diseases like arthritis.",
//         "Advanced surgical techniques including arthroscopy, joint replacement, and minimally invasive procedures allow orthopedic surgeons to restore function and relieve pain with shorter recovery times. They also emphasize non-surgical treatments such as physical therapy, medication, and lifestyle modifications.",
//         "Patient care is personalized to each individual's needs, whether it's an athlete recovering from a sports injury or an elderly patient seeking relief from chronic joint pain. Our team works closely with physiotherapists and rehabilitation specialists to ensure optimal recovery.",
//         "Our orthopedic department is renowned for its expertise in complex joint replacements, spine surgery, and pediatric orthopedics, providing comprehensive musculoskeletal care to patients of all ages."
//       ],
//       image: "https://max-website20-images.s3.ap-south-1.amazonaws.com/Types_of_Doctors_1c5efbe677.jpg",
//     },
//     {
//       specialization: "Neurologist",
//       sub: "Brain & Nervous System Care",
//       content: [
//         "Neurologists are medical specialists who diagnose and treat disorders of the nervous system, including the brain, spinal cord, and peripheral nerves. They manage a wide range of neurological conditions such as stroke, epilepsy, multiple sclerosis, Parkinson's disease, Alzheimer's disease, and chronic headaches.",
//         "Using advanced diagnostic tools including MRI, CT scans, EEG, and nerve conduction studies, neurologists can accurately diagnose and monitor neurological conditions. They develop comprehensive treatment plans that may include medication, rehabilitation, and supportive therapies.",
//         "Neurologists also play a crucial role in stroke care, providing rapid assessment and treatment to minimize brain damage and improve outcomes. They work closely with neurosurgeons, rehabilitation specialists, and primary care physicians to deliver integrated patient care.",
//         "Our neurology department offers specialized clinics for movement disorders, epilepsy, headache, and memory disorders, providing state-of-the-art diagnosis and treatment for patients with complex neurological conditions."
//       ],
//       image:
//         "https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9ycyUyMGRheXxlbnwwfHwwfHx8MA%3D%3D",
//     },
//   ];

//   // ===== LAB SHOWCASE WITH DETAILED CONTENT =====
//   const labShowcase = [
//     {
//       title: "Pathology Lab",
//       sub: "Blood Tests, Biopsies & Diagnostic Screening",
//       content: [
//         "Our Pathology Laboratory is equipped with cutting-edge technology to provide accurate and timely diagnostic services. We offer a comprehensive range of tests including complete blood counts, chemistry panels, hormone assays, cancer markers, and infectious disease screening.",
//         "Pathology plays a critical role in disease diagnosis and treatment monitoring. Our team of skilled pathologists and technicians ensure that every sample is processed with the highest standards of quality and precision, delivering reliable results that clinicians can trust.",
//         "We also offer specialized services such as fine-needle aspiration biopsy, histopathology, cytology, and immunohistochemistry, supporting the diagnosis of cancers and other complex conditions. Our lab is fully accredited and adheres to strict quality control protocols.",
//         "Patient safety and comfort are our top priorities. We provide clear instructions for sample collection, ensure timely reporting, and maintain strict confidentiality of all test results, making the diagnostic process as smooth and stress-free as possible."
//       ],
//       image: "https://thumbs.dreamstime.com/b/medical-lab-technician-pretty-working-32450895.jpg",
//     },
//     {
//       title: "Diagnostic Lab",
//       sub: "Advanced Sample Analysis & Reporting",
//       content: [
//         "Our Diagnostic Laboratory offers a wide array of advanced diagnostic services designed to support accurate and timely clinical decision-making. We specialize in molecular diagnostics, microbiology, immunology, and clinical chemistry, providing comprehensive testing for a broad spectrum of diseases.",
//         "We utilize state-of-the-art technology including automated analyzers, PCR machines, and mass spectrometry to deliver precise and reliable results. Our services include infectious disease testing, drug monitoring, therapeutic drug levels, and allergy testing, among others.",
//         "Our team of experienced medical technologists and pathologists work together to ensure that every test is performed to the highest standards of quality. We are committed to providing fast, reliable, and accurate results that help physicians make informed treatment decisions.",
//         "We also offer home collection services for patient convenience, ensuring that diagnostic testing is accessible and stress-free. Our commitment to excellence and patient-centric care drives everything we do."
//       ],
//       image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkDlUdQf0RgHMbsp2DsrDVjC25ohee82NLjzuI4DcdW6_a32uQUVE8DY&s=10",
//     },
//   ];

//   useEffect(() => {
//     if (token) {
//       fetchDashboardData();
//     }
//   }, [token]);

//   const fetchDashboardData = async () => {
//     try {
//       const [statsRes, recentRes] = await Promise.all([
//         API.get("/dashboard/stats"),
//         API.get("/dashboard/recent?limit=5"),
//       ]);

//       setStats({
//         totalAppointments: statsRes.data.totalAppointments || 0,
//         totalDoctors: statsRes.data.totalDoctors || 0,
//         totalReports: statsRes.data.totalReports || 0,
//         totalPatients: statsRes.data.totalPatients || 0,
//       });
//       setRecentActivities(recentRes.data);

//       const total = statsRes.data.totalAppointments || 1;
//       setAppointmentStats([
//         { name: "Pending", value: Math.floor(total * 0.3) },
//         { name: "Confirmed", value: Math.floor(total * 0.4) },
//         { name: "Completed", value: Math.floor(total * 0.2) },
//         { name: "Cancelled", value: Math.floor(total * 0.1) },
//       ]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       setLoading(false);
//     }
//   };

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     localStorage.removeItem("userEmail");
//     localStorage.removeItem("userRole");
//     navigate("/login");
//   };

//   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);

//   // ===== ROLE-BASED SIDEBAR NAV =====
//   const getSidebarNav = () => {
//     const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

//     if (userRole === "ADMIN") {
//       return [
//         ...common,
//         { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
//         { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
//         { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
//         { icon: "👥", label: "Manage Users", path: "/admin/users" },
//         { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
//         { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
//         { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
//         { icon: "📦", label: "Inventory", path: "/inventory" },
//         { icon: "💰", label: "Bills", path: "/admin/bills" },
//         { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
//         { icon: "🛏️", label: "Beds", path: "/beds" },
//         { icon: "🏥", label: "Admissions", path: "/admissions" },
//         { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
//         { icon: "🏛️", label: "Manage Wards", path: "/wards" },
//         { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
//         { icon: "📊", label: "Reports & Analytics", path: "/reports" },
//         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//         { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" },
//       ];
//     }

//     if (userRole === "DOCTOR") {
//       return [
//         ...common,
//         { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
//         { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
//         { icon: "📝", label: "Add Report", path: "/add-report" },
//         { icon: "📋", label: "My Reports", path: "/doctor/reports" },
//         { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
//         { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
//         { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
//         { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
//         { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//         { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//       ];
//     }

//     // PATIENT
//     return [
//       ...common,
//       { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
//       { icon: "📋", label: "My Appointments", path: "/my-appointments" },
//       { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
//       { icon: "📋", label: "My Reports", path: "/my-reports" },
//       { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
//       { icon: "💰", label: "My Bills", path: "/my-bills" },
//       { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
//       { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
//     ];
//   };

//   // ===== ROLE-BASED STATS =====
//   const getStats = () => {
//     const allStats = [
//       { icon: "📅", label: "Appointments", value: stats.totalAppointments },
//       { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
//       { icon: "📋", label: "Reports", value: stats.totalReports },
//       { icon: "👤", label: "Patients", value: stats.totalPatients },
//     ];
//     if (userRole === "ADMIN") return allStats;
//     if (userRole === "DOCTOR") return allStats;
//     return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
//   };

//   if (loading) return <div className="loading">Loading dashboard...</div>;

//   return (
//     <div className="dashboard">
//       {/* Mobile Hamburger */}
//       <button className="hamburger" onClick={toggleSidebar}>
//         ☰
//       </button>
//       {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

//       {/* Sidebar */}
//       <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
//         <div className="sidebar-header">
//           <div className="sidebar-brand">
//             <img className="sidebar-logo" src={logoImg} alt="Smart Health logo" />
//             <h2>Smart Health</h2>
//           </div>
//           <button className="close-sidebar" onClick={closeSidebar}>✕</button>
//         </div>

//         <nav>
//           {getSidebarNav().map((item, idx) => (
//             <button
//               key={idx}
//               onClick={() => {
//                 navigate(item.path);
//                 closeSidebar();
//               }}
//             >
//               <span className="nav-icon">{item.icon}</span>
//               <span className="nav-label">{item.label}</span>
//             </button>
//           ))}
//         </nav>

//         <div className="sidebar-profile">
//           <img className="sidebar-avatar" src={avatarUrl} alt={`${userName} avatar`} />
//           <div className="sidebar-profile-text">
//             <p className="sidebar-profile-name">{userName}</p>
//             <span className="sidebar-profile-role">{userRole}</span>
//           </div>
//         </div>

//         <button className="logout-btn" onClick={handleLogout}>
//           🚪 Logout
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="dashboard-content">
//         {/* Top bar */}
//         <header className="topbar">
//           <h1 className="topbar-title">📊 Dashboard</h1>

//           <div className="topbar-search">
//             <span className="search-icon">🔎</span>
//             <input type="text" placeholder="Search Patient Name" disabled />
//           </div>

//           <div className="topbar-right">
//             <Notifications />
//             <div className="user-info">
//               <img className="user-info-avatar" src={avatarUrl} alt={`${userName} avatar`} />
//               <div className="user-info-text">
//                 <span className="user-info-name">{userName}</span>
//                 <span className="user-info-role">{userRole}</span>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Hero banner */}
//         <section className="hero-banner">
//           <div className="hero-text">
//             <p className="hero-label">Welcome back</p>
//             <h2>
//               {userName} <span>👋</span>
//             </h2>
//             <p className="hero-sub">Role: {userRole}</p>
//             <div className="hero-metrics">
//               <div className="hero-metric">
//                 <span className="hero-metric-label">Appointments</span>
//                 <span className="hero-metric-value">{stats.totalAppointments}</span>
//               </div>
//               <div className="hero-metric">
//                 <span className="hero-metric-label">Reports</span>
//                 <span className="hero-metric-value">{stats.totalReports}</span>
//               </div>
//             </div>
//           </div>
//           <img className="hero-illustration" src={heroIllustration} alt="Healthcare illustration" />
//         </section>

//         {/* Stats */}
//         <section className="stats">
//           {getStats().map((stat, idx) => (
//             <div key={idx} className={`stat-card accent-${statAccent[stat.label] || "blue"}`}>
//               <div className="stat-icon-wrap">
//                 <img className="stat-icon-img" src={statImages[stat.label]} alt={stat.label} />
//                 <span className="stat-icon">{stat.icon}</span>
//               </div>
//               <div className="stat-text">
//                 <h3>{stat.label}</h3>
//                 <p>{stat.value}</p>
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* Charts */}
//         <section className="charts-section">
//           <h2>📊 Analytics</h2>
//           <div className="charts-grid">
//             <div className="chart-card">
//               <h3>Appointment Status</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={appointmentStats}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                   >
//                     {appointmentStats.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//             <div className="chart-card">
//               <h3>Weekly Appointments (Sample)</h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart
//                   data={[
//                     { day: "Mon", count: 4 },
//                     { day: "Tue", count: 7 },
//                     { day: "Wed", count: 5 },
//                     { day: "Thu", count: 9 },
//                     { day: "Fri", count: 6 },
//                     { day: "Sat", count: 3 },
//                     { day: "Sun", count: 2 },
//                   ]}
//                 >
//                   <XAxis dataKey="day" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#2f6fed" radius={[6, 6, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </section>

//         {/* ===== DOCTORS & LAB SHOWCASE — Image Right, Content Left ===== */}
//         <section className="showcase-section">
//           <div className="section-title-row">
//             <h2>👨‍⚕️ Our Doctors</h2>
//             <span className="section-line"></span>
//           </div>
//           {doctorShowcase.map((doc, idx) => (
//             <div key={idx} className="doctor-row">
//               <div className="doctor-content">
//                 <h3>{doc.specialization}</h3>
//                 <div className="specialty-sub">{doc.sub}</div>
//                 {doc.content.map((para, i) => (
//                   <p key={i}>{para}</p>
//                 ))}
//                 <span className="cta-link" onClick={() => navigate("/admin/doctors")}>
//                   View all doctors →
//                 </span>
//               </div>
//               <div className="doctor-image">
//                 <img src={doc.image} alt={doc.specialization} />
//               </div>
//             </div>
//           ))}

//           <div className="section-title-row" style={{ marginTop: "30px" }}>
//             <h2>🔬 Laboratory Services</h2>
//             <span className="section-line"></span>
//           </div>
//           {labShowcase.map((lab, idx) => (
//             <div key={idx} className="lab-row">
//               <div className="lab-content">
//                 <h3>{lab.title}</h3>
//                 <div className="lab-sub">{lab.sub}</div>
//                 {lab.content.map((para, i) => (
//                   <p key={i}>{para}</p>
//                 ))}
//                 <span className="cta-link" onClick={() => navigate("/admin/lab")}>
//                   Explore lab services →
//                 </span>
//               </div>
//               <div className="lab-image">
//                 <img src={lab.image} alt={lab.title} />
//               </div>
//             </div>
//           ))}
//         </section>

//         {/* Recent Activity */}
//         <section className="recent-activity">
//           <h2>🕐 Recent Activity</h2>
//           <div className="activity-card">
//             {recentActivities.length === 0 ? (
//               <>
//                 <p>No recent activity.</p>
//                 <img
//                   className="empty-state-image"
//                   src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
//                   alt="No recent activity"
//                 />
//               </>
//             ) : (
//               <ul className="activity-list">
//                 {recentActivities.map((activity, index) => (
//                   <li key={index} className="activity-item">
//                     <span className="activity-icon">
//                       {activity.type === "APPOINTMENT" ? "📅" : "📋"}
//                     </span>
//                     <span className="activity-message">{activity.message}</span>
//                     <span className="activity-date">{activity.date}</span>
//                     <span
//                       className={`activity-status ${activity.status?.toLowerCase()}`}
//                     >
//                       {activity.status || ""}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>

//         {/* Footer */}
//         <Footer />
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

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

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "PATIENT";
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // ===== DOCTORS SHOWCASE WITH DETAILED CONTENT =====
  const doctorShowcase = [
    {
      specialization: "Cardiologist",
      sub: "Heart & Vascular Care",
      content: [
      "Expert heart care with advanced diagnosis, treatment, and personalized guidance for maintaining a healthy heart and managing cardiovascular conditions"
  
      ],
      image:
        "https://market-resized.envatousercontent.com/photodune.net/EVA/TRX/2c/5e/35/e2/76/v1_E10/E109CG4V.jpg?auto=format&q=94&mark=https%3A%2F%2Fassets.market-storefront.envato-static.com%2Fwatermarks%2Fphoto-260724.png&opacity=0.2&cf_fit=contain&w=590&h=885&s=4b95f37d2220201e10c2b6791a9a3cf37f308f0315b4ba0ba8308067486aac9",
    },
    {
      specialization: "General Physician",
      sub: "Primary Care & Family Medicine",
      content: [
      "Providing comprehensive healthcare through expert consultations, routine health checkups, accurate diagnosis, and effective treatment. Our General Physicians help manage common illnesses, infections, chronic health conditions, and everyday medical concerns while focusing on personalized and preventive patient care."
  
      ],
      image: "https://c8.alamy.com/comp/REP9D4/doctor-gives-advice-to-his-patient-REP9D4.jpg",
    },
    {
      specialization: "Orthopedic Surgeon",
      sub: "Bone, Joint & Muscle Treatment",
      content: [
      "Providing specialized care for bones, joints, muscles, and the overall musculoskeletal system. Our Orthopedic Surgeons offer expert consultation, accurate diagnosis, and effective treatment for injuries, fractures, joint problems, arthritis, and other orthopedic conditions."
  
      ],
      image: "https://max-website20-images.s3.ap-south-1.amazonaws.com/Types_of_Doctors_1c5efbe677.jpg",
    },
    {
      specialization: "Neurologist",
      sub: "Brain & Nervous System Care",
      content: [
      "Providing specialized care for conditions affecting the brain, spinal cord, and nervous system. Our Neurologists offer expert consultation, accurate diagnosis, and personalized treatment for headaches, migraines, seizures, nerve disorders, and other neurological conditions."
  
      ],
      image:
        "https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZG9jdG9ycyUyMGRheXxlbnwwfHwwfHx8MA%3D%3D",
    },
  ];

  // ===== LAB SHOWCASE WITH DETAILED CONTENT =====
  const labShowcase = [
    {
      title: "Pathology Lab",
      sub: "Blood Tests, Biopsies & Diagnostic Screening",
      content: [
      "Reliable diagnostic testing with accurate blood tests, biopsies, health screenings, and laboratory investigations. Our Pathology Lab uses advanced technology and reliable procedures to provide timely results that help doctors make informed decisions and support effective patient care."
  
      ],
      image: "https://thumbs.dreamstime.com/b/medical-lab-technician-pretty-working-32450895.jpg",
    },
    {
      title: "Diagnostic Lab",
      sub: "Advanced Sample Analysis & Reporting",
      content: [
      "Advanced diagnostic services with accurate sample analysis, laboratory testing, health screenings, and detailed reporting. Our Diagnostic Lab uses modern technology and reliable testing procedures to deliver timely, precise results that support doctors in diagnosis and effective patient care."
  
      ],
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkDlUdQf0RgHMbsp2DsrDVjC25ohee82NLjzuI4DcdW6_a32uQUVE8DY&s=10",
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
    const common = [{ icon: "📊", label: "Dashboard", path: "/dashboard" }];

    if (userRole === "ADMIN") {
      return [
        ...common,
        { icon: "👨‍⚕️", label: "Manage Doctors", path: "/admin/doctors" },
        { icon: "👤", label: "Manage Patients", path: "/admin/patients" },
        { icon: "📅", label: "Manage Appointments", path: "/admin/appointments" },
        { icon: "👥", label: "Manage Users", path: "/admin/users" },
        { icon: "💊", label: "Pharmacy Dashboard", path: "/pharmacy" },
        { icon: "📋", label: "Prescriptions", path: "/prescriptions/manage" },
        { icon: "⚠️", label: "Low Stock Alerts", path: "/low-stock" },
        { icon: "📦", label: "Inventory", path: "/inventory" },
        { icon: "💰", label: "Bills", path: "/admin/bills" },
        { icon: "💰", label: "Billing Dashboard", path: "/billing/dashboard" },
        { icon: "🛏️", label: "Beds", path: "/beds" },
        { icon: "🏥", label: "Admissions", path: "/admissions" },
        { icon: "🏥", label: "IPD Dashboard", path: "/ipd/dashboard" },
        { icon: "🏛️", label: "Manage Wards", path: "/wards" },
        { icon: "🔬", label: "Laboratory", path: "/admin/lab" },
        { icon: "📊", label: "Reports & Analytics", path: "/reports" },
        { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
        { icon: "⚙️", label: "Admin Settings", path: "/admin/settings" },
      ];
    }

    if (userRole === "DOCTOR") {
      return [
        ...common,
        { icon: "📅", label: "My Appointments", path: "/doctor/appointments" },
        { icon: "📝", label: "Add Prescription", path: "/add-prescription" },
        { icon: "📝", label: "Add Report", path: "/add-report" },
        { icon: "📋", label: "My Reports", path: "/doctor/reports" },
        { icon: "💊", label: "Request Medicine", path: "/medicine-request" },
        { icon: "🔬", label: "Add Lab Test", path: "/add-lab-test" },
        { icon: "🔬", label: "My Lab Tests", path: "/doctor/lab" },
        { icon: "🏥", label: "Admit Patient", path: "/add-admission" },
        { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
        { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
      ];
    }

    // PATIENT
    return [
      ...common,
      { icon: "📅", label: "Book Appointment", path: "/book-appointment" },
      { icon: "📋", label: "My Appointments", path: "/my-appointments" },
      { icon: "💊", label: "My Prescriptions", path: "/my-prescriptions" },
      { icon: "📋", label: "My Reports", path: "/my-reports" },
      { icon: "🔬", label: "My Lab Tests", path: "/my-lab-tests" },
      { icon: "💰", label: "My Bills", path: "/my-bills" },
      { icon: "🤖", label: "AI Symptom Checker", path: "/ai-symptom-checker" },
      { icon: "🤖", label: "AI Assistant (Chatbot)", path: "/ai-assistant" },
    ];
  };

  // ===== ROLE-BASED STATS =====
  const getStats = () => {
    const allStats = [
      { icon: "📅", label: "Appointments", value: stats.totalAppointments },
      { icon: "👨‍⚕️", label: "Doctors", value: stats.totalDoctors },
      { icon: "📋", label: "Reports", value: stats.totalReports },
      { icon: "👤", label: "Patients", value: stats.totalPatients },
    ];
    if (userRole === "ADMIN") return allStats;
    if (userRole === "DOCTOR") return allStats;
    return allStats.filter((s) => s.label === "Appointments" || s.label === "Reports");
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      {/* Mobile Hamburger */}
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img className="sidebar-logo" src={logoImg} alt="Smart Health logo" />
            <h2>Smart Health</h2>
          </div>
          <button className="close-sidebar" onClick={closeSidebar}>✕</button>
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
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <img className="sidebar-avatar" src={avatarUrl} alt={`${userName} avatar`} />
          <div className="sidebar-profile-text">
            <p className="sidebar-profile-name">{userName}</p>
            <span className="sidebar-profile-role">{userRole}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Top bar */}
        <header className="topbar">
          <h1 className="topbar-title">📊 Dashboard</h1>

          <div className="topbar-search">
            <span className="search-icon">🔎</span>
            <input type="text" placeholder="Search Patient Name" disabled />
          </div>

          <div className="topbar-right">
            <Notifications />
            <div className="user-info">
              <img className="user-info-avatar" src={avatarUrl} alt={`${userName} avatar`} />
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
            <h2>
              {userName} <span>👋</span>
            </h2>
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
          <img className="hero-illustration" src={heroIllustration} alt="Healthcare illustration" />
        </section>

        {/* Stats */}
        <section className="stats">
          {getStats().map((stat, idx) => (
            <div key={idx} className={`stat-card accent-${statAccent[stat.label] || "blue"}`}>
              <div className="stat-icon-wrap">
                <img className="stat-icon-img" src={statImages[stat.label]} alt={stat.label} />
                <span className="stat-icon">{stat.icon}</span>
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
          <h2>📊 Analytics</h2>
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

        {/* ===== DOCTORS & LAB SHOWCASE — Alternating Image Left / Right ===== */}
        <section className="showcase-section">
          <div className="section-title-row">
            <h2>👨‍⚕️ Our Doctors</h2>
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
                <img src={doc.image} alt={doc.specialization} />
              </div>
            </div>
          ))}

          <div className="section-title-row" style={{ marginTop: "30px" }}>
            <h2>🔬 Laboratory Services</h2>
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
                <img src={lab.image} alt={lab.title} />
              </div>
            </div>
          ))}
        </section>

        {/* Recent Activity */}
        <section className="recent-activity">
          <h2>🕐 Recent Activity</h2>
          <div className="activity-card">
            {recentActivities.length === 0 ? (
              <>
                <p>No recent activity.</p>
                <img
                  className="empty-state-image"
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                  alt="No recent activity"
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