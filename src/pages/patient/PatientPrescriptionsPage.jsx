import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  FileText,
  Printer,
  Calendar,
  User,
  Heart,
  Activity,
  Download,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  Stethoscope,
  Pill,
} from 'lucide-react';

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileModal, setShowMobileModal] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const res = await API.get('/prescriptions');
      const list = res.data.prescriptions || [];
      setPrescriptions(list);
      if (list.length > 0) setSelectedRx(list[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectMobile = (rx) => {
    setSelectedRx(rx);
    setShowMobileModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="no-print flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Digital Prescriptions</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {prescriptions.length}
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Verified physician regimens, dosages & instructions
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Loading digital prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800">No Prescriptions Available</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Once you complete an OPD consultation with a clinic doctor, your digital prescription will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Prescriptions (Mobile Cards & Desktop Left Sidebar) */}
          <div className="lg:col-span-4 space-y-3 no-print">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Prescription History
            </h3>

            <div className="space-y-2.5">
              {prescriptions.map((rx) => {
                const isSelected = selectedRx?._id === rx._id;
                return (
                  <div
                    key={rx._id}
                    onClick={() => {
                      setSelectedRx(rx);
                      if (window.innerWidth < 1024) {
                        setShowMobileModal(true);
                      }
                    }}
                    className={`p-4 rounded-3xl border transition-all duration-150 cursor-pointer active:scale-95 shadow-xs ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {rx.prescriptionId}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {new Date(rx.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 mt-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        ℞
                      </div>
                      <div className="leading-tight truncate">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">
                          Dr. {rx.doctorId?.userId?.name || 'Clinic Consultant'}
                        </h4>
                        <p className="text-xs font-bold text-emerald-700 truncate mt-0.5">
                          {rx.diagnosis || 'Clinical Diagnosis'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 text-[11px]">
                        <Pill className="w-3.5 h-3.5 text-emerald-600" />
                        <strong>{rx.medicines?.length || 0}</strong> medications
                      </span>
                      <span className="lg:hidden text-[11px] font-bold text-emerald-700 flex items-center gap-0.5">
                        <span>View Rx</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Column: Branded Letterhead Prescription View */}
          <div className="hidden lg:block lg:col-span-8">
            {selectedRx && (
              <div className="space-y-4">
                <div className="flex justify-end gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>

                {/* Printable Letterhead Paper */}
                <PrescriptionPaper selectedRx={selectedRx} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Prescription Details Modal / Bottom Sheet */}
      {showMobileModal && selectedRx && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setShowMobileModal(false)}
          />

          <div className="relative z-10 bg-white rounded-t-3xl shadow-2xl p-4 sm:p-6 space-y-4 max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 safe-bottom">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto -mt-1" />

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-serif font-black">
                  ℞
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Official Prescription</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedRx.prescriptionId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowMobileModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <PrescriptionPaper selectedRx={selectedRx} />
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Printable / Viewable Letterhead Component
const PrescriptionPaper = ({ selectedRx }) => {
  return (
    <div
      id="printable-area"
      className="bg-white rounded-3xl border border-slate-300/80 p-5 sm:p-8 shadow-sm space-y-5 text-slate-800"
    >
      {/* Clinic Header / Letterhead */}
      <div className="border-b-2 border-emerald-600 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {selectedRx.letterheadSnapshot?.clinicName || 'MY CLINIC HEALTHCARE'}
            </h2>
          </div>
          <p className="text-xs font-bold text-emerald-700 mt-0.5">
            {selectedRx.letterheadSnapshot?.headerText || 'Specialty Healthcare Outpatient Department'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {selectedRx.letterheadSnapshot?.clinicAddress || 'Healthcare Enclave, New Delhi'} • Ph:{' '}
            {selectedRx.letterheadSnapshot?.clinicContact || '+91 98765 43210'}
          </p>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto">
          <p className="text-sm font-extrabold text-slate-900">
            Dr. {selectedRx.letterheadSnapshot?.doctorName || selectedRx.doctorId?.userId?.name}
          </p>
          <p className="text-xs text-emerald-700 font-bold">
            {selectedRx.letterheadSnapshot?.specialization || selectedRx.doctorId?.specialization}
          </p>
          <p className="text-[11px] text-slate-500">
            {selectedRx.letterheadSnapshot?.qualifications || 'MBBS, MD'}
          </p>
          <p className="text-[10px] text-slate-400 font-mono">
            Reg: {selectedRx.letterheadSnapshot?.regNo || 'MCI-DEL-28491'}
          </p>
        </div>
      </div>

      {/* Patient Info Bar */}
      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div>
          <span className="text-slate-400 text-[10px] font-semibold block">Patient Name</span>
          <p className="font-extrabold text-slate-900">{selectedRx.patientId?.name || 'Patient'}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] font-semibold block">Gender / Age</span>
          <p className="font-bold text-slate-900">{selectedRx.patientId?.gender || 'Adult'}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] font-semibold block">Prescription ID</span>
          <p className="font-bold font-mono text-slate-900">{selectedRx.prescriptionId}</p>
        </div>
        <div>
          <span className="text-slate-400 text-[10px] font-semibold block">Date</span>
          <p className="font-bold text-slate-900">{new Date(selectedRx.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Vitals */}
      {selectedRx.vitals && (
        <div className="flex flex-wrap gap-3 text-xs bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100">
          <span><strong>BP:</strong> {selectedRx.vitals.bloodPressure || '120/80'}</span>
          <span><strong>Pulse:</strong> {selectedRx.vitals.pulseRate || '72 bpm'}</span>
          <span><strong>Temp:</strong> {selectedRx.vitals.temperature || '98.6 °F'}</span>
          <span><strong>Weight:</strong> {selectedRx.vitals.weight || '68 kg'}</span>
          <span><strong>SpO2:</strong> {selectedRx.vitals.spo2 || '99%'}</span>
        </div>
      )}

      {/* Diagnosis */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Diagnosis</h4>
        <p className="text-xs sm:text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          {selectedRx.diagnosis}
        </p>
        {selectedRx.clinicalNotes && (
          <p className="text-xs text-slate-600 mt-1 italic">Clinical Notes: {selectedRx.clinicalNotes}</p>
        )}
      </div>

      {/* Rx Symbol & Medication Table */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif font-black text-emerald-800">℞</span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Prescribed Medications
          </h4>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[500px]">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">#</th>
                <th className="p-2.5">Medicine Name</th>
                <th className="p-2.5">Dosage</th>
                <th className="p-2.5">Frequency</th>
                <th className="p-2.5">Duration</th>
                <th className="p-2.5">Instructions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedRx.medicines?.map((med, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                  <td className="p-2.5 text-slate-700">{med.dosage}</td>
                  <td className="p-2.5 font-bold text-emerald-700">{med.frequency}</td>
                  <td className="p-2.5 text-slate-700">{med.duration}</td>
                  <td className="p-2.5 text-slate-600">{med.instructions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice & Follow Up */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="font-bold text-slate-700 block mb-1">Dietary & Lifestyle Advice:</span>
          <p className="text-slate-600">{selectedRx.dietaryAdvice || 'Maintain adequate hydration and rest.'}</p>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="font-bold text-slate-700 block mb-1">Lab Investigations:</span>
          <p className="text-slate-600">
            {selectedRx.testsRecommended?.join(', ') || 'No special lab tests required.'}
          </p>
          {selectedRx.followUpDate && (
            <p className="text-emerald-700 font-bold mt-1.5">
              Follow-up Review: {selectedRx.followUpDate}
            </p>
          )}
        </div>
      </div>

      {/* Doctor Signature & Letterhead Footer */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-4">
        <div className="text-[10px] text-slate-400 max-w-sm">
          <p>{selectedRx.letterheadSnapshot?.footerText || 'Valid for 30 days from date of issue.'}</p>
        </div>

        <div className="text-right">
          <div className="font-serif italic text-emerald-700 text-sm font-bold">
            Dr. {selectedRx.letterheadSnapshot?.doctorName || selectedRx.doctorId?.userId?.name}
          </div>
          <div className="w-32 border-b border-slate-400 my-1 ml-auto"></div>
          <p className="text-[10px] font-semibold text-slate-600">Authorized Physician Signature</p>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionsPage;