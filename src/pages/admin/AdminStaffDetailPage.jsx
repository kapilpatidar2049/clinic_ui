import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Briefcase,
  Mail,
  Phone,
  Clock,
  DollarSign,
  User,
  ShieldCheck,
  Calendar,
  Edit3,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';

export const AdminStaffDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffDetails();
  }, [id]);

  const fetchStaffDetails = async () => {
    setLoading(true);
    try {
      // Try direct single fetch first, fallback to list search
      let found = null;
      try {
        const res = await API.get(`/admin/staff/${id}`);
        found = res.data.staff;
      } catch {
        const listRes = await API.get('/admin/staff');
        found = (listRes.data.staff || []).find((s) => s._id === id);
      }

      if (!found) {
        showToast('Staff member record not found.', 'error');
        navigate('/admin/staff');
        return;
      }
      setStaff(found);
    } catch (err) {
      showToast('Error loading staff profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading employee file & roster details...
      </div>
    );
  }

  if (!staff) return null;

  const basicSalary = staff.salaryConfig?.basicSalary || staff.basicSalary || 25000;
  const allowances = staff.salaryConfig?.allowances || 3000;
  const deductions = staff.salaryConfig?.deductions || 1000;
  const netSalary = basicSalary + allowances - deductions;

  const shiftStart = staff.shiftTimings?.start || '09:00 AM';
  const shiftEnd = staff.shiftTimings?.end || '05:00 PM';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin/staff"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Staff Roster</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Staff Member Dossier & Record
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Employment profile, department assignment, salary configuration, and shifts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/admin/staff/${staff._id}/edit`}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 inline-flex items-center gap-2 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
          <Link
            to="/admin/staff"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
          >
            All Staff
          </Link>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-600/25 shrink-0">
            {staff.userId?.name ? staff.userId.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl font-black text-slate-900">{staff.userId?.name}</h2>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  staff.department === 'Reception'
                    ? 'bg-emerald-100 text-emerald-800'
                    : staff.department === 'Reports'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {staff.department} Department
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  staff.isActive !== false
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {staff.isActive !== false ? 'Active Employee' : 'Inactive'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-600 mt-1">
              {staff.designation || 'Staff Member'} • <span className="font-mono text-xs text-slate-400">ID: #{staff._id.slice(-6)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Department</span>
          <span className="text-lg font-black text-slate-900 mt-1 block">{staff.department}</span>
          <span className="text-xs text-emerald-600 font-semibold">{staff.designation}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Gross</span>
          <span className="text-lg font-black text-slate-900 mt-1 block">₹{basicSalary.toLocaleString()}</span>
          <span className="text-xs text-slate-400">Basic monthly tier</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Shift Timings</span>
          <span className="text-base font-black text-slate-900 mt-1 block">{shiftStart}</span>
          <span className="text-xs text-slate-400">Until {shiftEnd}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Lead</span>
          <span className="text-base font-black text-slate-900 mt-1 block truncate">
            {staff.reportingManager || 'Administrator'}
          </span>
          <span className="text-xs text-purple-700 font-semibold">Clinic Oversight</span>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact & Personal Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <span>Contact & Personnel Record</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Full Legal Name:</span>
              <span className="font-bold text-slate-900">{staff.userId?.name}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-mono font-semibold text-slate-800">{staff.userId?.email}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Contact Phone:</span>
              <span className="font-bold text-slate-900">{staff.userId?.phone || 'Not provided'}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Gender:</span>
              <span className="font-semibold text-slate-800">{staff.userId?.gender || 'Not specified'}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500">System Role:</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                Clinic Staff
              </span>
            </div>
          </div>
        </div>

        {/* Operational & Duty Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600" />
            <span>Employment & Operational Assignment</span>
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Assigned Department:</span>
              <span className="font-bold text-slate-900">{staff.department} Department</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Designation / Role:</span>
              <span className="font-bold text-slate-900">{staff.designation}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Date of Joining:</span>
              <span className="font-semibold text-slate-800">
                {staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : 'Active Record'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Work Shift:</span>
              <span className="font-bold text-slate-900">{shiftStart} to {shiftEnd}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500">Reporting Line:</span>
              <span className="font-semibold text-slate-800">{staff.reportingManager || 'Clinic Administrator'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Salary & Compensation Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-7 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-600" />
          <span>Compensation & Monthly Payroll Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Basic Salary</span>
            <span className="text-xl font-black text-slate-900 mt-1 block">
              ₹{basicSalary.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Standard Allowances</span>
            <span className="text-xl font-black text-emerald-600 mt-1 block">
              +₹{allowances.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 font-semibold block">Statutory Deductions</span>
            <span className="text-xl font-black text-rose-600 mt-1 block">
              -₹{deductions.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-emerald-700 font-bold block">Estimated Net Take-Home</span>
            <span className="text-xl font-black text-emerald-800 mt-1 block">
              ₹{netSalary.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStaffDetailPage;

