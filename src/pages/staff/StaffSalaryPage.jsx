import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  DollarSign,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building,
} from 'lucide-react';

const StaffSalaryPage = () => {
  const { user } = useAuth();
  const [statements, setStatements] = useState([]);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const res = await API.get('/salary/my');
      const list = res.data.statements || [];
      setStatements(list);
      if (list.length > 0) setSelectedStatement(list[0]);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="no-print">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Monthly Salary Statements</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review monthly salary slips, earnings breakdown, deductions, and download official payment receipts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading salary records...</div>
      ) : statements.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <DollarSign className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Salary Slips Published Yet</h3>
          <p className="text-xs text-slate-500">
            Monthly salary statements generated and published by admin will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Statement History List */}
          <div className="lg:col-span-4 space-y-3 no-print">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Salary Slips</h3>
            {statements.map((stmt) => (
              <div
                key={stmt._id}
                onClick={() => setSelectedStatement(stmt)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedStatement?._id === stmt._id
                    ? 'border-emerald-600 bg-emerald-50/60 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{stmt.monthName}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    ₹{stmt.netSalary?.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
                  <span>{stmt.statementId}</span>
                  <span>{stmt.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Printable Payslip View */}
          <div className="lg:col-span-8">
            {selectedStatement && (
              <div className="space-y-4">
                <div className="flex justify-end gap-2 no-print">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center gap-2 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Download Payslip
                  </button>
                </div>

                <div
                  id="printable-area"
                  className="bg-white rounded-3xl border border-slate-300 p-8 sm:p-10 shadow-lg space-y-6 text-slate-800"
                >
                  {/* Clinic Payslip Header */}
                  <div className="border-b-2 border-slate-800 pb-5 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">MY CLINIC HEALTHCARE</h2>
                      <p className="text-xs font-medium text-slate-500">Official Monthly Employee Payslip</p>
                      <p className="text-[11px] text-slate-400">Outer Ring Road, New Delhi • PAN/TAN: DLH-MYCL-992</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-slate-500">{selectedStatement.statementId}</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedStatement.monthName}</h3>
                      <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded mt-1">
                        Status: {selectedStatement.status}
                      </span>
                    </div>
                  </div>

                  {/* Employee Metadata */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 font-medium">Employee Name:</span>
                      <p className="font-bold text-slate-900">{user?.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Department:</span>
                      <p className="font-bold text-slate-900">{user?.extraProfile?.department || 'Staff'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Working Days:</span>
                      <p className="font-bold text-slate-900">{selectedStatement.presentDays || 26} Days</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">Payment Mode:</span>
                      <p className="font-bold text-slate-900">{selectedStatement.paymentMethod || 'Bank Transfer'}</p>
                    </div>
                  </div>

                  {/* Earnings vs Deductions Table */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    {/* Earnings */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-emerald-50 px-4 py-2 font-bold text-emerald-900 border-b border-slate-200 flex justify-between">
                        <span>Earnings</span>
                        <span>Amount (₹)</span>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between py-1 border-b border-slate-100">
                          <span className="text-slate-600">Basic Salary</span>
                          <span className="font-bold text-slate-800">
                            ₹{selectedStatement.basicSalary?.toLocaleString('en-IN')}
                          </span>
                        </div>
                        {selectedStatement.allowances?.map((a, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">{a.title}</span>
                            <span className="font-semibold text-slate-800">₹{a.amount?.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        <div className="flex justify-between pt-2 font-bold text-emerald-800">
                          <span>Total Gross Earnings:</span>
                          <span>
                            ₹
                            {(
                              (selectedStatement.basicSalary || 0) + (selectedStatement.totalAllowances || 0)
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-rose-50 px-4 py-2 font-bold text-rose-900 border-b border-slate-200 flex justify-between">
                        <span>Deductions</span>
                        <span>Amount (₹)</span>
                      </div>
                      <div className="p-4 space-y-2">
                        {selectedStatement.deductions?.map((d, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-600">{d.title}</span>
                            <span className="font-semibold text-slate-800">₹{d.amount?.toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        {selectedStatement.attendanceDeduction > 0 && (
                          <div className="flex justify-between py-1 border-b border-slate-100 text-rose-600">
                            <span>Unpaid Absence Adjustment</span>
                            <span className="font-semibold">
                              -₹{selectedStatement.attendanceDeduction?.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 font-bold text-rose-800">
                          <span>Total Deductions:</span>
                          <span>
                            ₹
                            {(
                              (selectedStatement.totalDeductions || 0) +
                              (selectedStatement.attendanceDeduction || 0)
                            ).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Net Payable Highlight */}
                  <div className="bg-emerald-600 text-white rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase font-semibold text-emerald-100">Net Disbursed Take-Home Salary</span>
                      <p className="text-2xl sm:text-3xl font-black mt-0.5">
                        ₹{selectedStatement.netSalary?.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right text-xs text-emerald-100">
                      <p>Disbursed via Direct Bank Deposit</p>
                      <p className="text-[10px] opacity-80 mt-0.5">Automated Clinic Payroll System</p>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
                    <p>This is a computer-generated salary slip and requires no physical signature.</p>
                    <p className="font-bold text-slate-600">My Clinic Human Resources</p>
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

export default StaffSalaryPage;
