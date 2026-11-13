import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Stethoscope,
  Clock,
  Calendar,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';

export const WalkInBookingPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotTime, setSlotTime] = useState('11:00 AM');
  const [symptoms, setSymptoms] = useState('Walk-in Consultation');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Clinic');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [docRes, patRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/admin/patients').catch(() => ({ data: { patients: [] } })),
      ]);
      setDoctors(docRes.data.doctors || []);
      setPatients(patRes.data?.patients || []);
    } catch (err) {
      showToast('Error loading doctors or patients list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !doctorId) {
      setErrorMsg('Please select both a patient and a doctor.');
      showToast('Please select both a patient and a doctor.', 'warning');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await API.post('/appointments', {
        doctorId,
        date,
        slotTime,
        symptoms,
        bookedForPatientId: patientId,
        paymentMethod,
      });

      showToast('Walk-in patient added to OPD queue successfully!', 'success');
      navigate('/staff/reception');
    } catch (err) {
      const errText = err.response?.data?.message || 'Walk-in booking error';
      setErrorMsg(errText);
      showToast(errText, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctorObj = doctors.find((d) => d._id === doctorId);
  const selectedPatientObj = patients.find((p) => p._id === patientId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Title */}
      <div>
        <Link
          to="/staff/reception"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reception Desk</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Front Desk: Register Walk-In Patient
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Issue immediate queue token for on-spot patients and slot them into the active OPD doctor roster.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading patient directory and doctor schedules...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6"
        >
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Patient Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Select Patient *
            </label>
            <select
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
            >
              <option value="">-- Choose Registered Patient ({patients.length} available) --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} • {p.phone || 'No phone'} ({p.email})
                </option>
              ))}
            </select>
            {selectedPatientObj && (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Selected: <strong>{selectedPatientObj.name}</strong></span>
                <span>Gender: {selectedPatientObj.gender || 'N/A'} • Blood: {selectedPatientObj.bloodGroup || 'N/A'}</span>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Assign Consulting Doctor *
            </label>
            <select
              required
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
            >
              <option value="">-- Choose Doctor ({doctors.length} active) --</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>
                  Dr. {d.userId?.name} ({d.specialization}) — Fee: ₹{d.consultationFee}
                </option>
              ))}
            </select>
            {selectedDoctorObj && (
              <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span>Dr. {selectedDoctorObj.userId?.name} ({selectedDoctorObj.specialization})</span>
                <span className="font-bold">Consultation Fee: ₹{selectedDoctorObj.consultationFee}</span>
              </div>
            )}
          </div>

          {/* Date and Slot Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Consultation Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                4. Slot / Queue Time
              </label>
              <input
                type="text"
                required
                value={slotTime}
                onChange={(e) => setSlotTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
              />
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              5. Chief Complaint / Reason for Visit
            </label>
            <input
              type="text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Fever, acute joint pain, walk-in emergency"
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              6. Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Cash at Clinic', 'Online UPI', 'Card'].map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition ${
                    paymentMethod === pm
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              {submitting ? 'Registering...' : 'Add Patient to Queue & Issue Token'}
            </button>
            <Link
              to="/staff/reception"
              className="py-3.5 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default WalkInBookingPage;

