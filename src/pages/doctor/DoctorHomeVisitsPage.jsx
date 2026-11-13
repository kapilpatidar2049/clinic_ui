import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Ambulance,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Navigation,
  FileText,
  User,
} from 'lucide-react';

const DoctorHomeVisitsPage = () => {
  const { showToast } = useToast();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await API.get('/emergency');
      setVisits(res.data.visits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (visitId, action) => {
    try {
      await API.put(`/emergency/${visitId}/respond`, {
        action,
        doctorRemarks: action === 'accept' ? 'Doctor dispatched with medical kit' : 'Doctor unavailable due to OPD rush',
      });
      showToast(`Emergency visit ${action === 'accept' ? 'accepted' : 'declined'}`, 'info');
      fetchVisits();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating request', 'error');
    }
  };

  const handleStatusUpdate = async (visitId, status) => {
    try {
      await API.put(`/emergency/${visitId}/status`, {
        status,
        doctorRemarks: `Status updated to ${status} by doctor`,
      });
      showToast(`Emergency visit status updated to ${status}`, 'success');
      fetchVisits();
    } catch (err) {
      showToast(err.response?.data?.message || 'Error updating status', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Ambulance className="w-7 h-7 text-rose-600 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Emergency Home Visits Workstation</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review emergency patient dispatches, GPS addresses, accept calls, and update in-transit consultation status.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading home visits...</div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Ambulance className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Emergency Visits Pending</h3>
          <p className="text-xs text-slate-500">All home visit requests are resolved or none have been submitted.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <div
              key={v._id}
              className={`bg-white rounded-3xl border p-6 shadow-sm transition space-y-4 ${
                v.status === 'Requested'
                  ? 'border-2 border-rose-400 bg-rose-50/20'
                  : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800">{v.visitId}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      v.status === 'Requested'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : v.status === 'Accepted'
                        ? 'bg-blue-100 text-blue-700'
                        : v.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-700'
                        : v.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {v.status}
                  </span>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Priority: {v.priority}
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  Requested: {new Date(v.requestedAt || v.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Patient & Location info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <p className="text-slate-400 font-semibold">Patient Information:</p>
                  <p className="text-slate-900 font-bold text-sm">{v.patientName}</p>
                  <p className="text-slate-600 flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> {v.contactNumber}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 md:col-span-2">
                  <p className="text-slate-400 font-semibold">Emergency Address & Symptoms:</p>
                  <p className="text-slate-900 font-medium flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{v.location?.address}</span>
                  </p>
                  <p className="text-rose-700 font-semibold mt-1">
                    Condition: "{v.emergencyDetails}"
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {v.location?.latitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${v.location.latitude},${v.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5 text-blue-600" /> Open in Maps Navigation
                    </a>
                  )}
                  {v.doctorRemarks && (
                    <span className="text-xs text-slate-500 italic">Note: {v.doctorRemarks}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {v.status === 'Requested' && (
                    <>
                      <button
                        onClick={() => handleRespond(v._id, 'accept')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                      >
                        Accept & Dispatch Visit
                      </button>
                      <button
                        onClick={() => handleRespond(v._id, 'reject')}
                        className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {v.status === 'Accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(v._id, 'In Progress')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                    >
                      Mark "In Progress / En Route"
                    </button>
                  )}

                  {v.status === 'In Progress' && (
                    <button
                      onClick={() => handleStatusUpdate(v._id, 'Completed')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                    >
                      Mark Visit Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorHomeVisitsPage;
