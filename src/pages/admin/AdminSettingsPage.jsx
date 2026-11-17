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
  Image as ImageIcon,
  Plus,
  Trash2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Eye,
  X,
} from 'lucide-react';

const PRESET_GALLERY_IMAGES = [
  {
    title: 'Executive OPD Consultation Suite',
    category: 'OPD Rooms',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    description: 'Ergonomic consultation suites with integrated digital vitals monitors and paperless diagnosis terminal.',
  },
  {
    title: 'Patient Waiting Lounge & Reception Desk',
    category: 'Waiting Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Hygienic, comfortable waiting environment with live queue token sequencing LED displays.',
  },
  {
    title: 'Automated Pathology & Diagnostic Lab',
    category: 'Diagnostics & Lab',
    imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
    description: 'NABL accredited pathology and clinical biochemistry testing for accurate same-day reports.',
  },
  {
    title: 'Minor OT & Daycare Procedure Wing',
    category: 'Procedure & OT',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    description: 'Ultra-sterile surgical environment for outpatient minor surgeries, wound care, and sterile dressings.',
  },
  {
    title: '24/7 Integrated Digital Pharmacy',
    category: 'Pharmacy',
    imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
    description: 'Directly linked to doctor digital prescriptions for 100% accurate medicine dispensing.',
  },
  {
    title: 'Emergency Home Care & Mobile Unit',
    category: 'Emergency',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    description: 'Equipped with mobile ECG, oxygen therapy, and real-time GPS telemetry for urgent home visits.',
  },
];

const CATEGORIES = [
  'OPD Rooms',
  'Waiting Lounge',
  'Diagnostics & Lab',
  'Procedure & OT',
  'Pharmacy',
  'Emergency',
  'Facilities',
];

const AdminSettingsPage = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'general' | 'letterhead'

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
    gallery: PRESET_GALLERY_IMAGES,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Add Photo Modal / Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'OPD Rooms',
    imageUrl: '',
    description: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data.clinicSettings) {
        setSettings({
          ...res.data.clinicSettings,
          gallery:
            res.data.clinicSettings.gallery && res.data.clinicSettings.gallery.length > 0
              ? res.data.clinicSettings.gallery
              : PRESET_GALLERY_IMAGES,
        });
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (customSettings = settings) => {
    setSaving(true);
    setMsg('');
    try {
      await API.put('/admin/settings', customSettings);
      showToast('Clinic configurations & gallery updated successfully!', 'success');
      setMsg('Clinic configurations & gallery updated successfully! Changes are live on the homepage.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Gallery handlers
  const handleAddPhoto = (e) => {
    e.preventDefault();
    if (!newPhoto.title || !newPhoto.imageUrl) {
      showToast('Please enter both Photo Title and Image URL', 'warning');
      return;
    }

    const updatedGallery = [
      ...settings.gallery,
      {
        ...newPhoto,
        _id: 'custom-' + Date.now(),
        isFeatured: true,
      },
    ];

    const updatedSettings = { ...settings, gallery: updatedGallery };
    setSettings(updatedSettings);
    setShowAddModal(false);
    setNewPhoto({ title: '', category: 'OPD Rooms', imageUrl: '', description: '' });

    // Persist immediately
    handleSaveSettings(updatedSettings);
  };

  const handleDeletePhoto = (index) => {
    if (!confirm('Are you sure you want to remove this photo from the homepage gallery?')) return;
    const updatedGallery = settings.gallery.filter((_, idx) => idx !== index);
    const updatedSettings = { ...settings, gallery: updatedGallery };
    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
  };

  const handleResetToPresets = () => {
    if (!confirm('Reset gallery to the 6 recommended high-definition clinic photos?')) return;
    const updatedSettings = { ...settings, gallery: PRESET_GALLERY_IMAGES };
    setSettings(updatedSettings);
    handleSaveSettings(updatedSettings);
  };

  const handleApplyPreset = (preset) => {
    setNewPhoto({
      title: preset.title,
      category: preset.category,
      imageUrl: preset.imageUrl,
      description: preset.description,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Clinic Control Center & Branding</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Admin Hub
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure clinic operating rules, digital letterhead, and landing page infrastructure gallery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSaveSettings()}
          disabled={saving}
          className="px-6 py-2.5 rounded-2xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {msg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1 shadow-inner max-w-xl">
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            activeTab === 'gallery'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-purple-600" />
          <span>Homepage Gallery ({settings.gallery?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            activeTab === 'general'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4 text-blue-600" />
          <span>Clinic Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('letterhead')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
            activeTab === 'letterhead'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Prescription & Policies</span>
        </button>
      </div>

      {/* TAB 1: GALLERY MANAGEMENT (THE NEW FEATURE) */}
      {activeTab === 'gallery' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Gallery Admin Info Banner */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200 bg-white/10 px-2.5 py-0.5 rounded-full inline-block">
                ⚡ Dynamic Client Showcase
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Homepage Facilities & Infrastructure Gallery
              </h2>
              <p className="text-xs text-purple-100 leading-relaxed">
                Photos added here appear live on the Clinic Landing Page with category filters and interactive full-screen preview.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 active:scale-95 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Facility Photo</span>
              </button>

              <button
                type="button"
                onClick={handleResetToPresets}
                className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                title="Restore default clinic photos"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Current Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {settings.gallery?.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition"
                      title="Open full image"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {item.description || 'Facility infrastructure showcase photo.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Live on Homepage
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Photo Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Add Facility Photo</h3>
                      <p className="text-[11px] text-slate-500">Add high-resolution image to homepage gallery</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick Presets Picker */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    ✨ Quick 1-Click Clinic Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_GALLERY_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-900 font-semibold text-slate-700 transition cursor-pointer"
                      >
                        {preset.category}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddPhoto} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={newPhoto.title}
                      onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                      placeholder="e.g. Modern Pediatric Consultation Room"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Facility Category</label>
                    <select
                      value={newPhoto.category}
                      onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                    <input
                      type="url"
                      required
                      value={newPhoto.imageUrl}
                      onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  {newPhoto.imageUrl && (
                    <div className="h-32 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                      <img
                        src={newPhoto.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = 'none')}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Description (Optional)</label>
                    <textarea
                      rows="2"
                      value={newPhoto.description}
                      onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                      placeholder="Brief note about the equipment or facility..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-95 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      Add to Live Gallery
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GENERAL CLINIC PROFILE */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in duration-200">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            Clinic Identity & Contact Information
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
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

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: LETTERHEAD & OPERATIONAL POLICIES */}
      {activeTab === 'letterhead' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Prescription Template */}
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
                <label className="block font-semibold text-slate-700 mb-1">
                  Prescription Medico-Legal Footer & Disclaimer
                </label>
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Operational Policies */}
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

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
            >
              {saving ? 'Saving...' : 'Save Prescription & Policies'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsPage;