import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import {
  Heart,
  Calendar,
  User,
  LogOut,
  Bell,
  Activity,
  Shield,
  Stethoscope,
  Briefcase,
  Ambulance,
  ChevronDown,
  Menu,
  X,
  FileText,
  Clock,
  DollarSign,
  Settings,
  Users,
  Coffee,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    } catch (err) {
      // silent
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      // silent
    }
  };

  const handleRoleSwitch = async (role) => {
    try {
      await demoLogin(role);
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Doctor') navigate('/doctor');
      else if (role === 'Staff') navigate('/staff');
      else navigate('/patient');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Top Quick Demo Role Switcher Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">My Clinic MERN System</span>
            <span className="hidden sm:inline text-slate-400">| Quick Role Demo Switcher:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => handleRoleSwitch('Admin')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                user?.role === 'Admin'
                  ? 'bg-purple-600 text-white font-bold ring-1 ring-white/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              👑 Admin Portal
            </button>
            <button
              onClick={() => handleRoleSwitch('Doctor')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                user?.role === 'Doctor'
                  ? 'bg-blue-600 text-white font-bold ring-1 ring-white/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              🩺 Doctor Portal
            </button>
            <button
              onClick={() => handleRoleSwitch('Staff')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                user?.role === 'Staff'
                  ? 'bg-emerald-600 text-white font-bold ring-1 ring-white/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              💼 Staff Portal
            </button>
            <button
              onClick={() => handleRoleSwitch('Patient')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                user?.role === 'Patient'
                  ? 'bg-teal-600 text-white font-bold ring-1 ring-white/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              👤 Patient Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                    My<span className="text-emerald-600">Clinic</span>
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                    Health & Care System
                  </span>
                </div>
              </Link>

              {/* Navigation Links by Role */}
              <div className="hidden md:flex items-center ml-8 space-x-1">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                    location.pathname === '/' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Home
                </Link>

                {/* Patient Links */}
                {(!user || user.role === 'Patient') && (
                  <>
                    <Link
                      to="/doctors"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Find Doctors
                    </Link>
                    <Link
                      to="/emergency"
                      className="px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center gap-1.5"
                    >
                      <Ambulance className="w-4 h-4 text-rose-600" />
                      Emergency Visit
                    </Link>
                    {user && (
                      <>
                        <Link
                          to="/patient/appointments"
                          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                        >
                          My Bookings
                        </Link>
                        <Link
                          to="/patient/prescriptions"
                          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                        >
                          Prescriptions
                        </Link>
                        <Link
                          to="/patient/reports"
                          className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                        >
                          Medical Records
                        </Link>
                      </>
                    )}
                  </>
                )}

                {/* Doctor Links */}
                {user?.role === 'Doctor' && (
                  <>
                    <Link
                      to="/doctor"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/doctor/prescribe"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Write Prescription
                    </Link>
                    <Link
                      to="/doctor/schedule"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
                    >
                      <Clock className="w-4 h-4 text-blue-600" />
                      Schedule & Leaves
                    </Link>
                    <Link
                      to="/doctor/home-visits"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition flex items-center gap-1"
                    >
                      <Ambulance className="w-4 h-4 text-rose-600" />
                      Home Visits
                    </Link>
                  </>
                )}

                {/* Staff Links */}
                {user?.role === 'Staff' && (
                  <>
                    <Link
                      to="/staff"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/staff/attendance"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Attendance Clock
                    </Link>
                    <Link
                      to="/staff/tasks"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Assigned Tasks
                    </Link>
                    <Link
                      to="/staff/reception"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Front Desk Booking
                    </Link>
                    <Link
                      to="/staff/salary"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Salary Slips
                    </Link>
                  </>
                )}

                {/* Admin Links */}
                {user?.role === 'Admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Admin Overview
                    </Link>
                    <Link
                      to="/admin/doctors"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Doctors
                    </Link>
                    <Link
                      to="/admin/staff"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Staff
                    </Link>
                    <Link
                      to="/admin/appointments"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      All Appointments
                    </Link>
                    <Link
                      to="/admin/leaves"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Leaves
                    </Link>
                    <Link
                      to="/admin/payroll"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Payroll
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                    >
                      Settings
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications Popover */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowNotifMenu(!showNotifMenu);
                        if (!showNotifMenu && unreadCount > 0) markAllRead();
                      }}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 relative transition"
                      title="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifMenu && (
                      <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                          <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllRead}
                              className="text-xs text-emerald-600 hover:underline font-medium"
                            >
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                          {notifications.length === 0 ? (
                            <p className="p-4 text-center text-xs text-slate-500">No new notifications</p>
                          ) : (
                            notifications.map((n) => (
                              <div
                                key={n._id}
                                className={`p-3 text-xs hover:bg-slate-50 transition ${
                                  !n.isRead ? 'bg-emerald-50/50' : ''
                                }`}
                              >
                                <p className="font-semibold text-slate-800">{n.title}</p>
                                <p className="text-slate-600 mt-0.5">{n.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Profile Pill */}
                  <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-600">
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={logout}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition ml-1"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Find Doctors
            </Link>
            <Link
              to="/emergency"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-rose-600 hover:bg-rose-50"
            >
              Emergency Home Visit
            </Link>
            {user?.role === 'Patient' && (
              <>
                <Link
                  to="/patient/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  My Appointments
                </Link>
                <Link
                  to="/patient/prescriptions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
                >
                  Prescriptions
                </Link>
              </>
            )}
            {user?.role === 'Doctor' && (
              <Link
                to="/doctor"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Doctor Dashboard
              </Link>
            )}
            {user?.role === 'Staff' && (
              <Link
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Staff Dashboard
              </Link>
            )}
            {user?.role === 'Admin' && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="block px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-purple-700">
                  👑 Admin Controls
                </span>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Activity className="w-4 h-4 text-purple-600" />
                  Admin Overview
                </Link>
                <Link
                  to="/admin/doctors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Stethoscope className="w-4 h-4 text-purple-600" />
                  Doctor Directory & Schedules
                </Link>
                <Link
                  to="/admin/staff"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Users className="w-4 h-4 text-purple-600" />
                  Staff & Departments
                </Link>
                <Link
                  to="/admin/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Calendar className="w-4 h-4 text-purple-600" />
                  All Appointments
                </Link>
                <Link
                  to="/admin/leaves"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Coffee className="w-4 h-4 text-purple-600" />
                  Leave Approvals
                </Link>
                <Link
                  to="/admin/payroll"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  Monthly Payroll
                </Link>
                <Link
                  to="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  <Settings className="w-4 h-4 text-purple-600" />
                  Clinic Settings
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
