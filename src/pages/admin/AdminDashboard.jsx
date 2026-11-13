import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Users,
  Stethoscope,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  ShieldAlert,
  ChevronRight,
  Clock,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    patientsCount: 0,
    doctorsCount: 0,
    staffCount: 0,
    todayAppointments: 0,
    emergencyVisits: 0,
    totalRevenue: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [dashRes, logsRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/logs'),
      ]);
      setStats(dashRes.data.stats || {});
      setRecentAppointments(dashRes.data.recentAppointments || []);
      setRecentLogs(logsRes.data.logs || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full inline-block mb-2">
            Centralized Clinic Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Executive Admin Dashboard</h1>
          <p className="text-xs text-slate-300 mt-1">
            Complete oversight of doctors, patient appointments, clinical staff, emergency triage, and payroll.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/doctors"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Doctor
          </Link>
          <Link
            to="/admin/staff"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Staff
          </Link>
          <Link
            to="/admin/payroll"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <DollarSign className="w-3.5 h-3.5" /> Payroll
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Patients</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.patientsCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Doctors</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.doctorsCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Clinic Staff</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{stats.staffCount || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Today's Visits</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{stats.todayAppointments || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Home Emergencies</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats.emergencyVisits || 0}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Clinic Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₹{stats.totalRevenue?.toLocaleString() || '18,500'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Clinic Appointments</h2>
              <p className="text-xs text-slate-500">Live booking stream across all specialties</p>
            </div>
            <Link to="/admin/appointments" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All Appointments
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">No recent appointments found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Token</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Doctor</th>
                    <th className="py-3 px-3">Date & Slot</th>
                    <th className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentAppointments.slice(0, 6).map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800">#{app.tokenNumber}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{app.patientId?.name || 'Walk-in'}</td>
                      <td className="py-3 px-3 text-slate-600">Dr. {app.doctorId?.userId?.name}</td>
                      <td className="py-3 px-3 text-slate-500">
                        {app.slotTime} ({app.appointmentDate})
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            app.status === 'Confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log Feed */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h2 className="text-base font-bold text-slate-900">Security & Audit Logs</h2>
            <Link to="/admin/settings" className="text-xs font-semibold text-emerald-700 hover:underline">
              Settings
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">No system events logged.</div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentLogs.slice(0, 7).map((log) => (
                <div key={log._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">{log.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

