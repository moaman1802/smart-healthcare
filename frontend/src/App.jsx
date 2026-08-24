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
import OTPPage from './pages/OTPPage';  // ✅ Import OTPPage
import AdminUsers from './pages/AdminUsers';
import AdminPatients from './pages/AdminPatients';
import PatientDetails from './pages/PatientDetails';
import AdminAppointments from './pages/AdminAppointments';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/admin/doctors" element={<AdminDoctors />} />
      <Route path="/ai-symptom-checker" element={<AISymptomChecker />} />
      <Route path="/add-prescription" element={<AddPrescription />} />
      <Route path="/my-prescriptions" element={<MyPrescriptions />} />
      <Route path="/otp-page" element={<OTPPage />} />  {/* ✅ Route add */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/patients" element={<AdminPatients />} />
      <Route path="/patient/:id" element={<PatientDetails />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />
      <Route path="/admin/appointments" element={<AdminAppointments />} />


    </Routes>
  );
}

export default App;