import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  ClipboardList,
  UserCheck,
  AlertCircle,
  FileText,
  Play,
  Square,
} from 'lucide-react';

const StaffDashboardPage = () => {
  const { user } = useAuth();

  const [todayAttendance, setTodayAttendance] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [punchLoading, setPunchLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [attRes, taskRes] = await Promise.all([
        API.get('/attendance/my'),
        API.get('/tasks'),
      ]);

      const attRecords = attRes.data.records || [];
      const foundToday = attRecords.find((r) => r.date === today);
      setTodayAttendance(foundToday || null);

      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setPunchLoading(true);
    setMessage('');
    try {
      const res = await API.post('/attendance/check-in');
      setTodayAttendance(res.data.attendance);
      setMessage('✅ Checked in successfully for today!');
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Check-in failed'}`);
    } finally {
      setPunchLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setPunchLoading(true);
    setMessage('');
    try {
      const res = await API.post('/attendance/check-out');
      setTodayAttendance(res.data.attendance);
      setMessage(`✅ Checked out! Total hours: ${res.data.attendance.totalHours} hrs`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Check-out failed'}`);
    } finally {
      setPunchLoading(false);
    }
  };

  const pendingTasks = tasks.filter((t) => ['Assigned', 'In Progress'].includes(t.status));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full">
            Clinic Operations Staff Portal • {user?.extraProfile?.department || 'Support'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Designation: {user?.extraProfile?.designation || 'Staff Associate'} • Shift: 09:00 AM – 05:00 PM
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/staff/attendance"
            className="px-4 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            Attendance History
          </Link>
          <Link
            to="/staff/reception"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs border border-emerald-400 flex items-center gap-1.5 transition"
          >
            <UserCheck className="w-4 h-4" />
            Front Desk Walk-In Booking
          </Link>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-800">
          {message}
        </div>
      )}

      {/* Grid: Daily Attendance Punch Card & Quick KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Attendance Punch Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Attendance</span>
            <span className="text-xs font-mono font-semibold text-slate-400">
              {new Date().toLocaleDateString()}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Attendance Status</span>
            <p className="text-xl font-black text-slate-900">
              {!todayAttendance
                ? 'Not Checked In Yet'
                : todayAttendance.checkOut
                ? 'Shift Completed'
                : 'Checked In / Active Shift'}
            </p>
            {todayAttendance && (
              <p className="text-xs text-emerald-600 font-semibold">
                In: {new Date(todayAttendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {todayAttendance.checkOut &&
                  ` • Out: ${new Date(todayAttendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            )}
          </div>

          <div className="pt-2">
            {!todayAttendance ? (
              <button
                onClick={handleCheckIn}
                disabled={punchLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Punch Daily Check-In
              </button>
            ) : !todayAttendance.checkOut ? (
              <button
                onClick={handleCheckOut}
                disabled={punchLoading}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                Punch Shift Check-Out
              </button>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-center font-bold text-xs border border-emerald-200">
                Today's attendance saved ({todayAttendance.totalHours} hrs)
              </div>
            )}
          </div>
        </div>

        {/* Assigned Tasks Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Tasks Queue</span>
            <Link to="/staff/tasks" className="text-xs text-emerald-600 font-semibold hover:underline">
              View All Tasks →
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-slate-900">{pendingTasks.length}</p>
              <span className="text-xs text-slate-500">Active tasks requiring action</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/staff/tasks"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center justify-center"
            >
              Open Tasks Workboard
            </Link>
          </div>
        </div>

        {/* Salary & Payroll Shortcut */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payroll Slip</span>
            <Link to="/staff/salary" className="text-xs text-emerald-600 font-semibold hover:underline">
              View History →
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-slate-900">Monthly Statement</p>
              <span className="text-xs text-slate-500">Basic + allowances breakdown</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/staff/salary"
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition flex items-center justify-center"
            >
              Download Latest Salary Slip
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Tasks Quick List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">Your Current Assignments ({pendingTasks.length})</h3>

        {pendingTasks.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No pending tasks. Great job!</p>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map((t) => (
              <div
                key={t._id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'Urgent' || t.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{t.description}</p>
                  <p className="text-slate-400 text-[11px] mt-1">Due Deadline: {t.deadline}</p>
                </div>

                <Link
                  to="/staff/tasks"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs whitespace-nowrap self-end sm:self-center"
                >
                  Update Status
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboardPage;
