import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  Activity,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Ambulance,
  ClipboardList,
  Coffee,
  Settings,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-purple-200 bg-white/10 px-3 py-1 rounded-full">
            👑 Centralized Clinic Administration Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            {data?.clinicSettings?.clinicName || 'My Clinic Healthcare Platform'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1">
            Real-time multi-department oversight: OPD queues, doctor schedules, staff attendance, payroll, and emergency response.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/doctors"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            Manage Doctors
          </Link>
          <Link
            to="/admin/payroll"
            className="px-4 py-2.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Monthly Payroll
          </Link>
          <Link
            to="/admin/settings"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            title="Clinic Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <Link
          to="/admin/patients"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-purple-700 transition">Registered Patients</span>
            <Users className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{stats.totalPatients || 0}</p>
          <span className="text-[11px] text-purple-600 font-semibold flex items-center gap-1 mt-0.5">
            View patient directory →
          </span>
        </Link>

        {/* Total Doctors */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Doctors</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">{stats.totalDoctors || 0}</p>
          <span className="text-[11px] text-slate-400">Consultants with letterheads</span>
        </div>

        {/* Total Staff */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Clinic Staff</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{stats.totalStaff || 0}</p>
          <span className="text-[11px] text-slate-400">Reception, Lab, Chemist</span>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Total OPD</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-2">
            {stats.todayAppointments?.total || 0}
          </p>
          <span className="text-[11px] text-slate-400">
            {stats.todayAppointments?.completed || 0} completed • {stats.todayAppointments?.confirmed || 0} queued
          </span>
        </div>

        {/* Pending Home Visits */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Emergency Home Visits</span>
            <Ambulance className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{stats.pendingHomeVisits || 0}</p>
          <span className="text-[11px] text-rose-500 font-semibold">Active dispatch requests</span>
        </div>

        {/* Staff Attendance Present */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Staff Punched In</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
            {stats.todayAttendance?.present || 0}
          </p>
          <span className="text-[11px] text-slate-400">Present on duty today</span>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Leave Requests</span>
            <Coffee className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-2">{stats.pendingLeaves || 0}</p>
          <span className="text-[11px] text-slate-400">Doctor / Staff applications</span>
        </div>

        {/* Monthly Payroll Total */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Monthly Payroll</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-2">
            ₹{(stats.totalPayroll || 0).toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Published staff salaries</span>
        </div>
      </div>

      {/* Module Shortcuts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/doctors"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Doctor Directory & Schedule</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add physicians, configure reporting hours, slot duration, and customized prescription letterheads.
            </p>
            <span className="text-xs font-semibold text-blue-600 mt-3 inline-flex items-center gap-1">
              Manage Doctors <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/staff"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Clinic Staff & Attendance</h3>
            <p className="text-xs text-slate-500 mt-1">
              Add employees, assign departments (Reception, Lab, Pharmacy, Cleaning), and monitor attendance audit trails.
            </p>
            <span className="text-xs font-semibold text-emerald-600 mt-3 inline-flex items-center gap-1">
              Manage Staff <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/leaves"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Leave Approvals & Scheduling</h3>
            <p className="text-xs text-slate-500 mt-1">
              Review doctor & staff leaves. Automatically flags affected appointments when doctor leaves are approved.
            </p>
            <span className="text-xs font-semibold text-amber-600 mt-3 inline-flex items-center gap-1">
              Review Leaves <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/payroll"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Payroll & Salary Slips</h3>
            <p className="text-xs text-slate-500 mt-1">
              Generate monthly employee salary statements with basic, allowances, PF, and attendance deductions.
            </p>
            <span className="text-xs font-semibold text-teal-600 mt-3 inline-flex items-center gap-1">
              Manage Payroll <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/appointments"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Centralized Appointments Ledger</h3>
            <p className="text-xs text-slate-500 mt-1">
              View all bookings across clinic doctors, filter by status, token numbers, and manage cancellations.
            </p>
            <span className="text-xs font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
              Appointments Hub <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-purple-300 shadow-xs hover:shadow-md transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Clinic Settings & Branding</h3>
            <p className="text-xs text-slate-500 mt-1">
              Configure clinic timings, emergency hotline, payment gateway switch, and prescription templates.
            </p>
            <span className="text-xs font-semibold text-purple-600 mt-3 inline-flex items-center gap-1">
              System Settings <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* System Audit & Activity Log */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Clinic System Audit Log (FRD Section 12.5)</h3>
          </div>
          <span className="text-xs text-slate-400">Security & Operational Activity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User & Role</th>
                <th className="p-3">Module</th>
                <th className="p-3">Action Event</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {!data?.recentLogs || data.recentLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400 font-sans">
                    No recent activity recorded.
                  </td>
                </tr>
              ) : (
                data.recentLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="p-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="font-bold text-slate-900">{log.userName || 'System'}</span>{' '}
                      <span className="text-[10px] text-slate-400">({log.role})</span>
                    </td>
                    <td className="p-3 font-semibold text-purple-700">{log.module}</td>
                    <td className="p-3 font-bold text-slate-800">{log.action}</td>
                    <td className="p-3 text-slate-600 font-sans text-xs">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
