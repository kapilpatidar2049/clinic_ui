import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  FileText,
  DollarSign,
  ChevronRight,
  Stethoscope,
  Plus,
  X,
  AlertCircle,
  Activity,
  Heart,
} from 'lucide-react';

const MyAppointmentsPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'all'

  // Cancellation modal state
  const [cancelModalAppt, setCancelModalAppt] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalAppt) return;
    setCancelling(true);
    try {
      await API.put(`/appointments/${cancelModalAppt._id}/status`, {
        status: 'Cancelled',
        cancellationReason: cancellationReason || 'Cancelled by patient',
      });
      showToast('Appointment cancelled successfully', 'info');
      setCancelModalAppt(null);
      setCancellationReason('');
      fetchAppointments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel appointment', 'error');
    } finally {
      setCancelling(false);
    }
  };

  // Group appointments into tabs
  const upcomingAppointments = appointments.filter((a) =>
    ['Confirmed', 'Pending', 'In-Consultation', 'Arrived'].includes(a.status)
  );
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const filteredAppointments =
    activeTab === 'upcoming'
      ? upcomingAppointments
      : activeTab === 'completed'
      ? completedAppointments
      : appointments;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      case 'Arrived':
        return 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20';
      case 'In-Consultation':
        return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20 animate-pulse';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* 1. Mobile App Bar / Top Section */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Consultations</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {appointments.length}
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Real-time queue tokens & digital appointment passes
          </p>
        </div>

        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Book Visit</span>
        </Link>
      </div>

      {/* 2. iOS/Material Native Segmented Control Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Upcoming</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'upcoming'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {upcomingAppointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-white text-blue-800 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Completed</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'completed'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {completedAppointments.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>All Visits</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
              activeTab === 'all'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-slate-300 text-slate-700'
            }`}
          >
            {appointments.length}
          </span>
        </button>
      </div>

      {/* 3. Appointment Cards (Styled as Consultation Tickets) */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading your appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">
              {activeTab === 'upcoming'
                ? 'No Upcoming Consultations'
                : activeTab === 'completed'
                ? 'No Past Consultations'
                : 'No Appointments Found'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'upcoming'
                ? 'Schedule a visit with any clinic doctor. Real-time token sequencing guarantees priority.'
                : 'Your consultation records and digital prescriptions will be catalogued here.'}
            </p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Find Specialist & Book Slot</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3.5 sm:space-y-4">
          {filteredAppointments.map((appt) => {
            const isToday = (() => {
              const now = new Date();
              const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
                now.getDate()
              ).padStart(2, '0')}`;
              return appt.date === todayStr;
            })();

            return (
              <div
                key={appt._id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-150 overflow-hidden"
              >
                {/* Ticket Top Ribbon */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {/* Token Circular/Square Badge */}
                    <div className="w-13 h-13 rounded-2xl bg-emerald-600 text-white font-black flex flex-col items-center justify-center shrink-0 shadow-md shadow-emerald-600/25">
                      <span className="text-[8px] uppercase tracking-wider font-extrabold opacity-90 leading-tight">
                        TOKEN
                      </span>
                      <span className="text-lg leading-none font-black">
                        #{appt.tokenNumber || '—'}
                      </span>
                    </div>

                    <div className="leading-tight">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                          Dr. {appt.doctorId?.userId?.name || 'Clinic Consultant'}
                        </h3>
                      </div>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5">
                        {appt.doctorId?.specialization || 'General Physician'}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Appt ID: {appt.appointmentId}
                      </p>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border ring-1 shrink-0 ${getStatusBadge(
                      appt.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-500'
                          : appt.status === 'Completed'
                          ? 'bg-blue-500'
                          : appt.status === 'Cancelled'
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    {appt.status}
                  </span>
                </div>

                {/* Ticket Body / Timing Details */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* Date */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Date</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">
                          {isToday ? `Today (${appt.date})` : appt.date}
                        </span>
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block">Slot Time</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-800">{appt.slotTime}</span>
                      </div>
                    </div>

                    {/* Fee & Payment */}
                    <div className="col-span-2 sm:col-span-1 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between sm:block">
                      <span className="text-[10px] text-slate-400 font-semibold block">Consultation Fee</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-black text-slate-900">
                          ₹{appt.doctorId?.consultationFee || 500}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold">
                          {appt.paymentMethod || 'Cash'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms Chip if any */}
                  {appt.symptoms && (
                    <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="text-[11px] font-medium truncate">
                        <strong>Reason:</strong> {appt.symptoms}
                      </span>
                    </div>
                  )}

                  {/* In-Consultation Live banner */}
                  {appt.status === 'In-Consultation' && (
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 text-xs flex items-center gap-2.5 animate-pulse">
                      <Activity className="w-4 h-4 text-purple-700 shrink-0" />
                      <span className="font-bold text-[11px]">
                        Doctor is currently in consultation with your token! Please proceed to the room.
                      </span>
                    </div>
                  )}
                </div>

                {/* Ticket Perforated Divider */}
                <div className="relative border-t border-dashed border-slate-200">
                  <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-slate-100" />
                  <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-slate-100" />
                </div>

                {/* Ticket Action Footer */}
                <div className="px-4 py-3 bg-slate-50/70 flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[11px] text-slate-400 font-medium">
                    {appt.status === 'Confirmed' && isToday && (
                      <span className="text-emerald-700 font-bold">🟢 Scheduled Today</span>
                    )}
                    {appt.status === 'Confirmed' && !isToday && <span>Confirmed Booking</span>}
                    {appt.status === 'Completed' && (
                      <span className="text-blue-700 font-bold">✓ Consultation Concluded</span>
                    )}
                    {appt.status === 'Cancelled' && (
                      <span className="text-rose-600 font-medium">Cancelled</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {appt.status === 'Completed' && (
                      <>
                        <Link
                          to="/patient/prescriptions"
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Rx</span>
                        </Link>
                        <Link
                          to="/doctors"
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:scale-95 text-slate-700 font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          <span>Book Follow-up</span>
                        </Link>
                      </>
                    )}

                    {['Confirmed', 'Pending'].includes(appt.status) && (
                      <button
                        type="button"
                        onClick={() => setCancelModalAppt(appt)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 font-bold text-xs border border-rose-200/60 transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Cancellation Confirmation Bottom Sheet / Modal */}
      {cancelModalAppt && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setCancelModalAppt(null)}
          />

          <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom duration-200 safe-bottom">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto sm:hidden -mt-1" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-base">Cancel Consultation?</h3>
              </div>
              <button
                type="button"
                onClick={() => setCancelModalAppt(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p>
                <strong>Doctor:</strong> Dr. {cancelModalAppt.doctorId?.userId?.name}
              </p>
              <p>
                <strong>Date & Slot:</strong> {cancelModalAppt.date} at {cancelModalAppt.slotTime}
              </p>
              <p>
                <strong>Token:</strong> #{cancelModalAppt.tokenNumber}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for cancellation (optional):
              </label>
              <input
                type="text"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="e.g. Schedule conflict, feeling better..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Booking'}
              </button>
              <button
                type="button"
                onClick={() => setCancelModalAppt(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Keep
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;