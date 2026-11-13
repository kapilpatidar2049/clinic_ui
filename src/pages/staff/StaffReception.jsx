import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Ticket, Printer, CheckCircle, AlertCircle, Clock, Stethoscope, Search, UserPlus } from 'lucide-react';

const StaffReception = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookedToken, setBookedToken] = useState(null);
  const [error, setError] = useState('');

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientAge, setPatientAge] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [docRes, appRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/appointments'),
      ]);
      const docs = docRes.data.doctors || [];
      setDoctors(docs);
      if (docs.length > 0) setSelectedDoctorId(docs[0]._id);
      setAppointments(appRes.data.appointments || []);
    } catch (err) {
      console.error('Failed to load reception data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookWalkIn = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      // Find default slot or current time
      const currentTimeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const res = await API.post('/appointments', {
        doctorId: selectedDoctorId,
        appointmentDate: todayStr,
        slotTime: selectedSlot || currentTimeStr,
        problemDescription: problemDescription || 'Walk-in consultation',
        isWalkIn: true,
        patientDetails: {
          name: patientName,
          phone: patientPhone,
          age: patientAge ? Number(patientAge) : undefined,
          gender: patientGender,
        },
      });

      setBookedToken(res.data.appointment);
      setPatientName('');
      setPatientPhone('');
      setPatientAge('');
      setProblemDescription('');
      fetchInitialData();
    } catch (err) {
      setError(err.response?.data?.message || 'Walk-in booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  const todayQueue = appointments.filter((a) => a.appointmentDate === todayStr);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reception Desk & Walk-in Tokens</h1>
        <p className="text-xs text-slate-500 mt-1">Issue immediate consultation tokens for walk-in patients and monitor queue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Walk-in Booking Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" /> Walk-In Patient Registration
          </h2>
          <p className="text-xs text-slate-500 mb-6">Generates immediate queue token number</p>

          {error && (
            <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleBookWalkIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sunil Sharma"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  placeholder="Years"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Consulting Doctor *</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.userId?.name} ({d.specialization}) - ₹{d.consultationFee}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Symptoms / Chief Complaint</label>
              <input
                type="text"
                placeholder="e.g. Stomach ache, blood pressure check..."
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              {bookingLoading ? 'Issuing Token...' : 'Generate Consultation Token'}
            </button>
          </form>

          {/* Token Printable Card */}
          {bookedToken && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Token Generated Successfully</span>
              <div className="text-3xl font-black text-emerald-900 font-mono">
                Token #{bookedToken.tokenNumber}
              </div>
              <p className="text-xs text-slate-600">
                {bookedToken.patientId?.name || patientName} • Dr. {bookedToken.doctorId?.userId?.name || 'Doctor'}
              </p>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs inline-flex items-center gap-1 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> Print Token Slip
              </button>
            </div>
          )}
        </div>

        {/* Live Queue Monitor */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Clinic Queue</h2>
              <p className="text-xs text-slate-500">Live consultation queue status for all doctors</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs">
              {todayQueue.length} Patients
            </span>
          </div>

          {todayQueue.length === 0 ? (
            <div className="text-center py-20 text-xs text-slate-400">
              No patients in the queue for today yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {todayQueue.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-sm shrink-0">
                      #{app.tokenNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{app.patientId?.name || 'Walk-in Patient'}</h4>
                      <p className="text-slate-500 text-[11px]">
                        Dr. {app.doctorId?.userId?.name} ({app.doctorId?.specialization})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        app.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : app.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">{app.slotTime}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffReception;

