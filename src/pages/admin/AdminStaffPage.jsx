import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Plus,
  Search,
  Briefcase,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Eye,
  Edit3,
  CheckCircle2,
  Filter,
  X,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';

export const AdminStaffPage = () => {
  const { showToast } = useToast();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/staff');
      setStaffList(res.data.staff || []);
    } catch (err) {
      console.warn(err);
      showToast('Error loading staff roster', 'error');
    } finally {
      setLoading(false);
    }
  };

  const departments = ['Reception', 'Reports', 'Pharmacy', 'Cleaning', 'Support', 'Administration'];

  const filteredStaff = staffList.filter((item) => {
    const nameMatch = item.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = item.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const deptMatch = item.department?.toLowerCase().includes(search.toLowerCase());
    const desigMatch = item.designation?.toLowerCase().includes(search.toLowerCase());
    const searchPass = !search || nameMatch || emailMatch || deptMatch || desigMatch;

    const deptPass = !departmentFilter || item.department === departmentFilter;
    return searchPass && deptPass;
  });

  // Calculate Metrics
  const totalCount = staffList.length;
  const receptionCount = staffList.filter((s) => s.department === 'Reception').length;
  const reportsCount = staffList.filter((s) => s.department === 'Reports').length;
  const activeCount = staffList.filter((s) => s.isActive !== false).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-8 h-8 text-purple-700" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Staff & Employee Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Section 8.4 FRD: Reception, Reports, Pharmacy, and Clinic Support staff department rosters, roles, and profiles.
          </p>
        </div>

        <Link
          to="/admin/staff/new"
          className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Staff</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</p>
          <span className="text-[11px] text-slate-400">Registered employees</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Reception Desk</span>
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{receptionCount}</p>
          <span className="text-[11px] text-slate-400">Front office executives</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Reports & Lab</span>
            <Briefcase className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{reportsCount}</p>
          <span className="text-[11px] text-slate-400">Diagnostics & records</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Status</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Currently on duty roster</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 bg-slate-50/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d} Department
              </option>
            ))}
          </select>

          {departmentFilter && (
            <button
              onClick={() => setDepartmentFilter('')}
              className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Staff Master List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading staff directory...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No staff members found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              {search || departmentFilter
                ? 'Try adjusting your search criteria or department filter.'
                : 'Click "Add Staff Member" to register clinic employees.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Department & Role</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Shift Timings</th>
                  <th className="py-3.5 px-4">Monthly Salary</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map((item) => {
                  const basicSalary =
                    item.salaryConfig?.basicSalary || item.basicSalary || 25000;
                  const shiftStart = item.shiftTimings?.start || '09:00 AM';
                  const shiftEnd = item.shiftTimings?.end || '05:00 PM';

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Avatar */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : 'S'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{item.userId?.name}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono">
                                ID: #{item._id.slice(-6)}
                              </span>
                              {item.userId?.gender && (
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {item.userId.gender}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Role */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              item.department === 'Reception'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.department === 'Reports'
                                ? 'bg-blue-100 text-blue-800'
                                : item.department === 'Pharmacy'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {item.department} Department
                          </span>
                          <div className="text-xs text-slate-600 font-medium">
                            {item.designation || 'Staff Member'}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.userId?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{item.userId?.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Shift Timings */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{shiftStart} – {shiftEnd}</span>
                        </div>
                      </td>

                      {/* Monthly Salary */}
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          ₹{basicSalary.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-normal">/ month</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            item.isActive !== false
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isActive !== false ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <span>{item.isActive !== false ? 'Active' : 'Inactive'}</span>
                        </span>
                      </td>

                      {/* Actions: View and Edit Buttons */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* View Button */}
                          <Link
                            to={`/admin/staff/${item._id}`}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs border border-purple-200/80 transition inline-flex items-center gap-1 shadow-2xs"
                            title="View Full Staff Dossier"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          {/* Edit Button */}
                          <Link
                            to={`/admin/staff/${item._id}/edit`}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition inline-flex items-center gap-1 shadow-2xs"
                            title="Edit Staff Profile & Salary"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStaffPage;
