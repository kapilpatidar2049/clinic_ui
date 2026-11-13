import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Clock, Stethoscope, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await API.get('/appointments');
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesSearch =
      a.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.appointmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master Appointments Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time schedule of all doctor consultations across the clinic</p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, or token..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none"
          >
            <option value="All">All Statuses ({appointments.length})</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading master schedule...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No appointments found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Token & ID</th>
                  <th className="p-4">Patient Details</th>
                  <th className="p-4">Doctor & Department</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] block w-max">
                        Token #{a.tokenNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{a.appointmentId}</span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{a.patientId?.name || 'Walk-in'}</p>
                      <p className="text-slate-400 text-[11px]">{a.patientId?.phone || '—'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">Dr. {a.doctorId?.userId?.name}</p>
                      <p className="text-slate-400 text-[11px]">{a.doctorId?.specialization}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{a.appointmentDate}</p>
                      <p className="text-slate-400 text-[11px]">{a.slotTime}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-800">₹{a.consultationFee}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : a.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {a.status !== 'Cancelled' && a.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(a._id, 'Cancelled')}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold transition"
                        >
                          Cancel
                        </button>
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

export default AdminAppointments;

