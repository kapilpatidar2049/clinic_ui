import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { DollarSign, FileText, Calendar, Printer, Plus, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';

const StaffSalary = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const [salaries, setSalaries] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Leave Application State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [salRes, leaveRes] = await Promise.all([
        API.get('/salary/my'),
        API.get('/leaves/my'),
      ]);
      setSalaries(salRes.data.salaries || []);
      setLeaves(leaveRes.data.leaves || []);
    } catch (err) {
      console.error('Failed to load salary & leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    setSubmittingLeave(true);
    setMessage('');
    setError('');

    try {
      await API.post('/leaves', {
        leaveType,
        startDate,
        endDate,
        reason,
      });
      setMessage('Leave request submitted to administration for approval.');
      setReason('');
      setStartDate('');
      setEndDate('');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request.');
    } finally {
      setSubmittingLeave(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Payroll & Leaves</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access monthly salary payslips, check payment history, and apply for staff leaves
          </p>
        </div>

        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'salary' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Salary Slips ({salaries.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'leaves' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Leave Requests ({leaves.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {message}
          </span>
          <button onClick={() => setMessage('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {activeTab === 'salary' ? (
        /* Salary Statements Tab */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="text-center py-20 text-xs text-slate-400">Loading salary statements...</div>
          ) : salaries.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No salary statements generated yet for your account.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Pay Period (Month/Year)</th>
                  <th className="p-4">Base Salary</th>
                  <th className="p-4">Deductions</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaries.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-bold text-slate-900">
                      {s.month} {s.year}
                    </td>
                    <td className="p-4">₹{s.basicSalary?.toLocaleString()}</td>
                    <td className="p-4 text-rose-600 font-medium">-₹{s.deductions?.toLocaleString() || 0}</td>
                    <td className="p-4 font-bold text-emerald-800 text-sm">
                      ₹{s.netSalary?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {s.paymentStatus || 'Paid'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedSlip(s)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Leave Requests Tab */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Apply Form */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Apply for Leave</h3>
            <p className="text-xs text-slate-500 mb-4">Request approval from administration</p>

            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Casual Leave">Casual Leave (CL)</option>
                  <option value="Sick Leave">Sick Leave (SL)</option>
                  <option value="Paid Leave">Paid Annual Leave (PL)</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Specify brief reason for leave application..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingLeave}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                {submittingLeave ? 'Submitting...' : 'Submit Leave Application'}
              </button>
            </form>
          </div>

          {/* Leave History List */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-1">My Leave History</h3>
            <p className="text-xs text-slate-500 mb-4">Past applications and approval status</p>

            {leaves.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">No leave requests recorded.</div>
            ) : (
              <div className="space-y-3">
                {leaves.map((l) => (
                  <div key={l._id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{l.leaveType}</span>
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
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      {l.startDate} to {l.endDate} ({l.daysCount || 1} day(s))
                    </p>
                    <p className="text-slate-700 mt-1 italic">"{l.reason}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable Payslip Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="text-xs font-semibold">Staff Monthly Payslip</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Payslip
                </button>
                <button onClick={() => setSelectedSlip(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div id="printable-area" className="p-8 text-xs text-slate-800 bg-white">
              <div className="border-b-2 border-emerald-700 pb-4 mb-4 text-center">
                <h2 className="text-base font-black text-slate-900">MY CLINIC HEALTHCARE & WELLNESS</h2>
                <p className="text-[11px] text-slate-500">Employee Monthly Salary Statement</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee</span>
                  <span className="font-bold text-slate-900">{selectedSlip.staffId?.userId?.name || 'Staff Member'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Pay Period</span>
                  <span className="font-bold text-slate-900">{selectedSlip.month} {selectedSlip.year}</span>
                </div>
              </div>

              <div className="space-y-2 border-b border-slate-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Basic Salary:</span>
                  <span className="font-semibold">₹{selectedSlip.basicSalary?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Allowances / Bonus:</span>
                  <span className="font-semibold text-emerald-700">+₹{selectedSlip.bonus?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Deductions (Leaves/TDS):</span>
                  <span className="font-semibold text-rose-600">-₹{selectedSlip.deductions?.toLocaleString() || 0}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm font-black text-slate-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <span>Net Disbursed Salary:</span>
                <span>₹{selectedSlip.netSalary?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSalary;

