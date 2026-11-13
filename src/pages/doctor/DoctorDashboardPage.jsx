import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Ambulance,
  FileText,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Phone,
} from 'lucide-react';

const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/doctors/dashboard/metrics');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      await API.put(`/appointments/${apptId}/status`, { status: newStatus });
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleEmergencyAction = async (visitId, action) => {
    try {
      await API.put(`/emergency/${visitId}/respond`, {
        action,
        doctorRemarks: action === 'accept' ? 'Doctor dispatched and en route.' : 'Doctor currently occupied in surgery.',
      });
      showToast(`Emergency request ${action === 'accept' ? 'Accepted & dispatched' : 'Declined'}`, 'info');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-blue-200 bg-white/10 px-3 py-1 rounded-full">
            Doctor Workstation • {data?.doctor?.specialization || 'Consultant'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Welcome, Dr. {user?.name || data?.doctor?.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Clinic Schedule: Reporting at {data?.doctor?.reportingTime || '09:30 AM'} • Slot Interval: {data?.doctor?.slotDuration || 15} mins
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/doctor/prescribe"
            className="px-4 py-2.5 rounded-xl bg-white text-blue-800 hover:bg-blue-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            Issue Digital Prescription
          </Link>
          <Link
            to="/doctor/schedule"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs border border-blue-400 flex items-center gap-1.5 transition"
          >
            <Clock className="w-4 h-4" />
            Manage Timings & Leaves
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Total Patients</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{data?.stats?.totalToday || 0}</p>
          <span className="text-[11px] text-slate-400">Scheduled sequence</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending In Queue</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{data?.stats?.pendingToday || 0}</p>
          <span className="text-[11px] text-slate-400">Awaiting consultation</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{data?.stats?.completedToday || 0}</p>
          <span className="text-[11px] text-slate-400">Prescriptions issued</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Home Visit Alerts</span>
            <Ambulance className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{data?.stats?.pendingHomeVisitsCount || 0}</p>
          <span className="text-[11px] text-rose-500 font-medium">Emergency requests</span>
        </div>
      </div>

      {/* Emergency Alert Box (If any pending) */}
      {data?.emergencyRequests && data.emergencyRequests.length > 0 && (
        <div className="bg-rose-50 rounded-3xl border-2 border-rose-300 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ambulance className="w-6 h-6 text-rose-600 animate-bounce" />
              <h2 className="text-base font-bold text-rose-900">
                🚨 Urgent Emergency Home Visit Requests ({data.emergencyRequests.length})
              </h2>
            </div>
            <Link to="/doctor/home-visits" className="text-xs font-bold text-rose-700 hover:underline">
              View All Home Visits →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.emergencyRequests.map((req) => (
              <div key={req._id} className="bg-white rounded-2xl p-4 border border-rose-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-rose-800">{req.visitId}</span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    {req.status}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  {req.patientName} • <span className="font-normal text-slate-500">{req.contactNumber}</span>
                </p>
                <p className="text-xs text-slate-700">📍 {req.location?.address}</p>
                <p className="text-xs text-rose-700 italic">"{req.emergencyDetails}"</p>

                {req.status === 'Requested' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEmergencyAction(req._id, 'accept')}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Accept Visit
                    </button>
                    <button
                      onClick={() => handleEmergencyAction(req._id, 'reject')}
                      className="py-1.5 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Live Patient Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Consultation Queue</h2>
            <p className="text-xs text-slate-500">Patients in auto-allocated slot order</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {data?.todayQueue?.length || 0} Patients Listed
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading today's queue...</div>
        ) : !data?.todayQueue || data.todayQueue.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No appointments booked for today. You are all caught up!
          </div>
        ) : (
          <div className="space-y-3">
            {data.todayQueue.map((appt) => (
              <div
                key={appt._id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 font-extrabold flex flex-col items-center justify-center shrink-0">
                    <span className="text-[9px] uppercase tracking-wider text-blue-600">Token</span>
                    <span className="text-base leading-none">#{appt.tokenNumber}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{appt.patientId?.name || 'Walk-in Patient'}</h4>
                      <span className="text-xs text-slate-400 font-mono">({appt.appointmentId})</span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'Confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      ⏰ {appt.slotTime} • Phone: {appt.patientId?.phone || 'N/A'} • Reason: {appt.symptoms || 'General Consult'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Link
                    to={`/doctor/prescribe?patientId=${appt.patientId?._id}&appointmentId=${appt._id}&patientName=${encodeURIComponent(appt.patientId?.name || '')}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Consult & Prescribe
                  </Link>

                  {appt.status !== 'Completed' && (
                    <button
                      onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
