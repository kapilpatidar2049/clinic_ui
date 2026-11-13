import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Activity,
  Heart,
  Calendar,
  User,
  Printer,
  ChevronLeft,
} from 'lucide-react';

const WritePrescriptionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryPatientId = searchParams.get('patientId') || '';
  const queryAppointmentId = searchParams.get('appointmentId') || '';
  const queryPatientName = searchParams.get('patientName') || '';

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(queryPatientId);
  const [appointmentId, setAppointmentId] = useState(queryAppointmentId);

  // Vitals
  const [vitals, setVitals] = useState({
    bloodPressure: '120/80 mmHg',
    pulseRate: '74 bpm',
    temperature: '98.4 °F',
    weight: '70 kg',
    spo2: '99%',
  });

  // Clinical Details
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [dietaryAdvice, setDietaryAdvice] = useState('Maintain good hydration, light nutritious meals.');
  const [testsRecommended, setTestsRecommended] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  // Medicines Table
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '500 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
  ]);

  const [loading, setLoading] = useState(false);
  const [successRx, setSuccessRx] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get('/admin/patients').catch(() => ({ data: { patients: [] } }));
      setPatients(res.data.patients || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '500 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError('Please select or specify a patient.');
      return;
    }
    if (!diagnosis) {
      setError('Diagnosis is required.');
      return;
    }

    const validMeds = medicines.filter((m) => m.name.trim() !== '');
    if (validMeds.length === 0) {
      setError('Please enter at least one medication name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await API.post('/prescriptions', {
        patientId: selectedPatientId,
        appointmentId: appointmentId || null,
        vitals,
        diagnosis,
        clinicalNotes,
        medicines: validMeds,
        testsRecommended: testsRecommended ? testsRecommended.split(',').map((t) => t.trim()) : [],
        dietaryAdvice,
        followUpDate,
      });

      setSuccessRx(res.data.prescription);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Generate Digital Prescription</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Doctor consultation writer with custom clinic letterhead formatting.
          </p>
        </div>
        <button
          onClick={() => navigate('/doctor')}
          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Doctor Queue
        </button>
      </div>

      {successRx ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Digital Prescription Issued!</h2>
          <p className="text-xs text-slate-500">
            Prescription ID <span className="font-mono font-bold text-slate-800">{successRx.prescriptionId}</span> has been
            saved and added to patient medical records.
          </p>

          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => navigate('/patient/prescriptions')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Preview & Print Letterhead
            </button>
            <button
              onClick={() => {
                setSuccessRx(null);
                setDiagnosis('');
                setMedicines([{ name: '', dosage: '500 mg', frequency: '1-0-1', duration: '5 Days', instructions: 'After Food' }]);
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
            >
              Write Another Prescription
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Patient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient *</label>
              {queryPatientName ? (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900">
                  {queryPatientName} (Pre-selected from OPD queue)
                </div>
              ) : (
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Registered Patient --</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.phone})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Vitals Entry */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Patient Vitals</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Blood Pressure</span>
                <input
                  type="text"
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                  placeholder="120/80"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Pulse Rate</span>
                <input
                  type="text"
                  value={vitals.pulseRate}
                  onChange={(e) => setVitals({ ...vitals, pulseRate: e.target.value })}
                  placeholder="72 bpm"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Body Temp</span>
                <input
                  type="text"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                  placeholder="98.6 F"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Weight (Kg)</span>
                <input
                  type="text"
                  value={vitals.weight}
                  onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                  placeholder="68 kg"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Oxygen SpO2</span>
                <input
                  type="text"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  placeholder="99%"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Clinical Diagnosis & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Doctor's Consultation Remarks</label>
              <input
                type="text"
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="e.g. Chest clear, throat congested"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Medication Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-serif font-black text-emerald-800">℞</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Prescription Medicines</span>
              </div>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add Medicine
              </button>
            </div>

            <div className="space-y-2">
              {medicines.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 items-center text-xs"
                >
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      required
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      placeholder="Medicine Name (e.g. Tab Paracetamol)"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      placeholder="Dosage (500mg)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      placeholder="Freq (1-0-1)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      placeholder="Duration (5 Days)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      placeholder="Instructions"
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  <div className="sm:col-span-1 text-center">
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(index)}
                        className="p-1.5 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advice & Tests */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Recommended Lab Investigations</label>
              <input
                type="text"
                value={testsRecommended}
                onChange={(e) => setTestsRecommended(e.target.value)}
                placeholder="e.g. CBC, Serum Creatinine, Chest X-Ray (comma-separated)"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Dietary & Lifestyle Advice</label>
              <input
                type="text"
                value={dietaryAdvice}
                onChange={(e) => setDietaryAdvice(e.target.value)}
                placeholder="e.g. Low salt diet, avoid strenuous exercise for 3 days"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              {loading ? 'Finalizing Prescription...' : 'Save & Publish Digital Prescription'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default WritePrescriptionPage;
