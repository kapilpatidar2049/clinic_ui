import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import Sidebar from './Sidebar';
import {
  Menu,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

const ROLE_BUTTONS = [
  { id: 'Admin', label: '👑 Admin' },
  { id: 'Doctor', label: '🩺 Doctor' },
  { id: 'Staff', label: '💼 Staff' },
  { id: 'Patient', label: '👤 Patient' },
];

export const PortalLayout = ({ children }) => {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, location.pathname]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch {
      // silent
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {
      // silent
    }
  };

  const handleRoleSwitch = async (role) => {
    try {
      await demoLogin(role);
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Doctor') navigate('/doctor');
      else if (role === 'Staff') navigate('/staff');
      else navigate('/patient/appointments');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper for top breadcrumb / page title
  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.startsWith('/admin/patients/')) return { section: 'Admin', title: 'Patient Profile & Dossier' };
    if (p.startsWith('/admin/patients')) return { section: 'Admin', title: 'Patients Directory' };
    if (p.startsWith('/admin/doctors/new')) return { section: 'Admin', title: 'Add New Doctor' };
    if (p.startsWith('/admin/doctors')) return { section: 'Admin', title: 'Doctors Directory' };
    if (p.startsWith('/admin/staff/new')) return { section: 'Admin', title: 'Add New Staff Member' };
    if (p.includes('/admin/staff/') && p.includes('/edit')) return { section: 'Admin', title: 'Edit Staff Profile' };
    if (p.startsWith('/admin/staff/')) return { section: 'Admin', title: 'Staff Dossier & Details' };
    if (p.startsWith('/admin/staff')) return { section: 'Admin', title: 'Staff & Employee Directory' };
    if (p.startsWith('/admin/appointments')) return { section: 'Admin', title: 'Master Appointments' };
    if (p.startsWith('/admin/leaves/')) return { section: 'Admin', title: 'Review Leave Application' };
    if (p.startsWith('/admin/leaves')) return { section: 'Admin', title: 'Leave Approvals' };
    if (p.startsWith('/admin/payroll/new')) return { section: 'Admin', title: 'Generate Monthly Salary' };
    if (p.startsWith('/admin/payroll/')) return { section: 'Admin', title: 'Official Salary Slip' };
    if (p.startsWith('/admin/payroll')) return { section: 'Admin', title: 'Salary & Payroll Ledger' };
    if (p.startsWith('/admin/settings')) return { section: 'Admin', title: 'Clinic Settings' };
    if (p.startsWith('/admin')) return { section: 'Admin', title: 'Overview Dashboard' };

    if (p.startsWith('/doctor/schedule')) return { section: 'Doctor', title: 'Schedule & Slots' };
    if (p.startsWith('/doctor/prescribe')) return { section: 'Doctor', title: 'Write Prescription' };
    if (p.startsWith('/doctor/home-visits')) return { section: 'Doctor', title: 'Emergency Home Visits' };
    if (p.startsWith('/doctor')) return { section: 'Doctor', title: 'Doctor Dashboard' };

    if (p.startsWith('/staff/walk-in')) return { section: 'Staff', title: 'Walk-In Registration' };
    if (p.startsWith('/staff/reception')) return { section: 'Staff', title: 'Reception & Queue' };
    if (p.startsWith('/staff/attendance')) return { section: 'Staff', title: 'Daily Attendance' };
    if (p.startsWith('/staff/tasks/')) return { section: 'Staff', title: 'Task Progress Update' };
    if (p.startsWith('/staff/tasks')) return { section: 'Staff', title: 'Clinic Tasks' };
    if (p.startsWith('/staff/salary')) return { section: 'Staff', title: 'Salary Slips' };
    if (p.startsWith('/staff')) return { section: 'Staff', title: 'Staff Dashboard' };

    if (p.includes('/cancel')) return { section: 'Patient', title: 'Cancel Appointment' };
    if (p.startsWith('/patient/book')) return { section: 'Patient', title: 'Book OPD Consultation' };
    if (p.startsWith('/patient/appointments')) return { section: 'Patient', title: 'My Appointments' };
    if (p.startsWith('/patient/prescriptions')) return { section: 'Patient', title: 'Prescriptions' };
    if (p.startsWith('/patient/reports')) return { section: 'Patient', title: 'Medical Reports' };
    if (p.startsWith('/doctors')) return { section: 'Patient', title: 'Find Doctors' };
    if (p.startsWith('/emergency')) return { section: 'Emergency', title: 'Home Visit Care' };

    return { section: 'Portal', title: 'Dashboard' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* 2. Mobile Drawer Sidebar (with backdrop) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[85vw] h-full shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* 3. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 py-2.5 shrink-0 flex items-center justify-between gap-3 shadow-xs">
          {/* Left: Mobile hamburger & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold truncate">
              <span className="text-slate-400 hidden sm:inline">{breadcrumb.section}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline shrink-0" />
              <span className="text-slate-900 font-bold truncate">{breadcrumb.title}</span>
            </div>
          </div>

          {/* Right: Role Switcher Pills + Notification Bell + User Profile Chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher on Header */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {ROLE_BUTTONS.map((r) => {
                const isCur = user?.role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSwitch(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      isCur
                        ? 'bg-purple-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n._id}
                          className={`p-2.5 rounded-xl text-xs transition ${
                            n.isRead ? 'bg-slate-50 text-slate-600' : 'bg-purple-50 text-purple-900 font-medium'
                          }`}
                        >
                          <div className="font-semibold">{n.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Info Chip (Top bar) */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <div className="font-bold text-slate-900 truncate max-w-[150px]">
                  {user?.name || 'User'}
                </div>
                <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <span>{user?.role}</span>
                  <ShieldCheck className="w-3 h-3 text-emerald-500 inline" />
                </div>
              </div>

              {/* Quick Logout button on Header */}
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Independent Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
