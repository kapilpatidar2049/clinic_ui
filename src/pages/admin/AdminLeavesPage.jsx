import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';

const AdminLeavesPage = () => {
  const { showToast } = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await API.get('/leaves');
      setLeaves(res.data.leaves || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load leaves', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Doctor & Staff Leave Approvals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review leave applications. Approving doctor leave automatically blocks OPD slots and notifies affected patients.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading leave requests...
        </div>
      ) : leaves.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Coffee className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Leave Applications</h3>
          <p className="text-xs text-slate-500">No pending or previous leaves submitted.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaves.map((l) => (
            <div
              key={l._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 text-sm">{l.userId?.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      l.userRole === 'Doctor' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {l.userRole}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      l.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : l.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {l.status}
                  </span>
                </div>

                <p className="text-slate-600">
                  <strong>{l.leaveType}</strong> ({l.totalDays} days): {l.startDate} to {l.endDate}
                </p>
                <p className="text-slate-500 italic">Reason: "{l.reason}"</p>

                {l.adminRemarks && (
                  <p className="text-purple-700 font-semibold pt-1">Admin Remarks: {l.adminRemarks}</p>
                )}
              </div>

              <div className="self-end md:self-center">
                <Link
                  to={`/admin/leaves/${l._id}`}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition ${
                    l.status === 'Pending'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{l.status === 'Pending' ? 'Approve / Reject' : 'View Decision'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLeavesPage;
