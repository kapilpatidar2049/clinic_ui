import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Activity,
  Heart,
  Clock,
  FileText,
  UserCheck,
  X,
  Filter,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminPatientsPage = () => {
  const { showToast } = useToast();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [bloodFilter, setBloodFilter] = useState('');

  // Patient detail & appointment modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      setPatients(res.data.patients || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPatientDetail = async (patient) => {
    setSelectedPatient(patient);
    setLoadingAppts(true);
    try {
      const res = await API.get(`/appointments?patientId=${patient._id}`);
      setPatientAppointments(res.data.appointments || []);
    } catch (err) {
      console.warn('Could not load patient appointments', err);
      setPatientAppointments([]);
    } finally {
      setLoadingAppts(false);
    }
  };

  // Filtered patients
  const filteredPatients = patients.filter((p) => {
    if (genderFilter && p.gender !== genderFilter) return false;
    if (bloodFilter && p.bloodGroup !== bloodFilter) return false;
    return true;
  });

  // Calculate Metrics
  const totalCount = patients.length;
  const maleCount = patients.filter((p) => p.gender === 'Male').length;
  const femaleCount = patients.filter((p) => p.gender === 'Female').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Patients Master Directory
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized registry of all registered clinic patients, clinical vitals, medical histories, and consultation tokens.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Patients</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400">Registered clinical records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Male Patients</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{maleCount}</p>
          <span className="text-[11px] text-slate-400">Total registered males</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Female Patients</span>
            <Heart className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{femaleCount}</p>
          <span className="text-[11px] text-slate-400">Total registered females</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Portal Status</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">Active</p>
          <span className="text-[11px] text-slate-400">Self & Reception Bookings</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Gender Filter */}
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          {/* Blood Group Filter */}
          <select
            value={bloodFilter}
            onChange={(e) => setBloodFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          {(genderFilter || bloodFilter) && (
            <button
              onClick={() => {
                setGenderFilter('');
                setBloodFilter('');
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Patients Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading patients directory...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No patients found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {search || genderFilter || bloodFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'No registered patients in the database yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Patient Name</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Gender & Age</th>
                  <th className="py-3.5 px-4">Blood Group</th>
                  <th className="py-3.5 px-4">City / Address</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {patient.name ? patient.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{patient.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: #{patient._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{patient.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{patient.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            patient.gender === 'Female'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {patient.gender || 'Not specified'}
                        </span>
                        {patient.dob && (
                          <div className="text-[11px] text-slate-400">
                            DOB: {new Date(patient.dob).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {patient.bloodGroup ? (
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          {patient.bloodGroup}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unknown</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-600 max-w-[160px] truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{patient.address?.city || patient.address?.fullAddress || 'India'}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-500 text-xs">
                      {new Date(patient.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Link
                        to={`/admin/patients/${patient._id}`}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs border border-purple-200 transition inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>View Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Profile & Appointments Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                  {selectedPatient.name ? selectedPatient.name.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                    <span>{selectedPatient.email}</span>
                    <span>•</span>
                    <span>{selectedPatient.phone || 'No phone'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clinical Vitals & Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 font-medium block">Gender</span>
                <span className="font-bold text-slate-800">{selectedPatient.gender || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Blood Group</span>
                <span className="font-bold text-rose-700">{selectedPatient.bloodGroup || 'Not set'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Date of Birth</span>
                <span className="font-bold text-slate-800">
                  {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Registered</span>
                <span className="font-bold text-slate-800">
                  {new Date(selectedPatient.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Medical History & Allergies */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Medical Alerts & History
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Known Drug / Food Allergies</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {Array.isArray(selectedPatient.allergies) && selectedPatient.allergies.length > 0
                      ? selectedPatient.allergies.join(', ')
                      : 'No known allergies on record.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-900">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Chronic Conditions / Notes</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    {Array.isArray(selectedPatient.medicalHistory) && selectedPatient.medicalHistory.length > 0
                      ? selectedPatient.medicalHistory.join(', ')
                      : 'No chronic illness or past major surgeries noted.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Full Residential Address */}
            <div className="space-y-1.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Residential Address
              </h4>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <span>{selectedPatient.address?.fullAddress || 'No full address specified'}</span>
              </p>
            </div>

            {/* Consultation Appointments History */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Consultation Appointments History
                </h4>
                <span className="text-xs text-purple-700 font-semibold">
                  {patientAppointments.length} total
                </span>
              </div>

              {loadingAppts ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading appointments...</div>
              ) : patientAppointments.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
                  No appointments booked by this patient yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {patientAppointments.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {appt.doctorId?.name || 'Assigned Doctor'} ({appt.doctorId?.specialization || 'Consultant'})
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {appt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appt.slotTime} (Token #{appt.tokenNumber})
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
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

            {/* Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPatientsPage;

