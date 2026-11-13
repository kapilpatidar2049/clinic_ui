import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PortalLayout from './components/layout/PortalLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorListPage from './pages/patient/DoctorListPage';
import EmergencyHomeVisitPage from './pages/patient/EmergencyHomeVisitPage';

// Patient Pages
import MyAppointmentsPage from './pages/patient/MyAppointmentsPage';
import PatientPrescriptionsPage from './pages/patient/PatientPrescriptionsPage';
import PatientReportsPage from './pages/patient/PatientReportsPage';

// Doctor Pages
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import WritePrescriptionPage from './pages/doctor/WritePrescriptionPage';
import DoctorSchedulePage from './pages/doctor/DoctorSchedulePage';
import DoctorHomeVisitsPage from './pages/doctor/DoctorHomeVisitsPage';

// Staff Pages
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import StaffAttendancePage from './pages/staff/StaffAttendancePage';
import StaffTasksPage from './pages/staff/StaffTasksPage';
import ReceptionDeskPage from './pages/staff/ReceptionDeskPage';
import StaffSalaryPage from './pages/staff/StaffSalaryPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPatientsPage from './pages/admin/AdminPatientsPage';
import AdminPatientDetailPage from './pages/admin/AdminPatientDetailPage';
import AdminDoctorsPage from './pages/admin/AdminDoctorsPage';
import AdminAddDoctorPage from './pages/admin/AdminAddDoctorPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';
import AdminStaffDetailPage from './pages/admin/AdminStaffDetailPage';
import AdminEditStaffPage from './pages/admin/AdminEditStaffPage';
import AdminAddStaffPage from './pages/admin/AdminAddStaffPage';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage';
import AdminLeavesPage from './pages/admin/AdminLeavesPage';
import AdminSalaryPage from './pages/admin/AdminSalaryPage';
import AdminSalaryDetailPage from './pages/admin/AdminSalaryDetailPage';
import AdminGenerateSalaryPage from './pages/admin/AdminGenerateSalaryPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

/**
 * ProtectedRoute: checks if user is authenticated and matches required roles
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-500">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();

  const routes = (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/doctors" element={<DoctorListPage />} />
      <Route path="/emergency" element={<EmergencyHomeVisitPage />} />
      <Route path="/patient" element={<Navigate to="/patient/appointments" replace />} />

      {/* Patient Routes */}
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={['Patient', 'Doctor', 'Staff', 'Admin']}>
            <MyAppointmentsPage />
          </ProtectedRoute>
        }
      />
          <Route
            path="/patient/prescriptions"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Doctor', 'Staff', 'Admin']}>
                <PatientPrescriptionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/reports"
            element={
              <ProtectedRoute allowedRoles={['Patient', 'Doctor', 'Staff', 'Admin']}>
                <PatientReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Doctor Portal Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                <DoctorDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/prescribe"
            element={
              <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                <WritePrescriptionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/schedule"
            element={
              <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                <DoctorSchedulePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/home-visits"
            element={
              <ProtectedRoute allowedRoles={['Doctor', 'Admin']}>
                <DoctorHomeVisitsPage />
              </ProtectedRoute>
            }
          />

          {/* Staff Portal Routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                <StaffDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/attendance"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                <StaffAttendancePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/tasks"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                <StaffTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/reception"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                <ReceptionDeskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/salary"
            element={
              <ProtectedRoute allowedRoles={['Staff', 'Admin']}>
                <StaffSalaryPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPatientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPatientDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminDoctorsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors/new"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminAddDoctorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminStaffPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff/new"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminAddStaffPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminEditStaffPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminStaffDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leaves"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSalaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll/new"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminGenerateSalaryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payroll/:id"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSalaryDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminSettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
  );

  if (user) {
    return <PortalLayout>{routes}</PortalLayout>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">{routes}</main>
      <Footer />
    </div>
  );
}

export default App;
