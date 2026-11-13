import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  UserCheck,
  ChevronLeft,
} from 'lucide-react';

const AdminDoctorsPage = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDoctorsAndSpecs();
  }, []);

  const fetchDoctorsAndSpecs = async () => {
    try {
      const [docRes, specRes] = await Promise.all([
        API.get('/doctors'),
        API.get('/admin/specializations').catch(() => ({ data: { specializations: [] } })),
      ]);
      setDoctors(docRes.data.doctors || []);
      setSpecializations(specRes.data?.specializations || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Doctor Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section 8.2 FRD: Manage physicians, OPD reporting hours, slot duration, fees, and digital letterheads.
          </p>
        </div>

        <Link
          to="/admin/doctors/new"
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-md shadow-purple-700/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add New Doctor
        </Link>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Doctors Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-base">
                    {doc.userId?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Dr. {doc.userId?.name}</h3>
                    <p className="text-xs font-semibold text-purple-600">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400">{doc.userId?.email}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">
                  ₹{doc.consultationFee}
                </span>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporting Time:</span>
                  <span className="font-bold text-slate-800">{doc.reportingTime || '09:30 AM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Slot Duration:</span>
                  <span className="font-bold text-slate-800">{doc.slotDurationMinutes} mins / patient</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualifications:</span>
                  <span className="font-semibold text-slate-800">{doc.qualifications?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Registration No:</span>
                  <span className="font-mono text-slate-700">{doc.registrationNumber}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                <p className="font-semibold text-slate-700">Digital Letterhead Header:</p>
                <p className="truncate italic text-slate-500">
                  {doc.digitalLetterhead?.headerText || 'Consultant Physician'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDoctorsPage;
