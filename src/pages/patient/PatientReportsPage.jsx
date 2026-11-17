import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Upload,
  Calendar,
  CheckCircle2,
  Trash2,
  Download,
  FileCheck,
  AlertCircle,
} from 'lucide-react';

const PatientReportsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blood Test');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await API.get('/reports');
      setReports(res.data.reports || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title) {
      showToast('Please enter a title for the report.', 'warning');
      return;
    }

    setUploading(true);
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('notes', notes);
      if (file) {
        formData.append('file', file);
      } else {
        formData.append('fileUrl', '/uploads/demo-report.pdf');
      }

      await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setTitle('');
      setNotes('');
      setFile(null);
      showToast('Medical report saved successfully!', 'success');
      setSuccessMsg('Medical report saved successfully!');
      fetchReports();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error uploading report.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this record?')) return;
    try {
      await API.delete(`/reports/${id}`);
      showToast('Medical report deleted successfully.', 'info');
      fetchReports();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Medical Reports & Records</span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {reports.length}
          </span>
        </h1>
        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
          Store lab tests, pathology and radiology scans accessible by your doctors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Upload New Medical Record</h2>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document / Test Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CBC Blood Count, Lipid Profile, Chest X-Ray"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Report Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              >
                <option value="Blood Test">Blood Test / Pathology</option>
                <option value="X-Ray / Radiology">X-Ray / Radiology</option>
                <option value="Ultrasound">Ultrasound / Sonography</option>
                <option value="Prescription">Previous Prescription</option>
                <option value="Discharge Summary">Discharge Summary</option>
                <option value="Other">Other Medical File</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Upload File (PDF or Image)</label>
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              <p className="text-[10px] text-slate-400 mt-1">If no file is attached, demo medical PDF will be linked.</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Remarks / Notes</label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Fasting sample taken at 8am, hemoglobin level borderline"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
            >
              {uploading ? 'Attaching Record...' : 'Upload & Link to Profile'}
            </button>
          </form>
        </div>

        {/* Existing Reports List */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-slate-900">Stored Health Records ({reports.length})</h2>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading records...</div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No medical files uploaded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep._id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{rep.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {rep.category}
                        </span>
                        <span>•</span>
                        <span>Date: {rep.reportDate || new Date(rep.createdAt).toLocaleDateString()}</span>
                      </div>
                      {rep.notes && <p className="text-[11px] text-slate-600 mt-1">{rep.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => alert(`Opening ${rep.title}`)}
                      className="p-2 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-50"
                      title="Download / Preview"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rep._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientReportsPage;
