import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  UserCheck,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  AlertCircle,
  Phone,
  User,
} from 'lucide-react';

const ReceptionDeskPage = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFilteredAppointments();
  }, [selectedDoctorId, selectedDate]);

  const fetchInitialData = async () => {
    try {
      const docRes = await API.get('/doctors');
      setDoctors(docRes.data.doctors || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchFilteredAppointments = async () => {
    setLoading(true);
    try {
      let url = `/appointments?date=${selectedDate}`;
      if (selectedDoctorId) url += `&doctorId=${selectedDoctorId}`;
      const res = await API.get(url);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      showToast(`Appointment status updated to ${status}`, 'success');
      fetchFilteredAppointments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reception Desk & Queue Coordination</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section 7.6 FRD: Monitor doctor queues, sequence tokens, mark patient arrivals, and register walk-ins.
          </p>
        </div>

        <Link
          to="/staff/walk-in"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Book Walk-in Patient</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Select OPD Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Filter by Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold min-w-[200px]"
            >
              <option value="">All Doctors & OPDs</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.userId?.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-bold text-slate-800">{appointments.length}</span> Total Queue Patients Scheduled
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Token</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Patient Name</th>
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4">Symptoms</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Queue Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Loading queue for {selectedDate}...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    No appointments booked for this date and filter.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <span className="font-black text-slate-900 bg-slate-100 px-2 py-1 rounded">
                        #{appt.tokenNumber || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{appt.slotTime}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{appt.patientId?.name || 'Walk-in'}</div>
                      <div className="text-[11px] text-slate-400">{appt.patientId?.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">Dr. {appt.doctorId?.userId?.name}</div>
                      <div className="text-[10px] text-emerald-600 font-bold">{appt.doctorId?.specialization}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{appt.symptoms || 'Regular Consultation'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          appt.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : appt.status === 'Arrived'
                            ? 'bg-blue-100 text-blue-800'
                            : appt.status === 'In-Consultation'
                            ? 'bg-purple-100 text-purple-800'
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {appt.status === 'Confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'Arrived')}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] transition"
                        >
                          Mark Arrived
                        </button>
                      )}
                      {appt.status === 'Arrived' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'In-Consultation')}
                          className="px-2.5 py-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-[11px] transition"
                        >
                          Send Inside
                        </button>
                      )}
                      {appt.status === 'In-Consultation' && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] transition"
                        >
                          Complete
                        </button>
                      )}
                      {['Confirmed', 'Arrived'].includes(appt.status) && (
                        <button
                          onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] transition"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
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

export default ReceptionDeskPage;
