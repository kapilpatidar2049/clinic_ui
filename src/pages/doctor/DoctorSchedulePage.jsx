import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Sun,
  Coffee,
} from 'lucide-react';

const DoctorSchedulePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [reportingTime, setReportingTime] = useState('09:30 AM');
  const [slotDurationMinutes, setSlotDurationMinutes] = useState(15);
  const [timings, setTimings] = useState([
    { day: 'Monday', startTime: '10:00 AM', endTime: '02:00 PM', isWorking: true },
    { day: 'Tuesday', startTime: '10:00 AM', endTime: '02:00 PM', isWorking: true },
    { day: 'Wednesday', startTime: '10:00 AM', endTime: '02:00 PM', isWorking: true },
    { day: 'Thursday', startTime: '10:00 AM', endTime: '02:00 PM', isWorking: true },
    { day: 'Friday', startTime: '10:00 AM', endTime: '02:00 PM', isWorking: true },
    { day: 'Saturday', startTime: '10:00 AM', endTime: '01:00 PM', isWorking: true },
    { day: 'Sunday', startTime: '10:00 AM', endTime: '01:00 PM', isWorking: false },
  ]);

  // Leave Application State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);

  const [savingTimings, setSavingTimings] = useState(false);
  const [timingMsg, setTimingMsg] = useState('');
  const [applyingLeave, setApplyingLeave] = useState(false);
  const [leaveMsg, setLeaveMsg] = useState('');

  useEffect(() => {
    fetchProfileAndLeaves();
  }, []);

  const fetchProfileAndLeaves = async () => {
    try {
      const [meRes, leaveRes] = await Promise.all([
        API.get('/auth/me'),
        API.get('/leaves/my'),
      ]);

      const docProf = meRes.data.user?.extraProfile;
      if (docProf) {
        if (docProf.reportingTime) setReportingTime(docProf.reportingTime);
        if (docProf.slotDurationMinutes) setSlotDurationMinutes(docProf.slotDurationMinutes);
        if (docProf.clinicTimings && docProf.clinicTimings.length > 0) {
          setTimings(docProf.clinicTimings);
        }
      }
      setMyLeaves(leaveRes.data.leaves || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleTimingChange = (index, field, value) => {
    const updated = [...timings];
    updated[index][field] = value;
    setTimings(updated);
  };

  const handleSaveTimings = async (e) => {
    e.preventDefault();
    setSavingTimings(true);
    setTimingMsg('');
    try {
      await API.put('/doctors/timings', {
        reportingTime,
        slotDurationMinutes,
        clinicTimings: timings,
      });
      showToast('Clinic schedule & reporting timings updated successfully!', 'success');
      setTimingMsg('Clinic schedule & reporting timings updated successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating timings', 'error');
    } finally {
      setSavingTimings(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      showToast('Please fill all leave details.', 'warning');
      return;
    }

    setApplyingLeave(true);
    setLeaveMsg('');
    try {
      const res = await API.post('/leaves', {
        leaveType,
        startDate,
        endDate,
        reason,
      });

      showToast(`Leave submitted for admin review. Affected appointments: ${res.data.affectedAppointmentsCount || 0}`, 'info');
      setLeaveMsg(`Leave submitted for admin review. Affected appointments: ${res.data.affectedAppointmentsCount || 0}`);
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchProfileAndLeaves();
    } catch (err) {
      showToast(err.response?.data?.message || 'Leave application failed', 'error');
    } finally {
      setApplyingLeave(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Schedule & Leave Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure OPD consultation hours, reporting arrival time, slot intervals, and apply for leaves.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Schedule Configuration */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Weekly Clinic Timings</h2>
            </div>
            <span className="text-xs text-slate-400">Section 6.3 FRD</span>
          </div>

          {timingMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{timingMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveTimings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Clinic Reporting / Arrival Time *
                </label>
                <input
                  type="text"
                  required
                  value={reportingTime}
                  onChange={(e) => setReportingTime(e.target.value)}
                  placeholder="e.g. 09:30 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Appointment Slot Duration (Minutes) *
                </label>
                <select
                  value={slotDurationMinutes}
                  onChange={(e) => setSlotDurationMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                >
                  <option value={10}>10 Minutes per patient</option>
                  <option value={15}>15 Minutes (Standard OPD)</option>
                  <option value={20}>20 Minutes (Comprehensive)</option>
                  <option value={30}>30 Minutes</option>
                </select>
              </div>
            </div>

            {/* Day by Day Timings */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Weekly Working Hours
              </label>

              {timings.map((t, index) => (
                <div
                  key={t.day}
                  className={`p-3 rounded-2xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
                    t.isWorking ? 'bg-slate-50 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3 w-full sm:w-32">
                    <input
                      type="checkbox"
                      checked={t.isWorking}
                      onChange={(e) => handleTimingChange(index, 'isWorking', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <span className="font-bold text-slate-900">{t.day}</span>
                  </div>

                  {t.isWorking ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={t.startTime}
                        onChange={(e) => handleTimingChange(index, 'startTime', e.target.value)}
                        placeholder="10:00 AM"
                        className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-center w-24"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="text"
                        value={t.endTime}
                        onChange={(e) => handleTimingChange(index, 'endTime', e.target.value)}
                        placeholder="02:00 PM"
                        className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-center w-24"
                      />
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Day Off / Non-working</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingTimings}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                {savingTimings ? 'Saving Schedule...' : 'Save & Publish Schedule to Patients'}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Apply for Leave */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Coffee className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Apply for Doctor Leave</h2>
            </div>

            {leaveMsg && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                {leaveMsg}
              </div>
            )}

            <form onSubmit={handleApplyLeave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Full-Day">Full-Day Leave</option>
                  <option value="Partial-Day">Partial-Day (Few hours)</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave / Health</option>
                  <option value="Medical Emergency">Conference / Seminar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">To Date</label>
                  <input
                    type="date"
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Absence</label>
                <textarea
                  rows="2"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Attending annual clinical cardiology conference"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <button
                type="submit"
                disabled={applyingLeave}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition"
              >
                {applyingLeave ? 'Submitting...' : 'Submit Leave Request to Admin'}
              </button>
            </form>
          </div>

          {/* Leave History List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Your Leave History ({myLeaves.length})</h3>

            {myLeaves.length === 0 ? (
              <p className="text-xs text-slate-400">No leave records applied.</p>
            ) : (
              <div className="space-y-2">
                {myLeaves.map((l) => (
                  <div key={l._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{l.leaveType} ({l.totalDays} days)</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-0.5">{l.startDate} to {l.endDate}</p>
                    <p className="text-slate-700 mt-1">{l.reason}</p>
                    {l.adminRemarks && (
                      <p className="text-blue-600 text-[11px] mt-1 font-medium">Admin: {l.adminRemarks}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedulePage;
