'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommunityPod } from '@/types';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { 
  Users, 
  AlertTriangle, 
  Leaf, 
  MapPin, 
  Plus, 
  Send, 
  CheckCircle2, 
  TrendingDown
} from 'lucide-react';

export const CommunityHub: React.FC = () => {
  const co2Ref = useRef<HTMLSpanElement>(null);
  const pmRef = useRef<HTMLSpanElement>(null);

  const [pods, setPods] = useState<CommunityPod[]>([
    {
      id: 'p1',
      name: 'Oakridge School Bus & EV Pool',
      neighborhood: 'North Sector • 3.2km radius',
      membersCount: 24,
      co2SavedKg: 1840,
      pm25AvoidedGrams: 8200,
      activeCarpools: 6,
      recentReport: '4 diesel vans replaced with shared electric transit for morning school run.'
    },
    {
      id: 'p2',
      name: 'Downtown Tech Campus Micro-Transit',
      neighborhood: 'Metro Corridor • Tech Zone',
      membersCount: 58,
      co2SavedKg: 4620,
      pm25AvoidedGrams: 21500,
      activeCarpools: 14,
      recentReport: '100% compliance with carpool lane off-peak commuting during inversion hours.'
    },
    {
      id: 'p3',
      name: 'Greenway Senior Health Walking Pod',
      neighborhood: 'East Lake Community Center',
      membersCount: 31,
      co2SavedKg: 620,
      pm25AvoidedGrams: 3400,
      activeCarpools: 2,
      recentReport: 'Shifted all morning walks to the HEPA-purified community indoor gym.'
    }
  ]);

  const [reportType, setReportType] = useState('Open Biomass / Trash Burning');
  const [reportLocation, setReportLocation] = useState('Sector 4 Near Ring Road');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (co2Ref.current) {
      gsap.fromTo(
        co2Ref.current,
        { innerText: 0 },
        { innerText: 14680, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
    if (pmRef.current) {
      gsap.fromTo(
        pmRef.current,
        { innerText: 0 },
        { innerText: 68400, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation) return;
    setReportSubmitted(true);
    soundFX.playChime();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#38bdf8']
    });

    setTimeout(() => {
      setReportSubmitted(false);
      setReportDetails('');
    }, 4000);
  };

  return (
    <div className="w-full bg-[#0b1813] rounded-3xl p-5 sm:p-7 border border-white/10 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Civic Action & Neighborhood Clean Air</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            BreatheTogether Community Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Individual changes amplify when coordinated across apartment complexes and school communities. Join local clean-air pods, share rides, and report open burning.
          </p>
        </div>

        <span className="text-xs bg-[#10221a] text-emerald-300 border border-white/10 px-3 py-1.5 rounded-full font-medium">
          3 Verified Pods in Your Area
        </span>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#10221a] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Community CO₂ Prevented</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-300 mt-1 flex items-baseline">
              <span ref={co2Ref}>14,680</span> <span className="text-xs ml-1 font-normal text-slate-400">kg</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Equivalent to 680 mature urban trees</span>
          </div>
          <div className="p-3 bg-[#152e22] rounded-2xl text-emerald-400">
            <Leaf className="w-7 h-7" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#10221a] border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Ground PM2.5 Soot Avoided</span>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-300 mt-1 flex items-baseline">
              <span ref={pmRef}>68,400</span> <span className="text-xs ml-1 font-normal text-slate-400">grams</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Spared from neighborhood children&apos;s lungs</span>
          </div>
          <div className="p-3 bg-[#152e22] rounded-2xl text-cyan-400">
            <TrendingDown className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Pods Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            Active Neighborhood Pods
          </h3>
          <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Pod</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {pods.map((pod) => (
            <div
              key={pod.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#10221a] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{pod.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {pod.membersCount} members
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pod.neighborhood}</span>
                </div>
                <p className="text-xs text-slate-300 mt-2.5 bg-black/25 p-2.5 rounded-xl border border-white/5 leading-relaxed">
                  &ldquo;{pod.recentReport}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Carpools: <strong className="text-white">{pod.activeCarpools}</strong></span>
                <button className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[11px] transition-all cursor-pointer">
                  Join Pod
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Reporting */}
      <div className="p-5 rounded-2xl bg-[#171314] border border-red-500/25 space-y-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-red-500/15 text-red-400 rounded-xl">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Community Air Warden Alert</h3>
            <p className="text-[11px] text-slate-400">Report illicit waste burning or idling diesel equipment to neighborhood wardens.</p>
          </div>
        </div>

        {reportSubmitted ? (
          <div className="p-3.5 rounded-xl bg-[#13291d] border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">Alert Notified to Wardens</strong>
              <span>Thank you for watching out for neighborhood clean air.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Issue Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 text-xs"
              >
                <option value="Open Biomass / Trash Burning">Open Biomass / Trash Burning</option>
                <option value="Industrial Diesel Generator Idling">Diesel Generator Idling</option>
                <option value="Uncovered Road Construction Dust">Uncovered Construction Dust</option>
                <option value="Brick Kiln Black Smoke Surge">Brick Kiln Smoke Surge</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Location / Landmark:</label>
              <input
                type="text"
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
                placeholder="e.g. Ring Road Overpass, Sector 7"
                className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-red-500 text-xs"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
