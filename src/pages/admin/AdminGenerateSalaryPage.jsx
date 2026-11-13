import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  DollarSign,
  Calculator,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminGenerateSalaryPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [basicSalary, setBasicSalary] = useState(28000);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await API.get('/admin/staff');
      setStaffList(res.data.staff || []);
    } catch (err) {
      showToast('Error loading staff list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      showToast('Please select an employee.', 'warning');
      return;
    }

    setGenerating(true);
    try {
      await API.post('/salary/generate', {
        staffId: selectedStaffId,
        month,
        year,
        customBasicSalary: basicSalary,
      });

      showToast('Salary statement calculated and published to employee portal!', 'success');
      navigate('/admin/payroll');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error generating salary', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/payroll"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Payroll Ledger</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-8 h-8 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Generate & Publish Monthly Salary
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Compute attendance-adjusted payroll, HRA, Provident Fund (PF), and publish formal salary slip.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleGenerateSalary} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Clinic Employee *
            </label>
            <select
              required
              value={selectedStaffId}
              onChange={(e) => {
                setSelectedStaffId(e.target.value);
                const found = staffList.find((s) => s.userId?._id === e.target.value);
                if (found?.salaryConfig?.basicSalary) {
                  setBasicSalary(found.salaryConfig.basicSalary);
                } else if (found?.basicSalary) {
                  setBasicSalary(found.basicSalary);
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 text-xs sm:text-sm font-semibold"
            >
              <option value="">-- Choose Employee From Roster --</option>
              {staffList.map((s) => (
                <option key={s.userId?._id} value={s.userId?._id}>
                  {s.userId?.name} ({s.department} Department • {s.designation})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Payroll Month *</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 font-medium"
              >
                {[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ].map((name, i) => (
                  <option key={i + 1} value={i + 1}>
                    Month {i + 1} ({name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Fiscal Year *</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Monthly Basic Pay (₹) *</label>
            <input
              type="number"
              min="0"
              step="500"
              required
              value={basicSalary}
              onChange={(e) => setBasicSalary(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50 text-base font-bold text-slate-900"
            />
          </div>

          {/* Payroll calculation notice */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Automated Statutory Deductions & Additions:</span>
            </div>
            <ul className="list-disc list-inside text-slate-500 space-y-0.5 text-[11px] pt-1">
              <li>Queries daily staff biometric attendance logs for total working days vs unpaid leaves.</li>
              <li>Adds standard 20% House Rent Allowance (HRA) and ₹1,500 Medical Allowance.</li>
              <li>Calculates 12% employee Provident Fund (PF) deduction and Professional Tax.</li>
              <li>Publishes digitally signed salary slip directly to employee's staff portal.</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              to="/admin/payroll"
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={generating}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              <span>{generating ? 'Calculating & Publishing...' : 'Generate & Publish Slip'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminGenerateSalaryPage;

