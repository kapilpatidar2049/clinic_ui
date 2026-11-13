import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  Coffee,
  DollarSign,
  Settings,
} from 'lucide-react';

const ADMIN_LINKS = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { path: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { path: '/admin/staff', label: 'Staff', icon: Users },
  { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { path: '/admin/leaves', label: 'Leaves', icon: Coffee },
  { path: '/admin/payroll', label: 'Payroll', icon: DollarSign },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export const AdminSubnav = () => {
  const location = useLocation();

  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xs p-1.5 sm:p-2 mb-6">
      <nav
        className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
        aria-label="Admin Navigation"
      >
        {ADMIN_LINKS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSubnav;

