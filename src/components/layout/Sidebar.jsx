import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  Coffee,
  DollarSign,
  Settings,
  Clock,
  FileText,
  Ambulance,
  Briefcase,
  CheckSquare,
  Activity,
  LogOut,
  X,
} from 'lucide-react';

const ROLE_NAV = {
  Admin: [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Patients', path: '/admin/patients', icon: Users },
    { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { label: 'Staff Roster', path: '/admin/staff', icon: Briefcase },
    { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { label: 'Leave Requests', path: '/admin/leaves', icon: Coffee },
    { label: 'Payroll & Salary', path: '/admin/payroll', icon: DollarSign },
    { label: 'Clinic Settings', path: '/admin/settings', icon: Settings },
  ],
  Doctor: [
    { label: 'Doctor Dashboard', path: '/doctor', icon: LayoutDashboard },
    { label: 'My Schedule', path: '/doctor/schedule', icon: Clock },
    { label: 'Write Prescription', path: '/doctor/prescribe', icon: FileText },
    { label: 'Home Visits', path: '/doctor/home-visits', icon: Ambulance },
  ],
  Staff: [
    { label: 'Staff Dashboard', path: '/staff', icon: LayoutDashboard },
    { label: 'Reception Desk', path: '/staff/reception', icon: Briefcase },
    { label: 'Daily Attendance', path: '/staff/attendance', icon: Clock },
    { label: 'Clinic Tasks', path: '/staff/tasks', icon: CheckSquare },
    { label: 'My Salary', path: '/staff/salary', icon: DollarSign },
  ],
  Patient: [
    { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { label: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
    { label: 'Medical Reports', path: '/patient/reports', icon: Activity },
    { label: 'Find Doctors', path: '/doctors', icon: Stethoscope },
    { label: 'Emergency Care', path: '/emergency', icon: Ambulance },
  ],
};

export const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'Patient';
  const navItems = ROLE_NAV[role] || ROLE_NAV.Patient;

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">My Clinic</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-emerald-400 font-medium">Healthcare ERP Portal</p>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links (Full vertical height, spacious & clean) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {role} Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/admin' || item.path === '/doctor' || item.path === '/staff'
              ? location.pathname === item.path
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${isActive
                ? 'bg-purple-700 text-white font-semibold shadow-lg shadow-purple-700/25 translate-x-1'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400'
                  }`}
              />
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-900/95">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
