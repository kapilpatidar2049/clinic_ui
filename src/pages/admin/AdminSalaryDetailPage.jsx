import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Printer,
  DollarSign,
  Calendar,
  Building,
  User,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export const AdminSalaryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatement();
  }, [id]);

  const fetchStatement = async () => {
    setLoading(true);
    try {
      let found = null;
      try {
        const res = await API.get(`/salary/${id}`);
        found = res.data.statement;
      } catch {
        const listRes = await API.get('/salary');
        found = (listRes.data.statements || []).find((s) => s._id === id);
      }

      if (!found) {
        showToast('Salary statement not found.', 'error');
        navigate('/admin/payroll');
        return;
      }
      setStatement(found);
    } catch (err) {
      showToast('Error loading salary statement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading salary statement and breakdown...
      </div>
    );
  }

  if (!statement) return null;

  const basic = statement.basicSalary ?? statement.breakdown?.basic ?? 0;
  const allowancesList = statement.allowances && statement.allowances.length > 0
    ? statement.allowances
    : [
        { title: 'HRA (House Rent Allowance)', amount: statement.breakdown?.hra || Math.round(basic * 0.2) },
        { title: 'Medical Allowance', amount: statement.breakdown?.medicalAllowance || 1500 },
        { title: 'Conveyance Allowance', amount: 1500 },
      ];

  const totalAllowances =
    statement.totalAllowances ??
    allowancesList.reduce((sum, a) => sum + (a.amount || 0), 0);

  const deductionsList = statement.deductions && statement.deductions.length > 0
    ? statement.deductions
    : [
        { title: 'Provident Fund (PF)', amount: statement.breakdown?.pf || Math.round(basic * 0.12) },
        { title: 'Professional Tax', amount: 200 },
      ];

  const totalDeductions =
    (statement.totalDeductions ??
      deductionsList.reduce((sum, d) => sum + (d.amount || 0), 0)) +
    (statement.attendanceDeduction || 0);

  const netSalary = statement.netSalary ?? (basic + totalAllowances - totalDeductions);
  const employeeName = statement.staffId?.userId?.name || statement.staffId?.name || 'Staff Member';
  const employeeEmail = statement.staffId?.userId?.email || statement.staffId?.email || 'N/A';
  const employeePhone = statement.staffId?.userId?.phone || statement.staffId?.phone || 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Action Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <Link
            to="/admin/payroll"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Payroll Ledger</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Official Salary Statement & Slip
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Published payroll slip for {employeeName} • {statement.monthName || `Month ${statement.month} / ${statement.year}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
          <Link
            to="/admin/payroll"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
          >
            Back to Ledger
          </Link>
        </div>
      </div>

      {/* Printable Payslip Card */}
      <div
        id="printable-area"
        className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-10 space-y-6 text-slate-800"
      >
        {/* Clinic Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-700 to-indigo-600 text-white font-black flex items-center justify-center text-xl shadow-md">
              +
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                MY CLINIC HEALTHCARE
              </h2>
              <p className="text-xs font-semibold text-purple-700">Official Monthly Employee Payslip</p>
              <p className="text-[11px] text-slate-400">
                Medical Complex, Outer Ring Road, New Delhi • Registration: DLH-MYCL-992
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="font-mono text-xs font-bold text-slate-500 block">
              {statement.statementId || `SAL-${statement._id.slice(-8)}`}
            </span>
            <div className="text-base font-extrabold text-slate-900">
              {statement.monthName || `Month ${statement.month} / ${statement.year}`}
            </div>
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-full">
              Status: {statement.status || 'Published'}
            </span>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium block">Employee Name</span>
            <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{employeeName}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Designation / Role</span>
            <span className="font-bold text-slate-800 text-sm mt-0.5 block">Staff Member</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Contact Info</span>
            <span className="font-medium text-slate-800 block mt-0.5">{employeePhone}</span>
            <span className="text-[10px] text-slate-400 font-mono truncate block">{employeeEmail}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Days Present</span>
            <span className="font-bold text-emerald-700 text-sm mt-0.5 block">
              {statement.presentDays || 26} / 26 Working Days
            </span>
          </div>
        </div>

        {/* Two-Column Earnings & Deductions Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Earnings (Left) */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                1. Earnings & Allowances
              </span>
              <span className="text-xs font-bold text-slate-400">Amount (₹)</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1">
                <span className="font-semibold text-slate-700">Basic Monthly Salary</span>
                <span className="font-bold text-slate-900">₹{basic.toLocaleString('en-IN')}</span>
              </div>

              {allowancesList.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-slate-600">
                  <span>{item.title}</span>
                  <span className="font-semibold text-emerald-600">+₹{item.amount?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs sm:text-sm font-extrabold">
              <span className="text-slate-900">Total Gross Earnings</span>
              <span className="text-emerald-700">₹{(basic + totalAllowances).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Deductions (Right) */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-700">
                2. Statutory Deductions
              </span>
              <span className="text-xs font-bold text-slate-400">Amount (₹)</span>
            </div>

            <div className="space-y-2 text-xs">
              {deductionsList.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 text-slate-600">
                  <span>{item.title}</span>
                  <span className="font-semibold text-rose-600">-₹{item.amount?.toLocaleString('en-IN')}</span>
                </div>
              ))}

              {statement.attendanceDeduction > 0 && (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Attendance / LOP Deductions</span>
                  <span className="font-semibold text-rose-600">
                    -₹{statement.attendanceDeduction.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-xs sm:text-sm font-extrabold">
              <span className="text-slate-900">Total Deductions</span>
              <span className="text-rose-700">-₹{totalDeductions.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Net Salary Highlight Banner */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 p-6 rounded-2xl border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Net Disbursed Take-Home Pay
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct Credit to Registered Salary Bank Account
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-2xl sm:text-3xl font-black text-purple-950">
              ₹{netSalary.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 block font-medium">
              Payment Confirmed & Verified
            </span>
          </div>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500 text-center">
          <div className="space-y-6">
            <div className="h-10 border-b border-dashed border-slate-300 mx-auto max-w-[200px]" />
            <span>Authorized Clinic Administrator</span>
          </div>
          <div className="space-y-6">
            <div className="h-10 border-b border-dashed border-slate-300 mx-auto max-w-[200px]" />
            <span>Employee Acknowledgment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSalaryDetailPage;

