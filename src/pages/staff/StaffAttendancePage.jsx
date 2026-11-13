import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Award,
  ChevronLeft,
} from 'lucide-react';

const StaffAttendancePage = () => {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await API.get('/attendance/my');
      setRecords(res.data.records || []);
      setSummary(res.data.summary || null);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = records.find((r) => r.date === todayStr);

  const handlePunch = async (action) => {
    setPunchLoading(true);
    setMsg('');
    try {
      if (action === 'in') {
        const res = await API.post('/attendance/check-in');
        setMsg('✅ Punch In Successful!');
      } else {
        const res = await API.post('/attendance/check-out');
        setMsg(`✅ Shift Checkout Complete! (${res.data.attendance.totalHours} hrs)`);
      }
      fetchAttendance();
    } catch (err) {
      setMsg(`❌ ${err.response?.data?.message || 'Punch operation failed'}`);
    } finally {
      setPunchLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Attendance & Time Clock</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Record daily shift punches, check working hours, and review monthly compliance records.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-800">
          {msg}
        </div>
      )}

      {/* Top Real-time Punch Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Today's Shift Clock</span>
          <h2 className="text-2xl font-black text-slate-900">
            {todayRecord ? (todayRecord.checkOut ? 'Shift Completed' : 'Shift Active') : 'Not Checked In'}
          </h2>
          <p className="text-xs text-slate-500">
            Date: {todayStr} • Expected shift: 09:00 AM – 05:00 PM
          </p>
          {todayRecord && (
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Punched In: {new Date(todayRecord.checkIn).toLocaleTimeString()}
              {todayRecord.checkOut && ` • Punched Out: ${new Date(todayRecord.checkOut).toLocaleTimeString()}`}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {!todayRecord ? (
            <button
              onClick={() => handlePunch('in')}
              disabled={punchLoading}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Clock In Now
            </button>
          ) : !todayRecord.checkOut ? (
            <button
              onClick={() => handlePunch('out')}
              disabled={punchLoading}
              className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              Clock Out (End Shift)
            </button>
          ) : (
            <div className="px-6 py-3 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200 text-center">
              ✓ Day Finished ({todayRecord.totalHours} hrs)
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-semibold">Days Logged</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{summary.totalRecords}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-semibold">Full Days Present</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{summary.presentDays}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-semibold">Half Days</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{summary.halfDays}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-slate-400 font-semibold">Total Hours Worked</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{summary.totalHours} hrs</p>
          </div>
        </div>
      )}

      {/* Monthly Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Attendance Log & History</h3>
          <span className="text-xs text-slate-400">Past 30 Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Check-In</th>
                <th className="p-3.5">Check-Out</th>
                <th className="p-3.5">Total Hours</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No attendance records found. Punch in to create your first record.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{r.date}</td>
                    <td className="p-3.5 text-slate-700 font-medium">
                      {new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5 text-slate-700 font-medium">
                      {r.checkOut
                        ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '--'}
                    </td>
                    <td className="p-3.5 font-bold text-blue-700">{r.totalHours || 0} hrs</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          r.status === 'Present'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.status === 'Half-day'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{r.notes || 'Normal'}</td>
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

export default StaffAttendancePage;
