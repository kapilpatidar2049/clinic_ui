import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

const MyAppointmentsPage = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Arrived':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In-Consultation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Consultations & Appointments</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track token sequencing, doctor consultation statuses, and digital prescriptions.
          </p>
        </div>

        <Link
          to="/doctors"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition"
        >
          <Calendar className="w-4 h-4" />
          Book New Consultation
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading your clinic appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
            <p className="text-xs text-slate-500 mt-1">You have not scheduled any doctor consultations yet.</p>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition"
          >
            Find Doctor & Book Slot
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-sm transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-400">#{appt.appointmentId}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                    Queue Token #{appt.tokenNumber || '—'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">Dr. {appt.doctorId?.userId?.name}</h3>
                  <span className="text-xs text-emerald-600 font-semibold">• {appt.doctorId?.specialization}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{appt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="font-semibold text-slate-700">{appt.slotTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>
                      ₹{appt.doctorId?.consultationFee} ({appt.paymentStatus})
                    </span>
                  </div>
                </div>

                {appt.symptoms && (
                  <p className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 inline-block">
                    Reason: {appt.symptoms}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {appt.status === 'Completed' && (
                  <Link
                    to="/patient/prescriptions"
                    className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Prescription
                  </Link>
                )}

                {['Confirmed', 'Pending'].includes(appt.status) && (
                  <Link
                    to={`/patient/appointments/${appt._id}/cancel`}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition inline-flex items-center gap-1"
                  >
                    <span>Cancel Booking</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
