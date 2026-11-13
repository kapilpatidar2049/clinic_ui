import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { DollarSign, Plus, Printer, CheckCircle, AlertCircle, X, Users, Calendar } from 'lucide-react';

const AdminPayroll = () => {
  const [salaries, setSalaries] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    staffId: '',
    month: 'November',
    year: 2026,
    bonus: 0,
    deductions: 0,
    remarks: 'Regular monthly salary disbursement',
  });

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    setLoading(true);
    try {
      const [salRes, staffRes] = await Promise.all([
        API.get('/salary'),
        API.get('/admin/staff'),
      ]);
      setSalaries(salRes.data.salaries || []);
      const st = staffRes.data.staff || [];
      setStaffList(st);
      if (st.length > 0) {
        setFormData((prev) => ({ ...prev, staffId: st[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load payroll:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.staffId) {
      setError('Please select an employee.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await API.post('/salary/generate', {
        ...formData,
        year: Number(formData.year),
        bonus: Number(formData.bonus),
        deductions: Number(formData.deductions),
      });
      setSuccess('Monthly salary statement generated successfully!');
      setShowModal(false);
      fetchPayrollData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate salary statement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Payroll & Salary Statements</h1>
          <p className="text-xs text-slate-500 mt-1">Generate monthly payslips, calculate allowances and deductions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Generate Monthly Payslip
        </button>
      </div>

      {success && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Salary Statements Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading payroll history...</div>
        ) : salaries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No salary statements generated yet. Click "Generate Monthly Payslip" to disburse salaries.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Period</th>
                  <th className="p-4">Basic Pay</th>
                  <th className="p-4">Bonus / Allowances</th>
                  <th className="p-4">Deductions</th>
                  <th className="p-4">Net Salary</th>
                  <th className="p-4">Payment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaries.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{s.staffId?.userId?.name || 'Staff'}</p>
                      <p className="text-slate-400 text-[11px]">{s.staffId?.designation || 'Employee'}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {s.month} {s.year}
                    </td>
                    <td className="p-4 font-mono">₹{s.basicSalary?.toLocaleString()}</td>
                    <td className="p-4 font-mono text-emerald-700">+₹{s.bonus?.toLocaleString() || 0}</td>
                    <td className="p-4 font-mono text-rose-600">-₹{s.deductions?.toLocaleString() || 0}</td>
                    <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                      ₹{s.netSalary?.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {s.paymentStatus || 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Salary Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="text-lg font-bold text-slate-900">Generate Staff Payslip</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {error && (
              <div className="p-3 mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Staff Member *</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                >
                  {staffList.map((st) => (
                    <option key={st._id} value={st._id}>
                      {st.userId?.name} ({st.designation || 'Staff'}) - Base: ₹{st.monthlySalary?.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December',
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bonus / Allowances (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Deductions (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="e.g. Regular monthly pay disbursement"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Generating...' : 'Disburse & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayroll;

