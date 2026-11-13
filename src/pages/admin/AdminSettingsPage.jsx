import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  Building,
  Phone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Save,
  FileText,
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState({
    clinicName: 'My Clinic Healthcare & Multi-Specialty Center',
    tagline: 'Excellence in Comprehensive Healthcare & Family Medicine',
    phone: '+91 98765 43210',
    emergencyPhone: '+91 98765 00100',
    email: 'care@myclinic.health',
    address: 'Plot 42, Healthcare Enclave, Main Outer Ring Road, New Delhi, 110001',
    defaultSlotDuration: 15,
    allowOnlinePayment: true,
    emergencyHomeVisitService: true,
    prescriptionTemplate: {
      headerText: 'Department of Outpatient Consultation & Family Medicine',
      footerText: 'Follow prescribed regimen strictly. In emergency call +91 98765 00100.',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data.clinicSettings) {
        setSettings(res.data.clinicSettings);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await API.put('/admin/settings', settings);
      showToast('Clinic configurations and digital letterhead templates updated!', 'success');
      setMsg('Clinic configurations and digital letterhead templates updated!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Clinic Data, Timings & Letterhead Branding</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sections 8.10 & 8.12 FRD: Centralized clinic parameters, prescription template headers, emergency hotline, and slot rules.
        </p>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic General Profile */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Clinic Branding & Contact Info
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Clinic Name *</label>
              <input
                type="text"
                required
                value={settings.clinicName}
                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic OPD Hotline</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">24x7 Emergency SOS Number</label>
              <input
                type="text"
                value={settings.emergencyPhone}
                onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-rose-600 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Clinic Address & Landmark</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Prescription Template & Letterhead Defaults */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Digital Prescription Letterhead Template (Section 8.10 FRD)
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prescription Sub-Header Note</label>
              <input
                type="text"
                value={settings.prescriptionTemplate?.headerText || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    prescriptionTemplate: {
                      ...settings.prescriptionTemplate,
                      headerText: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prescription Medico-Legal Footer & Disclaimer</label>
              <textarea
                rows="2"
                value={settings.prescriptionTemplate?.footerText || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    prescriptionTemplate: {
                      ...settings.prescriptionTemplate,
                      footerText: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Operational Policies & Toggles */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Operational Policies & Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Default Slot Duration</span>
              <select
                value={settings.defaultSlotDuration || 15}
                onChange={(e) => setSettings({ ...settings, defaultSlotDuration: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
              >
                <option value={10}>10 Minutes</option>
                <option value={15}>15 Minutes</option>
                <option value={20}>20 Minutes</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Online Payment Facility</span>
              <label className="flex items-center gap-2 cursor-pointer mt-2 font-medium">
                <input
                  type="checkbox"
                  checked={settings.allowOnlinePayment}
                  onChange={(e) => setSettings({ ...settings, allowOnlinePayment: e.target.checked })}
                  className="rounded text-purple-600 w-4 h-4"
                />
                <span>Allow Patients to Pay Online (UPI/Card)</span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">Emergency Home Visits</span>
              <label className="flex items-center gap-2 cursor-pointer mt-2 font-medium">
                <input
                  type="checkbox"
                  checked={settings.emergencyHomeVisitService}
                  onChange={(e) => setSettings({ ...settings, emergencyHomeVisitService: e.target.checked })}
                  className="rounded text-rose-600 w-4 h-4"
                />
                <span>Enable 24/7 Home Doctor Dispatch</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Clinic Configurations'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
