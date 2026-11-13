import React from 'react';
import { Activity, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Clinic Intro */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                My<span className="text-emerald-400">Clinic</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Digital Clinic Management Platform providing automated doctor appointment scheduling, digital prescriptions, emergency home visits, and centralized staff administration.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              HIPAA Compliant & Secure Records
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Patient Services</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/doctors" className="hover:text-emerald-400 transition">Find Specialists & Timings</a></li>
              <li><a href="/emergency" className="hover:text-emerald-400 transition text-rose-400 font-medium">Emergency Home Visit Request</a></li>
              <li><a href="/patient/appointments" className="hover:text-emerald-400 transition">Online Slot Booking</a></li>
              <li><a href="/patient/prescriptions" className="hover:text-emerald-400 transition">Digital Prescriptions & Reports</a></li>
            </ul>
          </div>

          {/* Clinic Timings */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Clinic Hours</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon – Sat: 08:00 AM – 09:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sunday: 09:00 AM – 02:00 PM (Emergency)</span>
              </li>
              <li className="text-[11px] text-emerald-400 pt-1 font-semibold">
                🚨 24/7 On-Call Doctor Emergency Visits
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Clinic Contact</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Healthcare Enclave, Outer Ring Road, New Delhi</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>OPD: +91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-rose-300 font-semibold">Emergency: +91 98765 00100</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>care@myclinic.health</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} My Clinic Healthcare System. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Tech Stack: MERN (MongoDB, Express, React, Node.js)</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
