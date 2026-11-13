import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Clock,
  ShieldAlert,
  FileText,
  Heart,
  ChevronRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const AdminPatientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // 1. Fetch patient list to locate this patient
      const res = await API.get('/admin/patients');
      const found = (res.data.patients || []).find((p) => p._id === id);

      if (!found) {
        showToast('Patient not found in clinic records.', 'error');
        navigate('/admin/patients');
        return;
      }
      setPatient(found);

      // 2. Fetch appointments for this patient
      try {
        const apptRes = await API.get(`/appointments?patientId=${id}`);
        setAppointments(apptRes.data.appointments || []);
      } catch (e) {
        console.warn('Could not load appointments', e);
      }

      // 3. Fetch medical reports for this patient
      try {
        const repRes = await API.get(`/reports?patientId=${id}`);
        setReports(repRes.data.reports || []);
      } catch (e) {
        console.warn('Could not load reports', e);
      }
    } catch (err) {
      showToast('Error loading patient details', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading patient clinical file...
      </div>
    );
  }

  if (!patient) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/patients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Patients Directory</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Patient Medical Profile & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Comprehensive medical dossier, verified appointments, lab reports, and vitals.
          </p>
        </div>

        <Link
          to="/admin/patients"
          className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
        >
          ← All Patients
        </Link>
      </div>

      {/* Patient Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-purple-600/25 shrink-0">
            {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                Patient #{patient._id.slice(-6)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {patient.phone || 'No phone'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {patient.email}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Blood Group</span>
            <span className="text-sm font-black text-rose-600">{patient.bloodGroup || 'Not set'}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Gender</span>
            <span className="text-sm font-bold text-slate-800">{patient.gender || 'N/A'}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Visits</span>
            <span className="text-sm font-black text-purple-700">{appointments.length}</span>
          </div>
        </div>
      </div>

      {/* Grid: Details & Medical Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Personal & Address Details */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Personal Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Date of Birth</span>
                <span className="font-bold text-slate-800">
                  {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'Not provided'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Registered On</span>
                <span className="font-bold text-slate-800">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Account Status</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  Active Clinical Profile
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Residential Address
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>{patient.address?.fullAddress || 'No full address specified'}</span>
            </p>
            {patient.address?.city && (
              <div className="text-xs text-slate-500">
                City: <span className="font-semibold text-slate-700">{patient.address.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Medical Alerts, Allergies, Appointments & Reports */}
        <div className="md:col-span-2 space-y-6">
          {/* Medical Alerts & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Known Drug / Food Allergies</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {Array.isArray(patient.allergies) && patient.allergies.length > 0
                  ? patient.allergies.join(', ')
                  : 'No known allergies reported.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/90 text-blue-900 shadow-xs">
              <div className="flex items-center gap-1.5 font-bold text-xs mb-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Chronic Illness & History</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                {Array.isArray(patient.medicalHistory) && patient.medicalHistory.length > 0
                  ? patient.medicalHistory.join(', ')
                  : 'No chronic illness or prior surgical interventions on record.'}
              </p>
            </div>
          </div>

          {/* Appointments Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Consultation Appointments History</h3>
                <p className="text-xs text-slate-400">All OPD tokens, consultations, and statuses for this patient</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {appointments.length} Total Consultations
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No past consultations recorded for this patient.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {appt.doctorId?.name || 'Assigned Physician'}
                        </span>
                        <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                          {appt.doctorId?.specialization || 'Consultant'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {appt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {appt.slotTime} (Token #{appt.tokenNumber})
                        </span>
                      </div>
                      {appt.symptoms && (
                        <div className="text-[11px] text-slate-600 mt-1 italic">
                          "{appt.symptoms}"
                        </div>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                        appt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Medical Reports Ledger */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Diagnostic & Lab Reports</h3>
                <p className="text-xs text-slate-400">Pathology tests, radiology scans, and laboratory certificates</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {reports.length} Reports
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                No diagnostic reports uploaded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((rep) => (
                  <div
                    key={rep._id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                        <FileCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{rep.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {rep.category} • Uploaded on {new Date(rep.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg">
                      Attached
                    </span>
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

export default AdminPatientDetailPage;

