import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Activity,
  FilePlus,
  AlertTriangle,
  Stethoscope,
  ChevronRight,
  Filter,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    todayTotal: 0,
    completed: 0,
    pending: 0,
    homeVisits: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [metricsRes, appRes] = await Promise.all([
        API.get('/doctors/dashboard/metrics'),
        API.get('/appointments'),
      ]);
      setMetrics(metricsRes.data.metrics || {});
      setAppointments(appRes.data.appointments || []);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await API.put(`/appointments/${appId}/status`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-teal-900/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            Doctor Clinical Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, Dr. {user?.name || 'Doctor'}
          </h1>
          <p className="text-xs text-teal-100 mt-1">
            Manage your patient queue, create digital prescriptions, and review emergency visit requests.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/doctor/prescribe"
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-teal-50 transition flex items-center gap-1.5"
          >
            <FilePlus className="w-4 h-4" /> Issue Prescription
          </Link>
          <Link
            to="/doctor/schedule"
            className="px-4 py-2.5 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> My Timings
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Today's Patients</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{metrics.todayTotal || appointments.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Scheduled slots</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Completed</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{metrics.completed || 0}</p>
          <span className="text-[11px] text-slate-400">Consultations done</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Waiting / In Queue</span>
          <p className="text-2xl font-black text-amber-500 mt-1">{metrics.pending || 0}</p>
          <span className="text-[11px] text-slate-400">Next in line</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Emergency Home Visits</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{metrics.homeVisits || 0}</p>
          <Link to="/doctor/home-visits" className="text-[11px] text-rose-600 hover:underline font-semibold flex items-center gap-1">
            View Requests <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Patient Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Patient Appointment Queue</h2>
            <p className="text-xs text-slate-500">Live consult tokens, symptom notes, and status management</p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-1.5 bg-slate-50 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading today's queue...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            No appointments found under the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Token / Slot</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Symptoms / Problem</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] block w-max">
                        Token #{app.tokenNumber}
                      </span>
                      <span className="text-slate-500 text-[11px] mt-0.5 block">{app.slotTime} ({app.appointmentDate})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.patientId?.name || 'Walk-in Patient'}</p>
                      <p className="text-slate-400 text-[11px]">{app.patientId?.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 line-clamp-2">
                        {app.problemDescription || 'Routine checkup & consultation'}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          app.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {app.status !== 'Completed' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(app._id, 'Completed')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px]"
                          >
                            Mark Done
                          </button>
                          <Link
                            to={`/doctor/prescribe?appointmentId=${app._id}&patientId=${app.patientId?._id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1 shadow-sm"
                          >
                            <FilePlus className="w-3 h-3" /> Prescribe
                          </Link>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;

