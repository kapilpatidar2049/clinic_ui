import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Ambulance, MapPin, Phone, CheckCircle, AlertTriangle, Clock, User } from 'lucide-react';

const DoctorHomeVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await API.get('/emergency');
      setVisits(res.data.homeVisits || []);
    } catch (err) {
      console.error('Failed to load emergency visits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, status) => {
    setActionLoading(true);
    try {
      await API.put(`/emergency/${id}/respond`, { status });
      fetchVisits();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update visit response.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    setActionLoading(true);
    try {
      await API.put(`/emergency/${id}/status`, { status });
      fetchVisits();
    } catch (err) {
      alert('Failed to update visit status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Ambulance className="w-7 h-7 text-rose-600" /> Emergency Doctor Home Visits
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review emergency requests, dispatch coordinators, and update visit status
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs text-slate-400">Loading emergency requests...</div>
      ) : visits.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Pending Emergency Visits</h3>
          <p className="text-xs text-slate-500 mt-1">All home visits are either fulfilled or in progress.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded">
                    {v.requestNumber || 'EMG-REQ'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      v.severity === 'Critical'
                        ? 'bg-red-100 text-red-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {v.severity}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {v.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{v.patientName}</h3>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <strong>Symptoms:</strong> {v.symptoms || 'Patient requires emergency physical evaluation'}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {v.visitAddress?.addressLine}, {v.visitAddress?.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Preferred: {v.preferredTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <a
                  href={`tel:${v.contactPhone}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-2 self-start sm:self-auto"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Patient: {v.contactPhone}
                </a>

                <div className="flex gap-2">
                  {v.status === 'Requested' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleRespond(v._id, 'Accepted')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm"
                    >
                      Accept Visit
                    </button>
                  )}
                  {v.status === 'Accepted' && (
                    <button
                      disabled={actionLoading}
                      onClick={() => handleStatusUpdate(v._id, 'Completed')}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm"
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

export default DoctorHomeVisits;

