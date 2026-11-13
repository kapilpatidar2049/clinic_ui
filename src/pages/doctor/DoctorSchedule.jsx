import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Clock, Calendar, Save, CheckCircle, AlertCircle } from 'lucide-react';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorSchedule = () => {
  const [workingDays, setWorkingDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);
  const [timings, setTimings] = useState({
    morning: { start: '09:00 AM', end: '01:00 PM' },
    evening: { start: '05:00 PM', end: '08:00 PM' },
  });
  const [slotDuration, setSlotDuration] = useState(15);
  const [consultationFee, setConsultationFee] = useState(600);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctorSettings();
  }, []);

  const fetchDoctorSettings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/doctors/dashboard/metrics');
      if (res.data.doctor) {
        const d = res.data.doctor;
        if (d.workingDays) setWorkingDays(d.workingDays);
        if (d.timings) setTimings(d.timings);
        if (d.slotDuration) setSlotDuration(d.slotDuration);
        if (d.consultationFee) setConsultationFee(d.consultationFee);
      }
    } catch (err) {
      console.error('Failed to load doctor settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await API.put('/doctors/timings', {
        workingDays,
        timings,
        slotDuration: Number(slotDuration),
        consultationFee: Number(consultationFee),
      });
      setMessage('Schedule & availability saved successfully. Patient slots updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update schedule.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinic Schedule & Timings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your consultation hours, slot intervals, and available weekly days
        </p>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-xs">
        {/* Working Days */}
        <div>
          <label className="block font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" /> Working Days
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_DAYS.map((day) => {
              const isSelected = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl font-semibold text-xs transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shift Timings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <span className="font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" /> Morning Shift
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">Start Time</label>
                <input
                  type="text"
                  value={timings.morning?.start || '09:00 AM'}
                  onChange={(e) =>
                    setTimings({
                      ...timings,
                      morning: { ...timings.morning, start: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">End Time</label>
                <input
                  type="text"
                  value={timings.morning?.end || '01:00 PM'}
                  onChange={(e) =>
                    setTimings({
                      ...timings,
                      morning: { ...timings.morning, end: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" /> Evening Shift
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">Start Time</label>
                <input
                  type="text"
                  value={timings.evening?.start || '05:00 PM'}
                  onChange={(e) =>
                    setTimings({
                      ...timings,
                      evening: { ...timings.evening, start: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">End Time</label>
                <input
                  type="text"
                  value={timings.evening?.end || '08:00 PM'}
                  onChange={(e) =>
                    setTimings({
                      ...timings,
                      evening: { ...timings.evening, end: e.target.value },
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slot Interval and Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Slot Duration</label>
            <select
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
            >
              <option value={10}>10 Minutes per patient</option>
              <option value={15}>15 Minutes per patient (Recommended)</option>
              <option value={20}>20 Minutes per patient</option>
              <option value={30}>30 Minutes per patient</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Standard Consultation Fee (₹)</label>
            <input
              type="number"
              min={0}
              step={50}
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating Schedule...' : 'Save Availability'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorSchedule;

