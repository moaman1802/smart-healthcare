import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, LineChart, Line
} from "recharts";
import "./Reports.css";

function Reports() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Data states
  const [patientStats, setPatientStats] = useState(null);
  const [doctorStats, setDoctorStats] = useState(null);
  const [appointmentStats, setAppointmentStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [labStats, setLabStats] = useState(null);
  const [pharmacyStats, setPharmacyStats] = useState(null);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [monthlyActivity, setMonthlyActivity] = useState(null);

  const COLORS = ["#0f4c81", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAllReports();
  }, []);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      const [
        patientRes,
        doctorRes,
        appointmentRes,
        revenueRes,
        labRes,
        pharmacyRes,
        inventoryRes,
        activityRes,
      ] = await Promise.all([
        API.get("/reports/patients"),
        API.get("/reports/doctors"),
        API.get("/reports/appointments"),
        API.get("/reports/revenue"),
        API.get("/reports/laboratory"),
        API.get("/reports/pharmacy"),
        API.get("/reports/inventory"),
        API.get("/reports/monthly-activity"),
      ]);

      setPatientStats(patientRes.data);
      setDoctorStats(doctorRes.data);
      setAppointmentStats(appointmentRes.data);
      setRevenueStats(revenueRes.data);
      setLabStats(labRes.data);
      setPharmacyStats(pharmacyRes.data);
      setInventoryStats(inventoryRes.data);
      setMonthlyActivity(activityRes.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  // Helper to convert map to array for charts
  const mapToArray = (obj) => {
    if (!obj) return [];
    return Object.keys(obj).map((key) => ({ name: key, value: obj[key] }));
  };

  // Prepare data for charts
  const genderData = patientStats?.byGender ? mapToArray(patientStats.byGender) : [];
  const bloodGroupData = patientStats?.byBloodGroup ? mapToArray(patientStats.byBloodGroup) : [];
  const specializationData = doctorStats?.bySpecialization ? mapToArray(doctorStats.bySpecialization) : [];
  const appointmentStatusData = appointmentStats?.byStatus ? mapToArray(appointmentStats.byStatus) : [];
  const monthlyAppointmentsData = appointmentStats?.monthlyAppointments ? mapToArray(appointmentStats.monthlyAppointments) : [];
  const revenueByServiceData = revenueStats?.byServiceType ? mapToArray(revenueStats.byServiceType) : [];
  const monthlyRevenueData = revenueStats?.monthlyRevenue ? mapToArray(revenueStats.monthlyRevenue) : [];
  const labStatusData = labStats?.byStatus ? mapToArray(labStats.byStatus) : [];
  const labTypeData = labStats?.byTestType ? mapToArray(labStats.byTestType) : [];
  const pharmacyCategoryData = pharmacyStats?.byCategory ? mapToArray(pharmacyStats.byCategory) : [];
  const inventoryCategoryData = inventoryStats?.byCategory ? mapToArray(inventoryStats.byCategory) : [];
  const inventoryStatusData = inventoryStats?.byStatus ? mapToArray(inventoryStats.byStatus) : [];
  const monthlyActivityData = monthlyActivity?.monthlyAppointments ? mapToArray(monthlyActivity.monthlyAppointments) : [];

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>📊 Reports & Analytics</h2>
        <button className="btn-export" onClick={() => alert("Export feature coming soon!")}>
          📥 Export Report
        </button>
      </div>

      {/* Tabs */}
      <div className="reports-tabs">
        {["overview", "patients", "doctors", "appointments", "revenue", "lab", "pharmacy", "inventory", "activity"].map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="reports-overview">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">👤</span>
              <h3>Total Patients</h3>
              <p>{patientStats?.totalPatients || 0}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">👨‍⚕️</span>
              <h3>Total Doctors</h3>
              <p>{doctorStats?.totalDoctors || 0}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <h3>Total Appointments</h3>
              <p>{appointmentStats?.totalAppointments || 0}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <h3>Total Revenue</h3>
              <p>₹{(revenueStats?.totalRevenue || 0).toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🔬</span>
              <h3>Lab Tests</h3>
              <p>{labStats?.totalTests || 0}</p>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💊</span>
              <h3>Medicines</h3>
              <p>{pharmacyStats?.totalMedicines || 0}</p>
            </div>
          </div>
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === "patients" && patientStats && (
        <div className="report-tab-content">
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Patients by Gender</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {genderData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Patients by Blood Group</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bloodGroupData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#0f4c81" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === "doctors" && doctorStats && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total Doctors</span>
              <strong>{doctorStats.totalDoctors}</strong>
            </div>
            <div className="mini-stat">
              <span>Available</span>
              <strong>{doctorStats.availableDoctors}</strong>
            </div>
            <div className="mini-stat">
              <span>Unavailable</span>
              <strong>{doctorStats.totalDoctors - doctorStats.availableDoctors}</strong>
            </div>
          </div>
          <div className="chart-card full-width">
            <h3>Doctors by Specialization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={specializationData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && appointmentStats && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total</span>
              <strong>{appointmentStats.totalAppointments}</strong>
            </div>
            <div className="mini-stat">
              <span>Pending</span>
              <strong>{appointmentStats.byStatus?.PENDING || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>Confirmed</span>
              <strong>{appointmentStats.byStatus?.CONFIRMED || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>Completed</span>
              <strong>{appointmentStats.byStatus?.COMPLETED || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>Cancelled</span>
              <strong>{appointmentStats.byStatus?.CANCELLED || 0}</strong>
            </div>
          </div>
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Appointments by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={appointmentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {appointmentStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Monthly Appointments</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyAppointmentsData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0f4c81" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === "revenue" && revenueStats && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total Revenue</span>
              <strong>₹{revenueStats.totalRevenue.toFixed(2)}</strong>
            </div>
            <div className="mini-stat">
              <span>Pending Amount</span>
              <strong>₹{revenueStats.pendingAmount.toFixed(2)}</strong>
            </div>
          </div>
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Revenue by Service Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={revenueByServiceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {revenueByServiceData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Monthly Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyRevenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Lab Tab */}
      {activeTab === "lab" && labStats && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total Tests</span>
              <strong>{labStats.totalTests}</strong>
            </div>
            <div className="mini-stat">
              <span>Pending</span>
              <strong>{labStats.byStatus?.PENDING || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>In Progress</span>
              <strong>{labStats.byStatus?.IN_PROGRESS || 0}</strong>
            </div>
            <div className="mini-stat">
              <span>Completed</span>
              <strong>{labStats.byStatus?.COMPLETED || 0}</strong>
            </div>
          </div>
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Lab Tests by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={labStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {labStatusData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Tests by Type</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={labTypeData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacy Tab */}
      {activeTab === "pharmacy" && pharmacyStats && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total Medicines</span>
              <strong>{pharmacyStats.totalMedicines}</strong>
            </div>
            <div className="mini-stat">
              <span>Low Stock</span>
              <strong>{pharmacyStats.lowStock}</strong>
            </div>
            <div className="mini-stat">
              <span>Expired</span>
              <strong>{pharmacyStats.expiredMedicines}</strong>
            </div>
          </div>
          <div className="chart-card full-width">
            <h3>Medicines by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pharmacyCategoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === "inventory" && inventoryStats && (
        <div className="report-tab-content">
          <div className="chart-grid">
            <div className="chart-card">
              <h3>Inventory by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={inventoryCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {inventoryCategoryData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <h3>Inventory by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={inventoryStatusData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Activity Tab */}
      {activeTab === "activity" && monthlyActivity && (
        <div className="report-tab-content">
          <div className="stats-row">
            <div className="mini-stat">
              <span>Total Appointments (Last 6 Months)</span>
              <strong>{monthlyActivity.totalAppointments}</strong>
            </div>
          </div>
          <div className="chart-card full-width">
            <h3>Monthly Appointments Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyActivityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0f4c81" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;