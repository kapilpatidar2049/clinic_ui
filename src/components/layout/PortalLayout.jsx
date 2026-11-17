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
  Heart,
  Calendar,
  Stethoscope,
  FileText,
  Activity,
  Ambulance,
  LayoutDashboard,
  Clock,
  Briefcase,
  CheckSquare,
  Users,
  X,
  User,
  Sparkles,
} from 'lucide-react';

const ROLE_BUTTONS = [
  { id: 'Admin', label: '👑 Admin' },
  { id: 'Doctor', label: '🩺 Doctor' },
  { id: 'Staff', label: '💼 Staff' },
  { id: 'Patient', label: '👤 Patient' },
];

const MOBILE_BOTTOM_TABS = {
  Patient: [
    { label: 'Visits', path: '/patient/appointments', icon: Calendar },
    { label: 'Doctors', path: '/doctors', icon: Stethoscope },
    { label: 'Rx Meds', path: '/patient/prescriptions', icon: FileText },
    { label: 'Reports', path: '/patient/reports', icon: Activity },
    { label: 'Emergency', path: '/emergency', icon: Ambulance, highlight: true },
  ],
  Doctor: [
    { label: 'OPD Queue', path: '/doctor', icon: LayoutDashboard },
    { label: 'Prescribe', path: '/doctor/prescribe', icon: FileText },
    { label: 'Schedule', path: '/doctor/schedule', icon: Clock },
    { label: 'Home Visits', path: '/doctor/home-visits', icon: Ambulance },
    { label: 'More', action: 'drawer', icon: Menu },
  ],
  Staff: [
    { label: 'Dashboard', path: '/staff', icon: LayoutDashboard },
    { label: 'Reception', path: '/staff/reception', icon: Briefcase },
    { label: 'Attendance', path: '/staff/attendance', icon: Clock },
    { label: 'Tasks', path: '/staff/tasks', icon: CheckSquare },
    { label: 'More', action: 'drawer', icon: Menu },
  ],
  Admin: [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Patients', path: '/admin/patients', icon: Users },
    { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Bookings', path: '/admin/appointments', icon: Calendar },
    { label: 'More', action: 'drawer', icon: Menu },
  ],
};

export const PortalLayout = ({ children }) => {
  const { user, logout, demoLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const currentRole = user?.role || 'Patient';
  const currentMobileTabs = MOBILE_BOTTOM_TABS[currentRole] || MOBILE_BOTTOM_TABS.Patient;

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
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 py-2.5 shrink-0 flex items-center justify-between gap-2 shadow-xs">
          {/* Left: Mobile App Brand / Desktop Breadcrumbs */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile App Bar Header */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                aria-label="Open menu drawer"
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
              <div className="leading-tight truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">My Clinic</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                {/* Clickable Mobile Role Pill */}
                <button
                  type="button"
                  onClick={() => setShowRoleModal(true)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 active:scale-95 transition"
                >
                  <span>{currentRole}</span>
                  <ChevronRight className="w-2.5 h-2.5 opacity-60" />
                </button>
              </div>
            </div>

            {/* Desktop Hamburger & Breadcrumbs */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition"
                aria-label="Open navigation sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold truncate">
                <span className="text-slate-400">{breadcrumb.section}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-900 font-bold truncate">{breadcrumb.title}</span>
              </div>
            </div>
          </div>

          {/* Right: Role Switcher Pills + Notification Bell + User Profile Chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Role Switcher Pills */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              {ROLE_BUTTONS.map((r) => {
                const isCur = user?.role === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleRoleSwitch(r.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
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
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-800">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-medium cursor-pointer"
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
              <button
                type="button"
                onClick={() => setShowRoleModal(true)}
                className="w-8 h-8 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center justify-center shadow-xs active:scale-95 transition cursor-pointer"
                title="Profile / Switch Role"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
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
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Independent Scrollable Page Content - with bottom padding on mobile for App Tab Bar */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 lg:p-8 pb-24 lg:pb-8 scroll-smooth overscroll-contain">
          {children}
        </main>

        {/* 4. Native App Bottom Navigation Bar for Mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] px-1.5 pt-1 safe-bottom flex items-center justify-around">
          {currentMobileTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isCur = tab.path
              ? location.pathname === tab.path ||
                (tab.path !== '/' && location.pathname.startsWith(tab.path) && tab.path !== '/doctor') ||
                (tab.path === '/doctor' && location.pathname === '/doctor')
              : false;

            return (
              <button
                key={tab.label || idx}
                type="button"
                onClick={() => {
                  if (tab.action === 'drawer') {
                    setMobileOpen(true);
                  } else if (tab.path) {
                    navigate(tab.path);
                  }
                }}
                className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-150 active:scale-90 cursor-pointer ${
                  tab.highlight
                    ? isCur
                      ? 'text-rose-600 font-bold'
                      : 'text-rose-500 hover:text-rose-600'
                    : isCur
                    ? currentRole === 'Doctor'
                      ? 'text-teal-700 font-bold'
                      : 'text-emerald-700 font-bold'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isCur
                      ? tab.highlight
                        ? 'bg-rose-50 shadow-xs ring-1 ring-rose-200'
                        : currentRole === 'Doctor'
                        ? 'bg-teal-50 shadow-xs ring-1 ring-teal-200'
                        : 'bg-emerald-50 shadow-xs ring-1 ring-emerald-200'
                      : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isCur ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 ${isCur ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>

                {/* Active indicator dot */}
                {isCur && (
                  <span
                    className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${
                      tab.highlight
                        ? 'bg-rose-600'
                        : currentRole === 'Doctor'
                        ? 'bg-teal-600'
                        : 'bg-emerald-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* 5. Mobile Role Switcher Sheet Modal */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-fadeIn"
              onClick={() => setShowRoleModal(false)}
            />
            <div className="relative z-10 bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200 safe-bottom">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1" />
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Select Portal Persona</h3>
                  <p className="text-[11px] text-slate-500">Switch role or sign out of your session</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {ROLE_BUTTONS.map((r) => {
                  const isCur = user?.role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setShowRoleModal(false);
                        handleRoleSwitch(r.id);
                      }}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                        isCur
                          ? 'border-purple-600 bg-purple-50/70 text-purple-900 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold'
                      }`}
                    >
                      <span className="text-xs">{r.label}</span>
                      {isCur && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalLayout;
