import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../services/api';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  Eye,
  X,
} from 'lucide-react';

const DoctorPrescriptions = () => {
  const [searchParams] = useSearchParams();
  const appointmentIdParam = searchParams.get('appointmentId');
  const patientIdParam = searchParams.get('patientId');

  const [activeTab, setActiveTab] = useState(appointmentIdParam ? 'create' : 'list');
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);

  // Form State
  const [selectedAppId, setSelectedAppId] = useState(appointmentIdParam || '');
  const [patientId, setPatientId] = useState(patientIdParam || '');
  const [vitals, setVitals] = useState({
    bp: '120/80',
    pulse: '76',
    spo2: '98',
    temp: '98.4',
    weight: '65',
  });
  const [diagnosis, setDiagnosis] = useState('');
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [medicines, setMedicines] = useState([
    { medicineName: 'Paracetamol 650mg', frequency: '1-0-1 (Twice daily)', duration: '3 Days', instructions: 'After food' },
  ]);
  const [labTests, setLabTests] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, rxRes] = await Promise.all([
        API.get('/appointments'),
        API.get('/prescriptions'),
      ]);
      setAppointments(appRes.data.appointments || []);
      setPrescriptions(rxRes.data.prescriptions || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { medicineName: '', frequency: '1-0-1', duration: '5 Days', instructions: 'After meals' },
    ]);
  };

  const removeMedicineRow = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis) {
      setError('Diagnosis is required.');
      return;
    }
    if (medicines.some((m) => !m.medicineName.trim())) {
      setError('Please provide names for all prescribed medicines.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        appointmentId: selectedAppId || undefined,
        patientId: patientId || undefined,
        vitals,
        diagnosis,
        chiefComplaints,
        medicines,
        labTestsRecommended: labTests
          ? labTests.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        generalAdvice: advice,
        followUpDate: followUpDate || undefined,
      };

      const res = await API.post('/prescriptions', payload);
      setSuccess('Digital prescription issued and recorded successfully!');
      setDiagnosis('');
      setChiefComplaints('');
      setLabTests('');
      setAdvice('');
      fetchData();
      setActiveTab('list');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue prescription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Prescriptions Management</h1>
          <p className="text-xs text-slate-500 mt-1">Issue digital prescriptions with customizable letterhead, dosage, and tests</p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'create' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Rx
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'list' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prescriptions History ({prescriptions.length})
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {activeTab === 'create' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Issue Digital Prescription</h2>
          <p className="text-xs text-slate-500 mb-6">Will generate unique Rx ID and stamp on clinic letterhead</p>

          {error && (
            <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Select Appointment / Patient */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient / Appointment</label>
              <select
                value={selectedAppId}
                onChange={(e) => {
                  const appId = e.target.value;
                  setSelectedAppId(appId);
                  const matched = appointments.find((a) => a._id === appId);
                  if (matched) setPatientId(matched.patientId?._id);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Select from today's appointments or walk-ins --</option>
                {appointments.map((app) => (
                  <option key={app._id} value={app._id}>
                    Token #{app.tokenNumber} - {app.patientId?.name || 'Walk-in'} ({app.slotTime}, {app.appointmentDate})
                  </option>
                ))}
              </select>
            </div>

            {/* Vitals Strip */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" /> Patient Recorded Vitals
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Blood Pressure</span>
                  <input
                    type="text"
                    value={vitals.bp}
                    onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                    placeholder="120/80"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Pulse (bpm)</span>
                  <input
                    type="text"
                    value={vitals.pulse}
                    onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                    placeholder="74"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">SpO2 (%)</span>
                  <input
                    type="text"
                    value={vitals.spo2}
                    onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                    placeholder="98"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Temperature (°F)</span>
                  <input
                    type="text"
                    value={vitals.temp}
                    onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                    placeholder="98.6"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">Weight (kg)</span>
                  <input
                    type="text"
                    value={vitals.weight}
                    onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                    placeholder="65"
                    className="w-full p-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Complaints & Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chief Complaints</label>
                <textarea
                  rows={2}
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  placeholder="e.g. Fever x 3 days, throat pain, difficulty swallowing"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
                <textarea
                  required
                  rows={2}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Tonsillitis / Upper Respiratory Tract Infection"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Prescribed Medicines Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-bold text-slate-800 text-sm">Prescribed Medication (Rx)</label>
                <button
                  type="button"
                  onClick={addMedicineRow}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              <div className="space-y-2">
                {medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="col-span-12 sm:col-span-4">
                      <input
                        type="text"
                        required
                        placeholder="Medicine Name & Dosage (e.g. Amoxicillin 500mg)"
                        value={med.medicineName}
                        onChange={(e) => handleMedChange(idx, 'medicineName', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Frequency (1-0-1)"
                        value={med.frequency}
                        onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Duration (5 Days)"
                        value={med.duration}
                        onChange={(e) => handleMedChange(idx, 'duration', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-3 sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Instructions (After meals)"
                        value={med.instructions}
                        onChange={(e) => handleMedChange(idx, 'instructions', e.target.value)}
                        className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white"
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicineRow(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Tests & Lifestyle Advice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommended Lab Tests (Comma separated)</label>
                <input
                  type="text"
                  placeholder="CBC, Serum Creatinine, Chest X-Ray PA"
                  value={labTests}
                  onChange={(e) => setLabTests(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diet & Lifestyle Advice</label>
              <textarea
                rows={2}
                placeholder="e.g. Rest, hydrate with oral fluids, salt-water gargle, avoid spicy foods"
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submitting ? 'Generating Prescription...' : 'Issue Digital Prescription'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Prescriptions History Table */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {prescriptions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No prescriptions issued yet.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Rx ID & Date</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Diagnosis</th>
                  <th className="p-4">Medicines</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescriptions.map((rx) => (
                  <tr key={rx._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px] block w-max">
                        {rx.prescriptionId}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {rx.patientId?.name || rx.appointmentId?.patientId?.name || 'Patient'}
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{rx.diagnosis}</td>
                    <td className="p-4 text-slate-500">{rx.medicines?.length || 0} drugs</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedRx(rx)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Letterhead
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View Modal with Print */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-semibold">Doctor Clinical Letterhead Preview</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button onClick={() => setSelectedRx(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div id="printable-area" className="p-8 text-xs text-slate-800 bg-white">
              <div className="border-b-2 border-emerald-700 pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-black text-slate-900">MY CLINIC HEALTHCARE</h2>
                  <p className="text-[11px] text-slate-500">Plot 42, Outer Ring Road, New Delhi • Emergency: +91 98765 00100</p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-slate-900">Dr. {selectedRx.doctorId?.userId?.name || 'Physician'}</h3>
                  <p className="text-emerald-700 font-semibold">{selectedRx.doctorId?.specialization || 'Consultant'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between text-[11px] mb-4">
                <div><strong>Patient:</strong> {selectedRx.patientId?.name || 'Patient'}</div>
                <div><strong>Prescription ID:</strong> {selectedRx.prescriptionId}</div>
                <div><strong>Date:</strong> {new Date(selectedRx.createdAt).toLocaleDateString()}</div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-1">Diagnosis</h4>
                <p className="font-bold text-slate-900 text-sm">{selectedRx.diagnosis}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-slate-400 uppercase text-[10px] mb-2">Prescribed Medication (Rx)</h4>
                <table className="w-full border text-left">
                  <thead className="bg-slate-100 font-bold">
                    <tr>
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Frequency</th>
                      <th className="p-2">Duration</th>
                      <th className="p-2">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedRx.medicines?.map((m, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold">{m.medicineName}</td>
                        <td className="p-2">{m.frequency}</td>
                        <td className="p-2">{m.duration}</td>
                        <td className="p-2 italic">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedRx.generalAdvice && (
                <div className="pt-3 border-t text-[11px]">
                  <strong>Advice:</strong> {selectedRx.generalAdvice}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;

