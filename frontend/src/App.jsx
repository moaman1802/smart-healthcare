import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import AdminDoctors from './pages/AdminDoctors';
import AISymptomChecker from './pages/AISymptomChecker';
import AddPrescription from './pages/AddPrescription';
import MyPrescriptions from './pages/MyPrescriptions';
import OTPPage from './pages/OTPPage';
import AdminUsers from './pages/AdminUsers';
import AdminPatients from './pages/AdminPatients';
import PatientDetails from './pages/PatientDetails';
import AdminAppointments from './pages/AdminAppointments';
import AppointmentDetails from './pages/AppointmentDetails';
import AddReport from './pages/AddReport';
import MyReports from './pages/MyReports';
import DoctorReports from './pages/DoctorReports';

// ===== Laboratory Module =====
import AddLabTest from './pages/AddLabTest';
import MyLabTests from './pages/MyLabTests';
import DoctorLabTests from './pages/DoctorLabTests';
import AdminLabTests from './pages/AdminLabTests';

// ===== Pharmacy Module =====
import AddMedicine from './pages/AddMedicine';
import MedicineList from './pages/MedicineList';
import PharmacyDashboard from './pages/PharmacyDashboard';
import MedicineRequest from './pages/MedicineRequest';
import LowStockAlerts from './pages/LowStockAlerts';
import PrescriptionManagement from './pages/PrescriptionManagement';

// ===== Billing Module =====
import AddBill from './pages/AddBill';
import MyBills from './pages/MyBills';
import AdminBills from './pages/AdminBills';
import BillingDashboard from './pages/BillingDashboard';

// ===== Inventory Module =====
import InventoryList from './pages/InventoryList';
import AddInventoryItem from './pages/AddInventoryItem';

// ===== IPD / Bed Management =====
import BedList from './pages/BedList';
import AdmissionList from './pages/AdmissionList';
import AddBed from './pages/AddBed';
import AddAdmission from './pages/AddAdmission';
import IPDDashboard from './pages/IPDDashboard';
import WardList from './pages/WardList';
import AddWard from './pages/AddWard';

// ===== Notifications Module =====
import NotificationList from './pages/NotificationList';

// ===== Reports Module =====
import Reports from './pages/Reports';

// ===== AI Assistant Module =====
import AIAssistant from './pages/AIAssistant';

import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <Routes>
      {/* ===== Public Routes ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-page" element={<OTPPage />} />

      {/* ===== Core Routes ===== */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/admin/doctors" element={<AdminDoctors />} />
      <Route path="/ai-symptom-checker" element={<AISymptomChecker />} />
      <Route path="/add-prescription" element={<AddPrescription />} />
      <Route path="/my-prescriptions" element={<MyPrescriptions />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/patients" element={<AdminPatients />} />
      <Route path="/patient/:id" element={<PatientDetails />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/appointment/:id" element={<AppointmentDetails />} />
      <Route path="/add-report" element={<AddReport />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route path="/doctor/reports" element={<DoctorReports />} />

      {/* ===== Laboratory Module ===== */}
      <Route path="/add-lab-test" element={<AddLabTest />} />
      <Route path="/my-lab-tests" element={<MyLabTests />} />
      <Route path="/doctor/lab" element={<DoctorLabTests />} />
      <Route path="/admin/lab" element={<AdminLabTests />} />

      {/* ===== Pharmacy Module ===== */}
      <Route path="/add-medicine" element={<AddMedicine />} />
      <Route path="/medicines" element={<MedicineList />} />
      <Route path="/pharmacy" element={<PharmacyDashboard />} />
      <Route path="/medicine-request" element={<MedicineRequest />} />
      <Route path="/low-stock" element={<LowStockAlerts />} />
      <Route path="/prescriptions/manage" element={<PrescriptionManagement />} />

      {/* ===== Billing Module ===== */}
      <Route path="/add-bill" element={<AddBill />} />
      <Route path="/my-bills" element={<MyBills />} />
      <Route path="/admin/bills" element={<AdminBills />} />
      <Route path="/billing/dashboard" element={<BillingDashboard />} />

      {/* ===== Inventory Module ===== */}
      <Route path="/inventory" element={<InventoryList />} />
      <Route path="/add-inventory" element={<AddInventoryItem />} />

      {/* ===== IPD / Bed Management ===== */}
      <Route path="/beds" element={<BedList />} />
      <Route path="/add-bed" element={<AddBed />} />
      <Route path="/admissions" element={<AdmissionList />} />
      <Route path="/add-admission" element={<AddAdmission />} />
      <Route path="/ipd/dashboard" element={<IPDDashboard />} />
      <Route path="/wards" element={<WardList />} />
      <Route path="/add-ward" element={<AddWard />} />

      {/* ===== Notifications Module ===== */}
      <Route path="/notifications" element={<NotificationList />} />

      {/* ===== Reports Module ===== */}
      <Route path="/reports" element={<Reports />} />

      {/* ===== AI Assistant Module ===== */}
      <Route path="/ai-assistant" element={<AIAssistant />} />

      {/* ===== Default ===== */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* ===== Admin Settings ===== */}
      <Route path="/admin/settings" element={<AdminSettings />} />

    </Routes>
  );
}

export default App;