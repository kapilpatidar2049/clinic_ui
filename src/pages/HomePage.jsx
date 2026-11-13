import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Calendar,
  Clock,
  ShieldCheck,
  Ambulance,
  Heart,
  UserCheck,
  FileText,
  Activity,
  ArrowRight,
  Star,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, specRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/admin/specializations').catch(() => ({ data: { specializations: [] } })),
      ]);
      setDoctors(docRes.data.doctors || []);
      setSpecializations(specRes.data?.specializations || []);
    } catch (err) {
      console.warn('Error fetching homepage data:', err.message);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-slate-50 pt-12 pb-20 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Digital Clinic Management Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Modern Healthcare,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                  Seamlessly Managed.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Experience smart doctor appointment scheduling, verified digital prescriptions on custom letterheads,
                on-demand emergency home visits, and centralized clinic administration in one unified system.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Calendar className="w-4 h-4" />
                  Book Doctor Appointment
                </Link>

                <Link
                  to="/emergency"
                  className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-lg shadow-rose-600/25 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Ambulance className="w-4 h-4" />
                  Emergency Doctor Home Visit
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg">
                <div>
                  <p className="text-2xl font-bold text-slate-900">15 min</p>
                  <p className="text-xs text-slate-500">Auto Slot Intervals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-600">100%</p>
                  <p className="text-xs text-slate-500">Conflict-Free Booking</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-600">24/7</p>
                  <p className="text-xs text-slate-500">On-Call Home Care</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Column */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 space-y-5 relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Today's Clinic OPD</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                    Live Active Queue
                  </span>
                </div>

                {/* Queue simulation */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                        #1
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. Rajesh Sharma</p>
                        <p className="text-[11px] text-slate-500">Cardiology • 10:00 AM</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-1 rounded shadow-xs">
                      Consulting Now
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        #2
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. Rajesh Sharma</p>
                        <p className="text-[11px] text-slate-500">Cardiology • 10:15 AM</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-1 rounded shadow-xs">
                      Next in Queue
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center text-xs">
                        🚨
                      </div>
                      <div>
                        <p className="text-xs font-bold text-rose-900">Emergency Home Visit</p>
                        <p className="text-[11px] text-rose-600">On-Call Doctor Dispatched</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-rose-700 bg-white px-2 py-1 rounded shadow-xs">
                      Accepted
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/doctors"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1"
                  >
                    View All Doctors & Reserve Time Slot <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of My Clinic */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Four Integrated Clinical Workflows</h2>
          <p className="text-sm text-slate-600 mt-2">
            Tailored interfaces designed for Patients, Doctors, Clinic Support Staff, and Clinic Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Patient */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Patient Web & Mobile</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find specialists, pick preferred dates, book automatically calculated sequence slots, track emergency visits, and view prescriptions.
            </p>
            <Link to="/patient/appointments" className="mt-4 inline-flex items-center text-xs font-semibold text-teal-600 hover:underline">
              Patient Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 2: Doctor */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Doctor Workstation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live consultation queue, patient medical history, digital prescription writer with branded letterhead, and emergency home visit alerts.
            </p>
            <Link to="/doctor" className="mt-4 inline-flex items-center text-xs font-semibold text-blue-600 hover:underline">
              Doctor Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 3: Staff */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Staff Operations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Daily attendance punch with check-in/out hours, admin assigned task board, walk-in front desk booking, and monthly salary slips.
            </p>
            <Link to="/staff" className="mt-4 inline-flex items-center text-xs font-semibold text-emerald-600 hover:underline">
              Staff Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Card 4: Admin */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Admin Command Hub</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Manage doctors, staff payroll, leave approvals, appointment configurations, letterhead branding, and operational analytics.
            </p>
            <Link to="/admin" className="mt-4 inline-flex items-center text-xs font-semibold text-purple-600 hover:underline">
              Admin Portal <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Clinic Specialists & Physicians</h2>
            <p className="text-xs text-slate-500 mt-1">Select a doctor to view working hours and book your appointment.</p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            All Doctors ({doctors.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((doc) => (
            <div key={doc._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm uppercase">
                      {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Dr. {doc.userId?.name}</h3>
                      <p className="text-xs font-semibold text-emerald-600">{doc.specialization}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <div className="mt-4 text-xs text-slate-600 space-y-1.5">
                  <p>🎓 <span className="font-medium text-slate-800">{doc.qualifications?.join(', ')}</span></p>
                  <p>⏳ <span className="font-medium text-slate-800">{doc.experienceYears}+ years experience</span></p>
                  <p>⏱️ <span className="font-medium text-slate-800">{doc.slotDurationMinutes} min slot interval</span></p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to={`/doctors`}
                  className="w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-semibold text-xs transition flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  View Schedule & Book Slot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Home Visit Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl shadow-rose-600/20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold tracking-wider uppercase">
              24/7 Rapid Response
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">Need Urgent Medical Care at Home?</h2>
            <p className="text-sm text-rose-100 leading-relaxed">
              If a patient is unable to visit the clinic due to acute illness or emergency, request an immediate doctor home visit. The system rings available on-call doctors with GPS location.
            </p>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto">
            <Link
              to="/emergency"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Ambulance className="w-5 h-5 text-rose-600 animate-bounce" />
              Request Doctor Home Visit Now
            </Link>
            <p className="text-[11px] text-center text-rose-200">
              Emergency Hotline: <span className="font-bold text-white">+91 98765 00100</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
