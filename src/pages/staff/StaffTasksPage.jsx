import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flag,
  MessageSquare,
  Search,
  ChevronRight,
} from 'lucide-react';

const StaffTasksPage = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data.tasks || []);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Task Assignment Board</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review department duties assigned by clinic administration, update operational progress, and submit remarks.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading assignments...
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Tasks Assigned</h3>
          <p className="text-xs text-slate-500">There are no operational duties currently assigned to your department.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">{task.taskId}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === 'Urgent' || task.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{task.description}</p>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
                  <span>Deadline: <strong className="text-slate-800">{task.deadline || 'Immediate'}</strong></span>
                  {task.assignedTo && (
                    <span>Assigned: <strong className="text-slate-800">{task.assignedTo.name}</strong></span>
                  )}
                </div>

                {task.staffRemarks && (
                  <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                    <strong>Latest Remarks:</strong> {task.staffRemarks}
                  </div>
                )}
              </div>

              <div>
                <Link
                  to={`/staff/tasks/${task._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Update Progress / Status</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffTasksPage;
