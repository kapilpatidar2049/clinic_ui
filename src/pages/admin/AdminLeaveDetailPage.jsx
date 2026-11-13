import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Coffee,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertCircle,
  Calendar,
  ArrowLeft,
  ShieldAlert,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export const AdminLeaveDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionStatus, setActionStatus] = useState('Approved');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLeave();
  }, [id]);

  const fetchLeave = async () => {
    setLoading(true);
    try {
      const res = await API.get('/leaves');
      const found = (res.data.leaves || []).find((l) => l._id === id);
      if (!found) {
        showToast('Leave application not found.', 'error');
        navigate('/admin/leaves');
        return;
      }
      setLeave(found);
      if (found.adminRemarks) {
        setAdminRemarks(found.adminRemarks);
      }
      if (found.status !== 'Pending') {
        setActionStatus(found.status);
      }
    } catch (err) {
      showToast('Error loading leave details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await API.put(`/leaves/${id}/review`, {
        status: actionStatus,
        adminRemarks,
      });

      showToast(res.data.message || `Leave ${actionStatus} successfully!`, 'success');
      navigate('/admin/leaves');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to review leave application.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading leave application file...
      </div>
    );
  }

  if (!leave) return null;

  const isPending = leave.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          to="/admin/leaves"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Leave Requests</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Review Leave Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify applicant schedule impact, approve or reject leave, and assign reliever cover.
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
              leave.status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : leave.status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Current Status: {leave.status}
          </span>
        </div>
      </div>

      {/* Main Leave Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        {/* Applicant Profile */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
            {leave.userId?.name ? leave.userId.name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{leave.userId?.name}</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  leave.userRole === 'Doctor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}
              >
                {leave.userRole}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{leave.userId?.email || 'Clinic Staff Member'}</p>
          </div>
        </div>

        {/* Leave Specifics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-1">Leave Type</span>
            <span className="text-sm font-bold text-slate-900">{leave.leaveType}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-1">Duration & Days</span>
            <span className="text-sm font-bold text-slate-900">{leave.totalDays} Day(s)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-semibold block mb-1">Date Range</span>
            <span className="text-sm font-bold text-slate-900">
              {leave.startDate} to {leave.endDate}
            </span>
          </div>
        </div>

        {/* Reason Box */}
        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Applicant Stated Reason:</span>
          <p className="text-xs sm:text-sm text-slate-800 font-medium italic">"{leave.reason}"</p>
        </div>

        {/* Operational Notice for Doctors */}
        {leave.userRole === 'Doctor' && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong className="font-bold">Clinic OPD Roster Impact:</strong> Approving this leave will automatically
              block all OPD consultation slots for Dr. {leave.userId?.name} during {leave.startDate} to {leave.endDate}.
              Patients with booked appointments will receive schedule notifications.
            </div>
          </div>
        )}

        {/* Admin Review Form */}
        <form onSubmit={handleReview} className="space-y-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Decision Action
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setActionStatus('Approved')}
                className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 ${
                  actionStatus === 'Approved'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                    : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Leave</span>
              </button>

              <button
                type="button"
                onClick={() => setActionStatus('Rejected')}
                className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 ${
                  actionStatus === 'Rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-600/20'
                    : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject Leave</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Admin Remarks & Roster Instructions
            </label>
            <textarea
              rows="3"
              value={adminRemarks}
              onChange={(e) => setAdminRemarks(e.target.value)}
              placeholder="e.g. Approved. Relieving doctor Dr. Sharma will cover emergency calls during this period."
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 px-6 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md transition ${
                actionStatus === 'Approved'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {submitting ? 'Submitting Review...' : `Confirm ${actionStatus}`}
            </button>
            <Link
              to="/admin/leaves"
              className="py-3 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLeaveDetailPage;

