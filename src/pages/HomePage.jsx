import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
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
  Sparkles,
  ChevronRight,
  Stethoscope,
  Building,
  Image as ImageIcon,
  Eye,
  X,
  Users,
  Briefcase,
  Play,
  Award,
  Zap,
} from 'lucide-react';

const FALLBACK_GALLERY = [
  {
    title: 'Executive OPD Consultation Suite',
    category: 'OPD Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    description: 'Ergonomic consultation suites with integrated digital vitals monitors and paperless diagnosis terminal.',
  },
  {
    title: 'Patient Waiting Lounge & Reception Desk',
    category: 'Waiting Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Hygienic, comfortable waiting environment with live queue token sequencing LED displays.',
  },
  {
    title: 'Automated Pathology & Diagnostic Lab',
    category: 'Diagnostics & Lab',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    description: 'NABL accredited pathology and clinical biochemistry testing for accurate same-day reports.',
  },
  {
    title: 'Minor OT & Daycare Procedure Wing',
    category: 'Procedure & OT',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    description: 'Ultra-sterile surgical environment for outpatient minor surgeries, wound care, and sterile dressings.',
  },
  {
    title: '24/7 Integrated Digital Pharmacy',
    category: 'Pharmacy',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
    description: 'Directly linked to doctor digital prescriptions for 100% accurate medicine dispensing.',
  },
  {
    title: 'Emergency Home Care & Mobile Unit',
    category: 'Emergency',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    description: 'Equipped with mobile ECG, oxygen therapy, and real-time GPS telemetry for urgent home visits.',
  },
];

