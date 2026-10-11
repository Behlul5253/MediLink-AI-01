import { Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import PatientPortal from './pages/PatientPortal';
import DoctorDashboard from './pages/DoctorDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signup />} />
      <Route path="/signup" element={<Signup />} /> {/* Add this line */}
      <Route path="/patient-portal" element={<PatientPortal />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
    </Routes>
  );
}