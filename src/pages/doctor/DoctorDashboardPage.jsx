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
  Stethoscope,
  ChevronRight,
  Activity,
  Check,
  UserCheck,
} from 'lucide-react';

const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queueTab, setQueueTab] = useState('waiting'); // 'waiting' | 'in-consult' | 'completed' | 'all'

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
      showToast(`Token status updated to ${newStatus}`, 'success');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  const handleEmergencyAction = async (visitId, action) => {
    try {
      await API.put(`/emergency/${visitId}/respond`, {
        action,
        doctorRemarks:
          action === 'accept'
            ? 'Doctor dispatched and en route to patient location.'
            : 'Doctor occupied with intensive clinic consultations.',
      });
      showToast(`Emergency visit ${action === 'accept' ? 'Accepted & dispatched' : 'Declined'}`, 'info');
      fetchDashboard();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const todayQueue = data?.todayQueue || [];
  const waitingPatients = todayQueue.filter((a) => ['Confirmed', 'Pending', 'Arrived'].includes(a.status));
  const inConsultPatients = todayQueue.filter((a) => a.status === 'In-Consultation');
  const completedPatients = todayQueue.filter((a) => a.status === 'Completed');

  const filteredQueue =
    queueTab === 'waiting'
      ? waitingPatients
      : queueTab === 'in-consult'
      ? inConsultPatients
      : queueTab === 'completed'
      ? completedPatients
      : todayQueue;

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. Doctor App Bar / Top Identity Header */}
      <div className="bg-gradient-to-tr from-teal-800 via-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 font-black text-xl shadow-inner shrink-0">
              {user?.name ? user.name.charAt(0) : 'D'}
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight">
                  Dr. {user?.name || data?.doctor?.name}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-teal-200 mt-0.5">
                {data?.doctor?.specialization || 'Clinical Specialist'} • Reporting {data?.doctor?.reportingTime || '09:30 AM'}
              </p>
            </div>
          </div>

          {/* Quick Action Pills on Doctor Header */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              to="/doctor/prescribe"
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 font-black text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Digital Rx</span>
            </Link>
            <Link
              to="/doctor/schedule"
              className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs border border-white/15 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-teal-200" />
              <span>Schedule</span>
            </Link>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Emergency Home Visit Alert (Pulsing high-priority banner if any) */}
      {data?.emergencyRequests && data.emergencyRequests.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-md shadow-rose-600/30 shrink-0">
                <Ambulance className="w-4 h-4 animate-bounce" />
              </span>
              <div>
                <h3 className="font-black text-rose-950 text-sm sm:text-base">
                  🚨 Urgent Home Visit Call ({data.emergencyRequests.length})
                </h3>
                <p className="text-[11px] text-rose-700 font-medium">Patient requires immediate home medical care</p>
              </div>
            </div>
            <Link
              to="/doctor/home-visits"
              className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-0.5"
            >
              <span>All Visits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5">
            {data.emergencyRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl p-3.5 border border-rose-200 space-y-2 text-xs shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">{req.patientName}</span>
                  <a
                    href={`tel:${req.contactNumber}`}
                    className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{req.contactNumber}</span>
                  </a>
                </div>
                <p className="text-slate-600 text-[11px]">📍 {req.location?.address}</p>
                <p className="text-rose-800 italic bg-rose-50/60 p-2 rounded-xl border border-rose-100">
                  "{req.emergencyDetails}"
                </p>

                {req.status === 'Requested' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleEmergencyAction(req._id, 'accept')}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xs shadow-sm transition cursor-pointer"
                    >
                      Accept & Dispatch 🚑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEmergencyAction(req._id, 'reject')}
                      className="py-2 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-700 font-bold text-xs cursor-pointer"
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

      {/* 3. 2x2 Interactive Metric App Tiles (Tap to Switch Filter) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Waiting Tile */}
        <button
          type="button"
          onClick={() => setQueueTab('waiting')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer shadow-xs ${
            queueTab === 'waiting'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                queueTab === 'waiting' ? 'text-amber-100' : 'text-slate-400'
              }`}
            >
              In Queue
            </span>
            <Clock className={`w-4 h-4 ${queueTab === 'waiting' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1.5 leading-none">
            {data?.stats?.pendingToday || waitingPatients.length}
          </p>
          <span
            className={`text-[10px] mt-1 block font-medium ${
              queueTab === 'waiting' ? 'text-amber-100' : 'text-slate-400'
            }`}
          >
            Awaiting consult
          </span>
        </button>

        {/* In-Consultation Tile */}
        <button
          type="button"
          onClick={() => setQueueTab('in-consult')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer shadow-xs ${
            queueTab === 'in-consult'
              ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/20'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                queueTab === 'in-consult' ? 'text-purple-100' : 'text-slate-400'
              }`}
            >
              In Room
            </span>
            <Activity className={`w-4 h-4 ${queueTab === 'in-consult' ? 'text-white' : 'text-purple-600'}`} />
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1.5 leading-none">
            {inConsultPatients.length}
          </p>
          <span
            className={`text-[10px] mt-1 block font-medium ${
              queueTab === 'in-consult' ? 'text-purple-100' : 'text-slate-400'
            }`}
          >
            Active consult
          </span>
        </button>

        {/* Completed Tile */}
        <button
          type="button"
          onClick={() => setQueueTab('completed')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer shadow-xs ${
            queueTab === 'completed'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                queueTab === 'completed' ? 'text-emerald-100' : 'text-slate-400'
              }`}
            >
              Finished
            </span>
            <CheckCircle2 className={`w-4 h-4 ${queueTab === 'completed' ? 'text-white' : 'text-emerald-600'}`} />
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1.5 leading-none">
            {data?.stats?.completedToday || completedPatients.length}
          </p>
          <span
            className={`text-[10px] mt-1 block font-medium ${
              queueTab === 'completed' ? 'text-emerald-100' : 'text-slate-400'
            }`}
          >
            Prescribed
          </span>
        </button>

        {/* Total Today Tile */}
        <button
          type="button"
          onClick={() => setQueueTab('all')}
          className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer shadow-xs ${
            queueTab === 'all'
              ? 'bg-slate-900 text-white border-slate-950 shadow-md shadow-slate-900/20'
              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                queueTab === 'all' ? 'text-slate-300' : 'text-slate-400'
              }`}
            >
              Total Queue
            </span>
            <Users className={`w-4 h-4 ${queueTab === 'all' ? 'text-white' : 'text-teal-600'}`} />
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-1.5 leading-none">
            {todayQueue.length}
          </p>
          <span
            className={`text-[10px] mt-1 block font-medium ${
              queueTab === 'all' ? 'text-slate-300' : 'text-slate-400'
            }`}
          >
            Patients today
          </span>
        </button>
      </div>

      {/* 4. Native iOS/Material Segmented Queue Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setQueueTab('waiting')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            queueTab === 'waiting'
              ? 'bg-white text-amber-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Waiting</span>
          <span className="text-[10px] px-1.5 rounded-full bg-amber-100 text-amber-800 font-black">
            {waitingPatients.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setQueueTab('in-consult')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            queueTab === 'in-consult'
              ? 'bg-white text-purple-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>In Room</span>
          <span className="text-[10px] px-1.5 rounded-full bg-purple-100 text-purple-800 font-black">
            {inConsultPatients.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setQueueTab('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            queueTab === 'completed'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Done</span>
          <span className="text-[10px] px-1.5 rounded-full bg-emerald-100 text-emerald-800 font-black">
            {completedPatients.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setQueueTab('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            queueTab === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All</span>
          <span className="text-[10px] px-1.5 rounded-full bg-slate-200 text-slate-800 font-black">
            {todayQueue.length}
          </span>
        </button>
      </div>

      {/* 5. Live Patient Consultation Queue Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-2">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Syncing OPD patient tokens...</p>
        </div>
      ) : filteredQueue.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">
            {queueTab === 'waiting'
              ? 'No Patients Waiting in Queue'
              : queueTab === 'in-consult'
              ? 'No Patient in Active Consultation'
              : 'Queue is Clear'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {queueTab === 'waiting'
              ? 'All scheduled patients for this slot window have been consulted.'
              : 'Check other tabs to review past consultations.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-3.5">
          {filteredQueue.map((appt) => {
            const isWaiting = ['Confirmed', 'Pending', 'Arrived'].includes(appt.status);
            const isInConsult = appt.status === 'In-Consultation';
            const isCompleted = appt.status === 'Completed';

            return (
              <div
                key={appt._id}
                className={`bg-white rounded-3xl border p-4 sm:p-5 shadow-xs transition-all duration-150 ${
                  isInConsult
                    ? 'border-purple-300 ring-2 ring-purple-100 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Big Bold Token Badge */}
                    <div
                      className={`w-13 h-13 rounded-2xl font-black flex flex-col items-center justify-center shrink-0 shadow-sm ${
                        isInConsult
                          ? 'bg-purple-600 text-white shadow-purple-600/25'
                          : isCompleted
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-teal-600 text-white shadow-teal-600/25'
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-90 leading-tight">
                        TOKEN
                      </span>
                      <span className="text-lg leading-none font-black">
                        #{appt.tokenNumber || '—'}
                      </span>
                    </div>

                    <div className="leading-tight">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          {appt.patientId?.name || 'Walk-in Patient'}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {appt.patientId?.gender || 'Adult'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                        <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          ⏰ {appt.slotTime}
                        </span>
                        {appt.patientId?.phone && (
                          <a
                            href={`tel:${appt.patientId.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-slate-600 hover:text-teal-700"
                          >
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{appt.patientId.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Chip */}
                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isInConsult
                        ? 'bg-purple-50 text-purple-800 border-purple-200 animate-pulse'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>

                {/* Symptoms / Reason */}
                {appt.symptoms && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-100 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      <strong>Complaint:</strong> {appt.symptoms}
                    </span>
                  </div>
                )}

                {/* 1-Tap Doctor Action Buttons */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px] text-slate-400 font-mono">
                    ID: {appt.appointmentId}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Primary Consult Action */}
                    <Link
                      to={`/doctor/prescribe?patientId=${appt.patientId?._id}&appointmentId=${appt._id}&patientName=${encodeURIComponent(
                        appt.patientId?.name || ''
                      )}`}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isCompleted ? 'Edit Prescription' : 'Consult & Prescribe'}</span>
                    </Link>

                    {/* Step Status Actions */}
                    {isWaiting && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appt._id, 'In-Consultation')}
                        className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 active:scale-95 text-purple-700 font-bold text-xs border border-purple-200 transition cursor-pointer"
                        title="Mark patient called into room"
                      >
                        Call In Room
                      </button>
                    )}

                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                        className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-800 font-bold text-xs border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                        title="Mark consultation done"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardPage;