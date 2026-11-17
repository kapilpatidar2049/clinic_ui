import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Calendar,
  Clock,
  Award,
  DollarSign,
  ChevronRight,
  Stethoscope,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Banknote,
  Sparkles,
} from 'lucide-react';

const DoctorListPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotsData, setSlotsData] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash at Clinic');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchDoctorsAndSpecs();
  }, [selectedSpec]);

  useEffect(() => {
    if (bookingDoctor && bookingDate) {
      fetchSlots(bookingDoctor._id, bookingDate);
    }
  }, [bookingDoctor, bookingDate]);

  const fetchDoctorsAndSpecs = async () => {
    setLoading(true);
    try {
      const [docRes, specRes] = await Promise.all([
        API.get(`/doctors?specialization=${selectedSpec}`),
        API.get('/admin/specializations').catch(() => ({ data: { specializations: [] } })),
      ]);
      setDoctors(docRes.data.doctors || []);
      setSpecializations(specRes.data.specializations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
      setBookingError(err.response?.data?.message || 'Could not load slots for this date.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleOpenBookingModal = (doc) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingDoctor(doc);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setSelectedSlot(null);
    setSymptoms('');
    setPaymentMethod('Cash at Clinic');
    setBookingError('');
    setBookingSuccess(null);
  };

  const handleCloseBookingModal = () => {
    setBookingDoctor(null);
    setBookingSuccess(null);
    setSelectedSlot(null);
    setBookingError('');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setBookingError('Please choose an available appointment slot.');
      return;
    }

    setSubmittingBooking(true);
    setBookingError('');

    try {
      const res = await API.post('/appointments', {
        doctorId: bookingDoctor._id,
        date: bookingDate,
        slotTime: selectedSlot.slotTime,
        tokenNumber: selectedSlot.tokenNumber,
        symptoms,
        paymentMethod,
      });

      setBookingSuccess(res.data.appointment);
      if (showToast) {
        showToast(`Appointment confirmed! Token #${res.data.appointment.tokenNumber}`, 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment.';
      setBookingError(msg);
      if (showToast) {
        showToast(msg, 'error');
      }
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filteredDoctors = doctors.filter(
    (d) =>
      d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Clinic Doctors & Specialists</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Select a physician to check real-time OPD availability, automatic 15-minute slot allocation, and fees.
        </p>
      </div>

      {/* Search & Specialization Filters */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
          />
        </div>

        {/* Specialization Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSpec('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedSpec === 'All'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            All Specialties
          </button>
          {specializations.map((spec) => (
            <button
              key={spec.name}
              onClick={() => setSelectedSpec(spec.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedSpec === spec.name
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {spec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading verified medical practitioners...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No doctors match your criteria</h3>
          <p className="text-xs text-slate-500">Try choosing a different specialization or clearing search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                      {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Dr. {doc.userId?.name}</h3>
                      <p className="text-xs text-emerald-600 font-semibold">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400">{doc.qualifications || 'MBBS, MD'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Clinical Experience:</span>
                    <span className="font-medium text-slate-800">{doc.experienceYears}+ Years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">OPD Reporting Time:</span>
                    <span className="font-medium text-slate-800">{doc.reportingTime || '09:30 AM'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Appointment Slot:</span>
                    <span className="font-medium text-slate-800">{doc.slotDurationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Reg No:</span>
                    <span className="font-medium text-slate-800">{doc.registrationNumber}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 line-clamp-2">
                  {doc.about || 'Specialist dedicated to comprehensive patient care and clinical excellence.'}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleOpenBookingModal(doc)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Select & Book Available Slot</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md text-white font-black text-lg flex items-center justify-center border border-white/30">
                  {bookingDoctor.userId?.name ? bookingDoctor.userId.name.charAt(0) : 'D'}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">
                    Dr. {bookingDoctor.userId?.name}
                  </h3>
                  <p className="text-xs text-emerald-100 font-medium">
                    {bookingDoctor.specialization} • Fee: ₹{bookingDoctor.consultationFee}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseBookingModal}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {bookingSuccess ? (
              <div className="p-6 sm:p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Appointment Confirmed!</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Your appointment has been booked. Notification has been sent to Dr. {bookingDoctor.userId?.name}.
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
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-slate-800">
                      {bookingSuccess.date} at {bookingSuccess.slotTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Consultation Fee:</span>
                    <span className="font-bold text-slate-900">
                      ₹{bookingDoctor.consultationFee} ({bookingSuccess.paymentMethod})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseBookingModal();
                      navigate('/patient/appointments');
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                  >
                    View in My Appointments
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseBookingModal}
                    className="py-3 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition text-center cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="p-6 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
                {bookingError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* 1. Date Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Select Consultation Date
                    </label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setBookingDate(new Date().toISOString().split('T')[0])}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                          bookingDate === new Date().toISOString().split('T')[0]
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tmrw = new Date();
                          tmrw.setDate(tmrw.getDate() + 1);
                          setBookingDate(tmrw.toISOString().split('T')[0]);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                          (() => {
                            const tmrw = new Date();
                            tmrw.setDate(tmrw.getDate() + 1);
                            return bookingDate === tmrw.toISOString().split('T')[0];
                          })()
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Tomorrow
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
                  />
                </div>

                {/* 2. Choose Time Slot */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      2. Available Time Slots ({bookingDate})
                    </label>
                    {slotsData && slotsData.isDoctorAvailable && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {slotsData.availableSlotsCount} of {slotsData.totalSlots} slots free
                      </span>
                    )}
                  </div>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Checking real-time doctor availability for {bookingDate}...
                    </div>
                  ) : !slotsData?.isDoctorAvailable ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      {slotsData?.message || 'Doctor is not available on this date. Please choose another date.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
                      {slotsData.slots.map((slot) => (
                        <button
                          key={slot.tokenNumber}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-2.5 rounded-xl text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                            !slot.isAvailable
                              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                              : selectedSlot?.tokenNumber === slot.tokenNumber
                              ? 'bg-emerald-600 text-white font-bold shadow-md ring-2 ring-emerald-600 ring-offset-1'
                              : 'bg-white hover:bg-emerald-50/70 border border-slate-200 text-slate-700 hover:border-emerald-300'
                          }`}
                        >
                          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                            Token #{slot.tokenNumber}
                          </span>
                          <span className="text-xs font-bold">{slot.slotTime}</span>
                          {!slot.isAvailable && <span className="text-[9px] text-rose-500 font-semibold">Booked</span>}
                        </button>
                      ))}
                    </div>
                  )}

                  {selectedSlot && (
                    <p className="text-xs text-emerald-700 font-medium mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Selected: <strong>{selectedSlot.slotTime}</strong> (Token #{selectedSlot.tokenNumber})
                    </p>
                  )}
                </div>

                {/* 3. Reason / Symptoms */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    3. Symptoms / Reason for Visit
                  </label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Fever, continuous headache, routine follow-up..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
                  />
                </div>

                {/* 4. Payment Method */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    4. Payment Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition ${
                        paymentMethod === 'Cash at Clinic'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modalPayment"
                        value="Cash at Clinic"
                        checked={paymentMethod === 'Cash at Clinic'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600"
                      />
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>Pay at Clinic</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer text-xs font-semibold transition ${
                        paymentMethod === 'Online (Card/UPI)'
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="modalPayment"
                        value="Online (Card/UPI)"
                        checked={paymentMethod === 'Online (Card/UPI)'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-emerald-600"
                      />
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Online (UPI/Card)</span>
                    </label>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!selectedSlot || submittingBooking}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submittingBooking ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Confirming...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm Booking • ₹{bookingDoctor.consultationFee}</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseBookingModal}
                    className="py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;
