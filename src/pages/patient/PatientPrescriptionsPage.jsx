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
} from 'lucide-react';

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedRx, setSelectedRx] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="no-print">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Digital Prescriptions</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Access verified medical prescriptions issued by clinic doctors with complete dosage regimens.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Prescriptions Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you complete a consultation with a clinic doctor, your digital prescription will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: List of Prescriptions */}
          <div className="lg:col-span-4 space-y-3 no-print">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prescription History</h3>
            {prescriptions.map((rx) => (
              <div
                key={rx._id}
                onClick={() => setSelectedRx(rx)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedRx?._id === rx._id
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700">{rx.prescriptionId}</span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  Dr. {rx.doctorId?.userId?.name || 'Doctor'}
                </h4>
                <p className="text-xs text-emerald-600 font-semibold">{rx.diagnosis}</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {rx.medicines?.length || 0} prescribed medications
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Branded Letterhead Prescription View */}
          <div className="lg:col-span-8">
            {selectedRx && (
              <div className="space-y-4">
                <div className="flex justify-end gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Download PDF Letterhead
                  </button>
                </div>

                {/* Printable Letterhead Paper */}
                <div
                  id="printable-area"
                  className="bg-white rounded-3xl border border-slate-300 p-8 sm:p-10 shadow-lg space-y-6 text-slate-800"
                >
                  {/* Clinic Header / Letterhead */}
                  <div className="border-b-2 border-emerald-600 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-6 h-6 text-emerald-600" />
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">
                          {selectedRx.letterheadSnapshot?.clinicName || 'MY CLINIC HEALTHCARE'}
                        </h2>
                      </div>
                      <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                        {selectedRx.letterheadSnapshot?.headerText || 'Outpatient Department & Specialty Clinic'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {selectedRx.letterheadSnapshot?.clinicAddress || 'Healthcare Enclave, New Delhi'} • Ph:{' '}
                        {selectedRx.letterheadSnapshot?.clinicContact || '+91 98765 43210'}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-sm font-bold text-slate-900">{selectedRx.letterheadSnapshot?.doctorName}</p>
                      <p className="text-xs text-slate-600 font-semibold">
                        {selectedRx.letterheadSnapshot?.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500">{selectedRx.letterheadSnapshot?.qualifications}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Reg: {selectedRx.letterheadSnapshot?.regNo || 'MCI-REG'}
                      </p>
                    </div>
                  </div>

                  {/* Patient Info Bar */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Patient Name:</span>
                      <p className="font-bold text-slate-900">{selectedRx.patientId?.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Gender / Age:</span>
                      <p className="font-bold text-slate-900">
                        {selectedRx.patientId?.gender || 'Adult'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Prescription ID:</span>
                      <p className="font-bold font-mono text-slate-900">{selectedRx.prescriptionId}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Date:</span>
                      <p className="font-bold text-slate-900">{new Date(selectedRx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Vitals */}
                  {selectedRx.vitals && (
                    <div className="flex flex-wrap gap-4 text-xs bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      <span><strong>BP:</strong> {selectedRx.vitals.bloodPressure || '120/80'}</span>
                      <span><strong>Pulse:</strong> {selectedRx.vitals.pulseRate || '72 bpm'}</span>
                      <span><strong>Temp:</strong> {selectedRx.vitals.temperature || '98.6 °F'}</span>
                      <span><strong>Weight:</strong> {selectedRx.vitals.weight || '68 kg'}</span>
                      <span><strong>SpO2:</strong> {selectedRx.vitals.spo2 || '99%'}</span>
                    </div>
                  )}

                  {/* Diagnosis */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Diagnosis</h4>
                    <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      {selectedRx.diagnosis}
                    </p>
                    {selectedRx.clinicalNotes && (
                      <p className="text-xs text-slate-600 mt-1 italic">Notes: {selectedRx.clinicalNotes}</p>
                    )}
                  </div>

                  {/* Rx Symbol & Medication Table */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-serif font-black text-emerald-800">℞</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Prescribed Medication
                      </h4>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">Medicine Name</th>
                            <th className="p-3">Dosage</th>
                            <th className="p-3">Frequency</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3">Instructions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedRx.medicines?.map((med, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                              <td className="p-3 font-bold text-slate-900">{med.name}</td>
                              <td className="p-3 text-slate-700">{med.dosage}</td>
                              <td className="p-3 font-semibold text-emerald-700">{med.frequency}</td>
                              <td className="p-3 text-slate-700">{med.duration}</td>
                              <td className="p-3 text-slate-600">{med.instructions}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Advice & Follow Up */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-700 block mb-1">General Dietary Advice:</span>
                      <p className="text-slate-600">{selectedRx.dietaryAdvice}</p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                      <span className="font-bold text-slate-700 block mb-1">Recommended Investigations:</span>
                      <p className="text-slate-600">
                        {selectedRx.testsRecommended?.join(', ') || 'No special lab tests required.'}
                      </p>
                      {selectedRx.followUpDate && (
                        <p className="text-emerald-700 font-bold mt-2">
                          Next Follow-up Date: {selectedRx.followUpDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Doctor Signature & Letterhead Footer */}
                  <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-end gap-6">
                    <div className="text-[11px] text-slate-400 max-w-sm">
                      <p>{selectedRx.letterheadSnapshot?.footerText}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-serif italic text-emerald-700 text-sm font-bold">
                        Dr. {selectedRx.letterheadSnapshot?.doctorName}
                      </div>
                      <div className="w-36 border-b border-slate-400 my-1 ml-auto"></div>
                      <p className="text-[11px] font-semibold text-slate-600">Authorized Physician Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptionsPage;
