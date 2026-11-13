import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  DollarSign,
  Plus,
  Send,
  CheckCircle2,
  Calendar,
  Users,
  Eye,
  Search,
  ChevronRight,
  FileText,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const AdminSalaryPage = () => {
  const { showToast } = useToast();
  const [statements, setStatements] = useState([]);
  const [totalPayout, setTotalPayout] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const salRes = await API.get('/salary');
      const list = salRes.data.statements || [];
      setStatements(list);
      setTotalPayout(salRes.data.totalPayout || list.reduce((sum, s) => sum + (s.netSalary || 0), 0));
    } catch (err) {
      console.warn(err);
      showToast('Error loading salary ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredStatements = statements.filter((s) => {
    const employeeName = s.staffId?.userId?.name || s.staffId?.name || '';
    const monthYear = `${s.monthName || ''} Month ${s.month} ${s.year}`;
    const term = search.toLowerCase();
    return !search || employeeName.toLowerCase().includes(term) || monthYear.toLowerCase().includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-purple-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Clinic Payroll & Salary Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section 8.7 & 9.6 FRD: Calculate monthly attendance-adjusted payroll, basic pay, PF, allowances, and publish slips.
          </p>
        </div>

        <Link
          to="/admin/payroll/new"
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Monthly Statement</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Clinic Payout</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            ₹{totalPayout.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-400">Net salary disbursed across departments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Statements Issued</span>
            <Send className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{statements.length}</p>
          <span className="text-[11px] text-slate-400">Published to employee portals</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Payroll Engine</span>
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          </div>
          <p className="text-lg font-bold text-teal-700 mt-2">Section 9.6 Automated</p>
          <span className="text-[11px] text-slate-400">Attendance biometric deductions active</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name, month or year..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredStatements.length}</strong> of{' '}
          <strong className="text-slate-800">{statements.length}</strong> statements
        </div>
      </div>

      {/* Disbursed Salary Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Disbursed Salary Ledger</h3>
          <span className="text-xs text-slate-400 font-semibold">{filteredStatements.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Employee</th>
                <th className="py-3.5 px-4">Month / Year</th>
                <th className="py-3.5 px-4">Basic Pay</th>
                <th className="py-3.5 px-4">Allowances</th>
                <th className="py-3.5 px-4">Deductions</th>
                <th className="py-3.5 px-4 font-black text-slate-900">Net Payable</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-xs text-slate-400">
                    <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading salary statements...
                  </td>
                </tr>
              ) : filteredStatements.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-slate-400 text-xs">
                    No salary statements found. Click "Generate Monthly Statement" above.
                  </td>
                </tr>
              ) : (
                filteredStatements.map((s) => {
                  // Accurately compute Basic Pay, Allowances, Deductions, and Net
                  const basic = s.basicSalary ?? s.breakdown?.basic ?? 0;
                  const totalAllow =
                    s.totalAllowances ??
                    (s.allowances?.reduce((sum, a) => sum + (a.amount || 0), 0) ||
                      (s.breakdown?.hra || 0) + (s.breakdown?.medicalAllowance || 0));
                  const totalDeduct =
                    (s.totalDeductions ??
                      (s.deductions?.reduce((sum, d) => sum + (d.amount || 0), 0) ||
                        (s.breakdown?.pf || 0) + (s.breakdown?.unpaidLeaveDeduction || 0))) +
                    (s.attendanceDeduction || 0);
                  const net = s.netSalary ?? (basic + totalAllow - totalDeduct);

                  const employeeName = s.staffId?.userId?.name || s.staffId?.name || 'Staff Member';

                  return (
                    <tr key={s._id} className="hover:bg-slate-50/70 transition">
                      {/* Employee */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {employeeName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{employeeName}</div>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {s.statementId || `ID: #${s._id.slice(-6)}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Month / Year */}
                      <td className="py-4 px-4 text-slate-700 font-semibold text-xs">
                        {s.monthName || `Month ${s.month} / ${s.year}`}
                      </td>

                      {/* Basic Pay */}
                      <td className="py-4 px-4 text-slate-800 font-bold text-xs">
                        ₹{basic.toLocaleString('en-IN')}
                      </td>

                      {/* Allowances */}
                      <td className="py-4 px-4 text-emerald-600 font-bold text-xs">
                        +₹{totalAllow.toLocaleString('en-IN')}
                      </td>

                      {/* Deductions */}
                      <td className="py-4 px-4 text-rose-600 font-bold text-xs">
                        -₹{totalDeduct.toLocaleString('en-IN')}
                      </td>

                      {/* Net Payable */}
                      <td className="py-4 px-4 font-black text-slate-900 text-sm sm:text-base">
                        ₹{net.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {s.status || 'Published'}
                        </span>
                      </td>

                      {/* Action: View Option */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <Link
                          to={`/admin/payroll/${s._id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/80 transition inline-flex items-center gap-1.5 shadow-2xs"
                          title="View Official Salary Slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryPage;
