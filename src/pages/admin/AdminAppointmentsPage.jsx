import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Filter,
  DollarSign,
  User,
} from 'lucide-react';

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [selectedDoctor, selectedStatus, selectedDate]);

  const fetchInitial = async () => {
    try {
      const docRes = await API.get('/doctors');
      setDoctors(docRes.data.doctors || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let query = [];
      if (selectedDoctor) query.push(`doctorId=${selectedDoctor}`);
      if (selectedStatus) query.push(`status=${selectedStatus}`);
      if (selectedDate) query.push(`date=${selectedDate}`);

      const res = await API.get(`/appointments?${query.join('&')}`);
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
      showToast(`Appointment status updated to ${status}!`, 'success');
      fetchAppointments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Clinic Appointments Master Ledger</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Section 8.6 FRD: Centralized control over all consultations, sequence tokens, and appointment statuses.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Filter Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="">All Doctors</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.userId?.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-0.5">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
            >
              <option value="">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="No Show">No Show</option>
            </select>
          </div>
        </div>

        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
          Total: {appointments.length} Consultations
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">ID / Token</th>
                <th className="p-3.5">Patient Details</th>
                <th className="p-3.5">Consulting Doctor</th>
                <th className="p-3.5">Date & Slot</th>
                <th className="p-3.5">Fees & Method</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">Loading ledger...</td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">No records found.</td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-mono">
                      <span className="font-bold text-slate-900 block">{a.appointmentId}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Token #{a.tokenNumber}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{a.patientId?.name || 'Walk-in'}</span>
                      <span className="text-[11px] text-slate-400">{a.patientId?.phone}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800">Dr. {a.doctorId?.userId?.name}</span>
                      <span className="block text-[11px] text-purple-600">{a.doctorId?.specialization}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-800 block">{a.date}</span>
                      <span className="text-[11px] text-slate-500">{a.slotTime}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900">₹{a.consultationFee}</span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">{a.paymentStatus}</span>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          a.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : a.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      {a.status === 'Confirmed' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(a._id, 'Completed')}
                            className="px-2 py-1 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]"
                          >
                            Mark Completed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(a._id, 'Cancelled')}
                            className="px-2 py-1 rounded bg-rose-50 text-rose-700 font-semibold text-[10px]"
                          >
                            Cancel
                          </button>
                        </>
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

export default AdminAppointmentsPage;