const HomePage = () => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [clinicData, setClinicData] = useState(null);
  const [galleryItems, setGalleryItems] = useState(FALLBACK_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [docRes, clinicRes] = await Promise.all([
        API.get('/doctors').catch(() => ({ data: { doctors: [] } })),
        API.get('/clinic/public').catch(() => ({ data: null })),
      ]);

      setDoctors(docRes.data.doctors || []);

      if (clinicRes.data && clinicRes.data.clinic) {
        setClinicData(clinicRes.data.clinic);
        if (clinicRes.data.clinic.gallery && clinicRes.data.clinic.gallery.length > 0) {
          setGalleryItems(clinicRes.data.clinic.gallery);
        }
      }
    } catch (err) {
      console.warn('Error fetching homepage data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleQuickDemo = async (role) => {
    try {
      await demoLogin(role);
      if (role === 'Admin') navigate('/admin');
      else if (role === 'Doctor') navigate('/doctor');
      else if (role === 'Staff') navigate('/staff');
      else navigate('/patient/appointments');
    } catch (err) {
      console.error(err);
    }
  };

  // Filter gallery items by category
  const categories = ['All', ...new Set(galleryItems.map((item) => item.category || 'Facilities'))];
  const filteredGallery =
    selectedCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero Section - Ultra Modern SaaS Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-10 sm:pt-16 pb-16 sm:pb-24 border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Quick Demo Launch Pills */}
          <div className="mb-8 inline-flex items-center gap-2 p-1.5 pr-4 rounded-full bg-white border border-emerald-200/80 shadow-xs flex-wrap">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-700">Explore Interactive Live Demo:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRoleQuickDemo('Admin')}
                className="text-[11px] font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 active:scale-95 transition cursor-pointer"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickDemo('Doctor')}
                className="text-[11px] font-extrabold text-teal-700 bg-teal-50 hover:bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200 active:scale-95 transition cursor-pointer"
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickDemo('Patient')}
                className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200 active:scale-95 transition cursor-pointer"
              >
                👤 Patient
              </button>
              <button
                type="button"
                onClick={() => handleRoleQuickDemo('Staff')}
                className="text-[11px] font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 active:scale-95 transition cursor-pointer"
              >
                💼 Staff
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Everything Your Clinic Needs to Run Like a{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
                  Modern Hospital.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                Real-time queue token sequencing with smart 30-minute buffer rules, branded digital letterhead prescriptions, on-demand emergency GPS doctor dispatch, and automated staff payroll — in one unified platform.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3.5 pt-2">
                <Link
                  to="/doctors"
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  <span>Book Available OPD Slot</span>
                </Link>

                <Link
                  to="/emergency"
                  className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-lg shadow-rose-600/25 flex items-center gap-2 transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <Ambulance className="w-4 h-4 stroke-[2.5]" />
                  <span>Emergency Home Visit</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleRoleQuickDemo('Admin')}
                  className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin Hub Demo</span>
                </button>
              </div>

              {/* Trust Badges Bar */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/90 max-w-lg">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">15 min</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Auto Slot Interval</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">100%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Zero Double-Booking</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-rose-600">24/7</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">On-Call Home Care</p>
                </div>
              </div>
            </div>

            {/* Right Interactive Mockup / Live OPD Simulator */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 sm:p-6 space-y-4 relative overflow-hidden ring-1 ring-slate-950/5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Live Clinic OPD Station
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Real-time Sequencing
                  </span>
                </div>

                {/* Queue simulation items */}
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex flex-col items-center justify-center text-xs shadow-sm">
                        <span className="text-[8px] leading-tight">TOKEN</span>
                        <span className="text-sm font-black leading-none">#01</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Dr. Rajesh Sharma</p>
                        <p className="text-[11px] text-emerald-700 font-semibold">Cardiology • 10:00 AM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
                      In Consultation 🟢
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 font-black flex flex-col items-center justify-center text-xs">
                        <span className="text-[8px] leading-tight">TOKEN</span>
                        <span className="text-sm font-black leading-none">#02</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-900">Dr. Rajesh Sharma</p>
                        <p className="text-[11px] text-slate-500 font-medium">Cardiology • 10:15 AM</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-full shadow-xs border border-slate-100">
                      Next in Queue ⏳
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                        🚑
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-rose-950">Emergency Home Visit</p>
                        <p className="text-[11px] text-rose-700 font-medium">On-Call Doctor Dispatched via GPS</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-rose-800 bg-white px-2.5 py-1 rounded-full shadow-xs border border-rose-100">
                      En Route 📍
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">Conflict-Free Sequencer</span>
                  <Link
                    to="/doctors"
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 text-[11px]"
                  >
                    <span>Reserve Your Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. CLINIC INFRASTRUCTURE & FACILITIES GALLERY (THE USER REQUEST!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold mb-2">
              <Building className="w-3.5 h-3.5 text-purple-600" />
              <span>World-Class Medical Infrastructure</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Clinic Facilities & Care Suites
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              State-of-the-art consultation suites, automated diagnostic lab, sterile procedure room, and 24/7 digital pharmacy.
            </p>
          </div>

          {/* Admin Managed Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Dynamic Gallery • Editable from Admin Hub</span>
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item._id || idx}
              onClick={() => setLightboxPhoto(item)}
              className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Pill on Image */}
                  <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                    {item.category}
                  </span>

                  {/* Hover Inspect Icon */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-2 rounded-2xl bg-white/95 text-slate-900 font-extrabold text-xs shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>View Full Screen</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-700 transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-1 flex items-center justify-between text-[11px] text-purple-700 font-bold">
                <span>Inspect Facility →</span>
                <span className="text-slate-400 font-normal">MyClinic Infrastructure</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Four Integrated Clinical Pillars (Showcase for Clients) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Full-Spectrum Healthcare Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Four Dedicated Portals in One System
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Engineered specifically to solve the daily pain points of patients, physicians, front-desk staff, and hospital directors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Patient */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Patient Web & Mobile</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conflict-free slot booking with 30-min buffer rules, digital token boarding passes, prescription history, and emergency home care requests.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRoleQuickDemo('Patient')}
              className="mt-5 inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <span>Test Patient Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Card 2: Doctor */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Doctor Workstation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Live OPD patient queue, 1-tap consultation caller, custom branded letterhead e-prescriptions with dosage regimens, and emergency visit alerts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRoleQuickDemo('Doctor')}
              className="mt-5 inline-flex items-center text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
            >
              <span>Test Doctor Station</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Card 3: Staff */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Front Desk & Staff</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Walk-in patient registration, biometric/daily check-in attendance punch, task assignment board, and digital monthly salary slips.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRoleQuickDemo('Staff')}
              className="mt-5 inline-flex items-center text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <span>Test Staff Desk</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Card 4: Admin */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-13 h-13 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">Admin Command Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Centralized doctor onboarding, staff payroll ledger generator, leave approvals, gallery updates, audit trails, and revenue analytics.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRoleQuickDemo('Admin')}
              className="mt-5 inline-flex items-center text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
            >
              <span>Test Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Featured Doctors & Real-time Slots Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Verified Medical Practitioners
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any consultant to view automated 15-minute slot intervals and reserve instant queue token.
            </p>
          </div>
          <Link
            to="/doctors"
            className="text-xs font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>All Doctors ({doctors.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.slice(0, 3).map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-lg flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                      {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        Dr. {doc.userId?.name}
                      </h3>
                      <p className="text-xs font-bold text-emerald-700">{doc.specialization}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {doc.qualifications || 'MBBS, MD'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-black text-xs shrink-0">
                    ₹{doc.consultationFee}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 text-[11px] text-center border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Experience</span>
                    <span className="font-bold text-slate-800">{doc.experienceYears}+ Yrs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Slot Time</span>
                    <span className="font-bold text-slate-800">{doc.slotDurationMinutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">OPD Time</span>
                    <span className="font-bold text-slate-800">{doc.reportingTime || '09:30 AM'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <Link
                  to="/doctors"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Select & Book Available Slot</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Emergency 24/7 Home Visit Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl shadow-rose-600/25 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="space-y-4 max-w-xl relative z-10 text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold tracking-wider uppercase">
              🚨 24/7 Rapid Response Unit
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Need Immediate Doctor Care at Home?
            </h2>
            <p className="text-xs sm:text-sm text-rose-100 leading-relaxed font-normal">
              For acute emergencies, elderly bedridden patients, or sudden illnesses. The system instantly broadcasts high-priority alerts with GPS navigation to all on-call clinic doctors.
            </p>
          </div>

          <div className="shrink-0 space-y-3 w-full sm:w-auto relative z-10">
            <Link
              to="/emergency"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-rose-700 hover:bg-rose-50 active:scale-95 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ambulance className="w-5 h-5 text-rose-600 animate-bounce" />
              <span>Request Doctor Home Visit Now</span>
            </Link>
            <p className="text-xs text-center text-rose-200 font-medium">
              24/7 Helpline: <strong className="text-white">+91 98765 00100</strong>
            </p>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* 6. Lightbox Full-Screen Modal for Gallery */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[65vh] w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="max-h-[65vh] w-full object-contain"
              />
            </div>

            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {lightboxPhoto.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">• Verified Clinic Infrastructure</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">{lightboxPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {lightboxPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;