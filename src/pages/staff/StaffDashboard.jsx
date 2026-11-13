import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  CheckCircle,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  ChevronRight,
  Calendar,
  AlertCircle,
  LogIn,
  LogOut,
} from 'lucide-react';

const StaffDashboard = () => {
  const { user } = useAuth();
  const [attendanceToday, setAttendanceToday] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [punching, setPunching] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, taskRes] = await Promise.all([
        API.get('/attendance/my'),
        API.get('/tasks'),
      ]);

      const myAtt = attRes.data.attendance || [];
      const todayDate = new Date().toISOString().split('T')[0];
      const todayRecord = myAtt.find((a) => a.date === todayDate);
      setAttendanceToday(todayRecord);

      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      console.error('Failed to load staff dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePunch = async (action) => {
    setPunching(true);
    try {
      if (action === 'in') {
        await API.post('/attendance/check-in', { notes: 'Front desk / clinic duty' });
      } else {
        await API.post('/attendance/check-out', { notes: 'Shift ended' });
      }
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Attendance action failed');
    } finally {
      setPunching(false);
    }
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full inline-block mb-2">
            Clinic Operations & Staff Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || 'Staff Member'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Track daily attendance, manage reception queue, check assigned operational tasks & view payslips.
          </p>
        </div>

        {/* Quick Punch In/Out Widget */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[11px] text-slate-300 uppercase block font-semibold">Today's Shift Status</span>
            <span className="text-sm font-bold text-white">
              {attendanceToday?.checkInTime
                ? attendanceToday.checkOutTime
                  ? 'Completed Shift'
                  : `In: ${attendanceToday.checkInTime}`
                : 'Not Checked In'}
            </span>
          </div>

          {!attendanceToday?.checkInTime ? (
            <button
              onClick={() => handlePunch('in')}
              disabled={punching}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4" /> Punch In
            </button>
          ) : !attendanceToday?.checkOutTime ? (
            <button
              onClick={() => handlePunch('out')}
              disabled={punching}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" /> Punch Out
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Day Complete
            </span>
          )}
        </div>
      </div>

      {/* Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/staff/reception"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Reception & Walk-ins</h3>
          <p className="text-xs text-slate-500 mt-0.5">Quick patient token booking & doctor queue</p>
        </Link>

        <Link
          to="/staff/tasks"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Daily Clinic Checklist</h3>
          <p className="text-xs text-slate-500 mt-0.5">{pendingTasks.length} pending operational tasks</p>
        </Link>

        <Link
          to="/staff/attendance"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Attendance Log</h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly check-in records & working hours</p>
        </Link>

        <Link
          to="/staff/salary"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Salary & Leaves</h3>
          <p className="text-xs text-slate-500 mt-0.5">Download monthly pay slips and apply leave</p>
        </Link>
      </div>

      {/* Task Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h2 className="text-base font-bold text-slate-900">Today's Assigned Clinic Tasks</h2>
          <Link to="/staff/tasks" className="text-xs font-semibold text-emerald-600 hover:underline">
            View All Tasks
          </Link>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">No active tasks assigned for today.</div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 4).map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{t.taskTitle}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">{t.description || 'Clinic operation task'}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    t.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : t.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;

