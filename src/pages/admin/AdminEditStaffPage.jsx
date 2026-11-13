import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Briefcase,
  User,
  Phone,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
} from 'lucide-react';

export const AdminEditStaffPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Female');
  const [department, setDepartment] = useState('Reception');
  const [designation, setDesignation] = useState('');
  const [basicSalary, setBasicSalary] = useState(25000);
  const [allowances, setAllowances] = useState(3000);
  const [deductions, setDeductions] = useState(1000);
  const [shiftStart, setShiftStart] = useState('09:00 AM');
  const [shiftEnd, setShiftEnd] = useState('05:00 PM');
  const [reportingManager, setReportingManager] = useState('Clinic Administrator');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      let found = null;
      try {
        const res = await API.get(`/admin/staff/${id}`);
        found = res.data.staff;
      } catch {
        const listRes = await API.get('/admin/staff');
        found = (listRes.data.staff || []).find((s) => s._id === id);
      }

      if (!found) {
        showToast('Staff member not found.', 'error');
        navigate('/admin/staff');
        return;
      }

      setName(found.userId?.name || '');
      setEmail(found.userId?.email || '');
      setPhone(found.userId?.phone || '');
      setGender(found.userId?.gender || 'Female');
      setDepartment(found.department || 'Reception');
      setDesignation(found.designation || '');
      setBasicSalary(found.salaryConfig?.basicSalary || found.basicSalary || 25000);
      setAllowances(found.salaryConfig?.allowances || 3000);
      setDeductions(found.salaryConfig?.deductions || 1000);
      setShiftStart(found.shiftTimings?.start || '09:00 AM');
      setShiftEnd(found.shiftTimings?.end || '05:00 PM');
      setReportingManager(found.reportingManager || 'Clinic Administrator');
      setIsActive(found.isActive !== false);
    } catch (err) {
      showToast('Error loading staff details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast('Please enter staff name.', 'warning');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await API.put(`/admin/staff/${id}`, {
        name,
        phone,
        gender,
        department,
        designation,
        basicSalary: Number(basicSalary),
        allowances: Number(allowances),
        deductions: Number(deductions),
        shiftStart,
        shiftEnd,
        reportingManager,
        isActive,
      });

      showToast(`Staff member "${name}" updated successfully!`, 'success');
      navigate('/admin/staff');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating staff member.';
      setErrorMsg(msg);
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading staff edit form...
      </div>
    );
  }

  const departments = ['Reception', 'Reports', 'Pharmacy', 'Cleaning', 'Support', 'Administration'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          to={`/admin/staff/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Staff Profile</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Staff Member Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update department duties, employee contact info, shifts, and salary configuration.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6"
      >
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Personnel Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 pb-2 border-b border-slate-100">
            1. Personnel & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Email cannot be changed (login identity).</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Department & Role */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 pb-2 border-b border-slate-100">
            2. Department & Role Assignment
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d} Department
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Designation / Job Title *</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Front Desk Executive"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Shift Start Time</label>
              <input
                type="text"
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                placeholder="09:00 AM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Shift End Time</label>
              <input
                type="text"
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                placeholder="05:00 PM"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Reporting Manager</label>
              <input
                type="text"
                value={reportingManager}
                onChange={(e) => setReportingManager(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Employment Status</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  <span>Active on Clinic Roster</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Salary & Payroll Config */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 pb-2 border-b border-slate-100">
            3. Salary & Compensation (₹)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Basic Monthly Salary (₹) *</label>
              <input
                type="number"
                min="0"
                required
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Allowances (₹)</label>
              <input
                type="number"
                min="0"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Deductions (₹)</label>
              <input
                type="number"
                min="0"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 flex items-center justify-between">
            <span>Net Monthly Take-Home:</span>
            <span className="font-extrabold text-sm text-purple-800">
              ₹{(Number(basicSalary) + Number(allowances) - Number(deductions)).toLocaleString()} / mo
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 px-6 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-700/20 transition flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{submitting ? 'Saving Changes...' : 'Save & Update Staff Profile'}</span>
          </button>
          <Link
            to={`/admin/staff/${id}`}
            className="py-3 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AdminEditStaffPage;

