import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await API.get('/leaves');
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error('Failed to load leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id, status) => {
    setActionLoading(true);
    try {
      await API.put(`/leaves/${id}/review`, {
        status,
        reviewComments: `Processed by clinic administration as ${status}.`,
      });
      fetchLeaves();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to review leave.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Leave Approvals</h1>
        <p className="text-xs text-slate-500 mt-1">Review, approve, or reject employee leave applications and manage duty coverage</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading leave applications...</div>
        ) : leaves.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No leave requests pending or submitted.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Leave Type</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaves.map((l) => (
                  <tr key={l._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{l.userId?.name || 'Staff'}</p>
                      <p className="text-slate-400 text-[11px]">{l.userId?.role || 'Employee'}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{l.leaveType}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">
                        {l.startDate} to {l.endDate}
                      </p>
                      <p className="text-slate-400 text-[11px]">{l.daysCount || 1} day(s)</p>
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs italic">"{l.reason}"</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1.5">
                      {l.status === 'Pending' && (
                        <>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleReview(l._id, 'Approved')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-sm disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleReview(l._id, 'Rejected')}
                            className="px-2.5 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-[11px] disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLeaves;

