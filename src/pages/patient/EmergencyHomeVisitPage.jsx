import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Ambulance,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  User,
  ShieldAlert,
} from 'lucide-react';

const EmergencyHomeVisitPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [contactNumber, setContactNumber] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address?.fullAddress || '');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [emergencyDetails, setEmergencyDetails] = useState('');
  const [priority, setPriority] = useState('Critical');

  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState('');
  const [currentRequest, setCurrentRequest] = useState(null);
  const [myHistory, setMyHistory] = useState([]);

  useEffect(() => {
    fetchActiveRequests();
  }, []);

  const fetchActiveRequests = async () => {
    try {
      const res = await API.get('/emergency');
      const list = res.data.visits || [];
      setMyHistory(list);
      // Find active request if any
      const active = list.find((v) => ['Requested', 'Notified', 'Accepted', 'In Progress'].includes(v.status));
      if (active) setCurrentRequest(active);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsNotice('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingGps(true);
    setGpsNotice('Acquiring precise GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setDetectingGps(false);
        setGpsNotice(`GPS Coordinates acquired: Lat ${position.coords.latitude.toFixed(4)}, Lng ${position.coords.longitude.toFixed(4)}`);
      },
      (err) => {
        setDetectingGps(false);
        setGpsNotice('Could not acquire GPS automatically. Please verify your manual address.');
      },
      { timeout: 10000 }
    );
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      showToast('Please provide the physical address where the doctor should arrive.', 'warning');
      return;
    }
    if (!emergencyDetails) {
      showToast('Please describe the medical emergency.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/emergency/request', {
        contactNumber,
        emergencyDetails,
        priority,
        location: {
          address,
          latitude: latitude || 28.6139,
          longitude: longitude || 77.2090,
        },
      });

      showToast('Emergency request dispatched! On-call doctor has been alerted.', 'success');
      setCurrentRequest(res.data.homeVisit);
      fetchActiveRequests();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit emergency request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
      {/* Alert Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-rose-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            24/7 Immediate Doctor Home Visit Service
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Emergency Home Doctor Request</h1>
          <p className="text-xs sm:text-sm text-rose-100 max-w-xl">
            For critical illnesses, acute symptoms, or patients unable to commute. All available clinic doctors receive high-priority ringing notifications.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center border border-white/20 shrink-0">
          <p className="text-[11px] uppercase tracking-wider text-rose-200 font-semibold">Immediate Hotline</p>
          <p className="text-xl font-black text-white mt-0.5">+91 98765 00100</p>
          <p className="text-[10px] text-rose-200 mt-1">24x7 Ambulance & SOS</p>
        </div>
      </div>

      {/* Active Request Tracker Card */}
      {currentRequest && (
        <div className="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-sm font-bold text-slate-900">Active Emergency Request: {currentRequest.visitId}</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
              {currentRequest.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-semibold">Destination Address:</p>
              <p className="text-slate-800 font-medium mt-1">{currentRequest.location?.address}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-semibold">Emergency Nature:</p>
              <p className="text-slate-800 font-medium mt-1">{currentRequest.emergencyDetails}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-slate-400 font-semibold">Assigned Doctor:</p>
              <p className="text-emerald-700 font-bold mt-1">
                {currentRequest.doctorId?.userId?.name ? `Dr. ${currentRequest.doctorId.userId.name}` : 'Notifying on-call doctors...'}
              </p>
              {currentRequest.doctorRemarks && (
                <p className="text-slate-500 text-[11px] mt-1">Note: {currentRequest.doctorRemarks}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Submit Emergency Home Dispatch</h2>
          <p className="text-xs text-slate-500 mt-0.5">Please provide accurate patient location and medical symptoms.</p>
        </div>

        <form onSubmit={handleEmergencySubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="Primary phone number for doctor callback"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
              >
                <option value="Critical">Critical (Immediate Doctor Required)</option>
                <option value="High">High (Severe pain / unable to move)</option>
                <option value="Normal">Normal Home Consultation</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Patient Residence Address *</label>
              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={detectingGps}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                {detectingGps ? 'Detecting GPS...' : 'Auto-Detect via GPS'}
              </button>
            </div>
            <textarea
              rows="2"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House/Flat number, building name, street, nearby landmark, city"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            />
            {gpsNotice && <p className="text-[11px] text-emerald-600 font-medium mt-1">{gpsNotice}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Emergency Description *</label>
            <textarea
              rows="3"
              required
              value={emergencyDetails}
              onChange={(e) => setEmergencyDetails(e.target.value)}
              placeholder="Briefly state symptoms: e.g. severe shortness of breath, sudden collapse, high fever with chills, trauma, etc."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2"
            >
              <Ambulance className="w-5 h-5" />
              {loading ? 'Alerting Available Doctors...' : 'Dispatch Emergency Home Visit Alert'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      {myHistory.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Your Home Visit History</h3>
          <div className="space-y-3">
            {myHistory.map((item) => (
              <div
                key={item._id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-700">{item.visitId}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 font-medium mt-1">{item.emergencyDetails}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyHomeVisitPage;
