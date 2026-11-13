import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const BookAppointmentPage = () => {
  const { doctorId } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotsData, setSlotsData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Clinic');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && selectedDate) {
      fetchSlots(doctorId, selectedDate);
    }
  }, [doctorId, selectedDate]);

  const fetchDoctor = async () => {
    setLoadingDoctor(true);
    try {
      const res = await API.get('/doctors');
      const found = (res.data.doctors || []).find((d) => d._id === doctorId);
      if (!found) {
        showToast('Doctor not found or currently unavailable.', 'error');
        navigate('/doctors');
        return;
      }
      setDoctor(found);
    } catch (err) {
      showToast('Error loading doctor information.', 'error');
    } finally {
      setLoadingDoctor(false);
    }
  };

  const fetchSlots = async (docId, date) => {
    setLoadingSlots(true);
    setBookingError('');
    setSelectedSlot(null);
    try {
      const res = await API.get(`/appointments/slots/${docId}?date=${date}`);
      setSlotsData(res.data);
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Could not load time slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please choose an available appointment slot.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const res = await API.post('/appointments', {
        doctorId: doctor._id,
        date: selectedDate,
        slotTime: selectedSlot.slotTime,
        tokenNumber: selectedSlot.tokenNumber,
        symptoms,
        paymentMethod,
      });

      setBookingSuccess(res.data.appointment);
      showToast(`Appointment confirmed! Token #${res.data.appointment.tokenNumber}`, 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to book appointment.';
      setBookingError(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading doctor details and OPD schedule...
      </div>
    );
  }

  if (!doctor) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Book OPD Consultation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select date and an available 15-minute slot with Dr. {doctor.userId?.name}.
        </p>
      </div>

      {bookingSuccess ? (
        /* Confirmation Screen */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              Your consultation booking has been saved into the clinic queue.
            </p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left text-xs sm:text-sm space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Appointment ID:</span>
              <span className="font-mono font-bold text-slate-900">{bookingSuccess.appointmentId}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Queue Token:</span>
              <span className="font-black text-emerald-600 text-base">Token #{bookingSuccess.tokenNumber}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Doctor:</span>
              <span className="font-bold text-slate-800">Dr. {doctor.userId?.name} ({doctor.specialization})</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
              <span className="text-slate-500">Date & Slot:</span>
              <span className="font-bold text-slate-800">
                {bookingSuccess.date} at {bookingSuccess.slotTime}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Consultation Fee:</span>
              <span className="font-bold text-slate-900">₹{doctor.consultationFee} ({bookingSuccess.paymentMethod})</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              View in My Appointments
            </button>
            <Link
              to="/doctors"
              className="py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition text-center"
            >
              Back to Doctors
            </Link>
          </div>
        </div>
      ) : (
        /* Booking Form */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doctor Info Card */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-xl flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                  {doctor.userId?.name ? doctor.userId.name.charAt(0) : 'D'}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Dr. {doctor.userId?.name}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">{doctor.specialization}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-semibold text-slate-700">{doctor.experienceYears} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualifications:</span>
                  <span className="font-semibold text-slate-700">{doctor.qualifications || 'MBBS, MD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-emerald-600 text-sm">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OPD Timings:</span>
                  <span className="font-semibold text-slate-700">
                    {doctor.opdStartTime} - {doctor.opdEndTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Working Days:</span>
                  <span className="font-semibold text-slate-700">
                    {(doctor.availableDays || []).join(', ') || 'Mon - Sat'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-emerald-800 text-[11px]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Verified Specialist & Clinical Consultant</span>
              </div>
            </div>
          </div>

          {/* Booking Inputs */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleConfirmBooking}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-6"
            >
              {bookingError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Step 1: Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Consultation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
                  />
                </div>
              </div>

              {/* Step 2: Time Slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    2. Choose Available Time Slot
                  </label>
                  {slotsData && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      {slotsData.availableSlotsCount} of {slotsData.totalSlots} slots free
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Checking doctor availability for {selectedDate}...
                  </div>
                ) : !slotsData?.isDoctorAvailable ? (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    {slotsData?.message || 'Doctor is not available on this date. Please choose another date.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto p-1 scrollbar-thin">
                    {slotsData.slots.map((slot) => (
                      <button
                        key={slot.slotTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-2xl text-xs font-semibold border text-center transition ${
                          !slot.isAvailable
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60'
                            : selectedSlot?.slotTime === slot.slotTime
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600 ring-offset-1'
                            : 'bg-white hover:bg-emerald-50/70 text-slate-800 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-bold">{slot.slotTime}</div>
                        <div className="text-[10px] font-normal opacity-80">Token #{slot.tokenNumber}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Symptoms */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  3. Health Concern / Reason for Visit
                </label>
                <textarea
                  rows="2"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. High fever since yesterday, regular blood pressure checkup, body ache..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
                />
              </div>

              {/* Step 4: Payment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  4. Payment Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash at Clinic')}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'Cash at Clinic'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600 ring-offset-1'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <span>Pay at Clinic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Online (Card/UPI)')}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'Online (Card/UPI)'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600 ring-offset-1'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Online UPI / Card</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={!selectedSlot || bookingLoading}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    'Confirming Slot...'
                  ) : (
                    <>
                      <span>Confirm Booking • ₹{doctor.consultationFee}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <Link
                  to="/doctors"
                  className="py-3.5 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointmentPage;

