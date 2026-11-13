import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  AlertTriangle,
  FileText,
  User,
} from 'lucide-react';

export const StaffTaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('In Progress');
  const [staffRemarks, setStaffRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const res = await API.get('/tasks');
      const found = (res.data.tasks || []).find((t) => t._id === id);
      if (!found) {
        showToast('Task not found or expired.', 'error');
        navigate('/staff/tasks');
        return;
      }
      setTask(found);
      setStatus(found.status || 'In Progress');
      setStaffRemarks(found.staffRemarks || '');
    } catch (err) {
      showToast('Error loading task details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await API.put(`/tasks/${id}/status`, {
        status,
        staffRemarks,
      });

      showToast('Task status and remarks updated successfully!', 'success');
      navigate('/staff/tasks');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating task', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-xs text-slate-400">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading operational assignment...
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Back button & Page Header */}
      <div>
        <Link
          to="/staff/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tasks Board</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Update Task Progress
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Submit operational logs, mark milestones, and notify clinic administration.
            </p>
          </div>

          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl self-start sm:self-center border border-slate-200">
            {task.taskId || `ID #${task._id.slice(-6)}`}
          </span>
        </div>
      </div>

      {/* Main Task Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                task.priority === 'Urgent' || task.priority === 'High'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              {task.priority} Priority
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                task.status === 'Completed'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : task.status === 'In Progress'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              Status: {task.status}
            </span>
            {task.department && (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                Dept: {task.department}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">{task.title}</h2>
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block">Scheduled Deadline</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Immediate'}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold block">Assigned Staff Member</span>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <User className="w-4 h-4 text-slate-400" />
              <span>{task.assignedTo?.name || 'Reception & Nursing Staff'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
            Assignment Details & Operational Scope:
          </span>
          <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
            {task.description || 'Complete standard protocol according to clinic operational guidelines.'}
          </p>
        </div>

        {/* Update Form */}
        <form onSubmit={handleSaveUpdate} className="space-y-6 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Update Current Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full sm:w-80 px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
            >
              <option value="Assigned">Assigned (Not Started)</option>
              <option value="In Progress">In Progress (Actively Working)</option>
              <option value="Completed">Completed (Ready for Review)</option>
              <option value="On Hold">On Hold (Pending Inputs)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Staff Progress Remarks / Detailed Notes *
            </label>
            <textarea
              rows="4"
              required
              value={staffRemarks}
              onChange={(e) => setStaffRemarks(e.target.value)}
              placeholder="e.g. Sterilized equipment in OPD room 2; updated vaccine stocks ledger; verified evening shift handover."
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/60"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={updating}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition"
            >
              {updating ? 'Saving Changes...' : 'Save & Submit Status Update'}
            </button>
            <Link
              to="/staff/tasks"
              className="py-3.5 px-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffTaskDetailPage;

