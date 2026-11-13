import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Clock, CheckCircle2, XCircle, LogIn, LogOut, Calendar, AlertCircle } from 'lucide-react';

const StaffAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await API.get('/attendance/my');
      const list = res.data.attendance || [];
      setAttendanceList(list);

      const todayDate = new Date().toISOString().split('T')[0];
      const today = list.find((a) => a.date === todayDate);
      setTodayRecord(today);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePunch = async (action) => {
    setActionLoading(true);
    setMessage('');
    setError('');

    try {
      if (action === 'in') {
        await API.post('/attendance/check-in', { notes });
        setMessage('Punch In recorded successfully.');
      } else {
        await API.post('/attendance/check-out', { notes });
        setMessage('Punch Out recorded successfully.');
      }
      setNotes('');
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.message || 'Attendance action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Attendance System</h1>
        <p className="text-xs text-slate-500 mt-1">Record your shifts, punch in/out, and review monthly work logs</p>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Punch Action Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase text-slate-400">Shift Action</span>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <div className="flex gap-4 mt-2 text-xs text-slate-600">
            <div>
              Check-In: <strong>{todayRecord?.checkInTime || 'Not marked'}</strong>
            </div>
            <div>
              Check-Out: <strong>{todayRecord?.checkOutTime || 'Not marked'}</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Shift remarks (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full sm:w-48 p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
          />

          {!todayRecord?.checkInTime ? (
            <button
              onClick={() => handlePunch('in')}
              disabled={actionLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" /> Punch In
            </button>
          ) : !todayRecord?.checkOutTime ? (
            <button
              onClick={() => handlePunch('out')}
              disabled={actionLoading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" /> Punch Out
            </button>
          ) : (
            <span className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200">
              Shift Finished
            </span>
          )}
        </div>
      </div>

      {/* Monthly Attendance Records */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">Attendance Log History</h3>
          <span className="text-xs text-slate-400">{attendanceList.length} total entries</span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading attendance history...</div>
        ) : attendanceList.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No attendance entries recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Check-In</th>
                  <th className="p-4">Check-Out</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceList.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-slate-800">{a.date}</td>
                    <td className="p-4 text-emerald-700 font-semibold">{a.checkInTime || '—'}</td>
                    <td className="p-4 text-slate-600">{a.checkOutTime || '—'}</td>
                    <td className="p-4 font-mono">{a.workingHours ? `${a.workingHours} hrs` : '—'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : a.status === 'Half Day'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 italic">{a.notes || '—'}</td>
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

export default StaffAttendance;

