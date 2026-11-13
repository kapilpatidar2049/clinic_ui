import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Calendar,
  Clock,
  Award,
  DollarSign,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';

const DoctorListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorsAndSpecs();
  }, [selectedSpec]);

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

  const handleBookingClick = (docId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/patient/book/${docId}`);
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
                  onClick={() => handleBookingClick(doc._id)}
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
    </div>
  );
};

export default DoctorListPage;
