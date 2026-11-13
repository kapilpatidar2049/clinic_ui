import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export const CancelAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const fetchAppointment = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments');
      const found = (res.data.appointments || []).find((a) => a._id === id);
      if (!found) {
        showToast('Appointment record not found.', 'error');
        navigate('/patient/appointments');
        return;
      }
      setAppointment(found);
    } catch (err) {
      showToast('Error loading appointment.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async (e) => {
    e.preventDefault();
    setCancelling(true);

    try {
      await API.put(`/appointments/${id}/status`, {
        status: 'Cancelled',
        cancellationReason: cancelReason || 'Cancelled by patient',
      });

      showToast('Appointment cancelled successfully. Slot has been freed.', 'info');
      navigate('/patient/appointments');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error cancelling appointment', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading appointment file...
      </div>
    );
  }

  if (!appointment) return null;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/patient/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Appointments</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Cancel Consultation Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Are you sure you want to cancel this booking? This slot will become available for other patients.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        {/* Appointment Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500">Doctor:</span>
            <span className="font-bold text-slate-900">Dr. {appointment.doctorId?.userId?.name}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500">Specialization:</span>
            <span className="font-semibold text-emerald-700">{appointment.doctorId?.specialization}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
            <span className="text-slate-500">Date & Slot:</span>
            <span className="font-bold text-slate-800">
              {appointment.date} at {appointment.slotTime}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Queue Token:</span>
            <span className="font-bold text-slate-900">Token #{appointment.tokenNumber || '—'}</span>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Cancelling this booking will release your reserved slot in the clinic OPD roster. You can re-book anytime.
          </span>
        </div>

        {/* Reason Form */}
        <form onSubmit={handleConfirmCancel} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Reason for Cancellation (Optional)
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule clash, feeling better, personal emergency"
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/60"
            />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button
              type="submit"
              disabled={cancelling}
              className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              <span>{cancelling ? 'Cancelling...' : 'Confirm Cancellation'}</span>
            </button>
            <Link
              to="/patient/appointments"
              className="py-3 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
            >
              Keep Booking
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelAppointmentPage;

