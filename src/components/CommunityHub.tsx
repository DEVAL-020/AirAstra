'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommunityPod } from '@/types';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { 
  Users, 
  Car, 
  AlertTriangle, 
  Leaf, 
  MapPin, 
  ShieldCheck, 
  Plus, 
  Send, 
  CheckCircle2, 
  Sparkles,
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

  // GSAP animation for community counters
  useEffect(() => {
    if (co2Ref.current) {
      gsap.fromTo(
        co2Ref.current,
        { innerText: 0 },
        { innerText: 14680, duration: 2, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
    if (pmRef.current) {
      gsap.fromTo(
        pmRef.current,
        { innerText: 0 },
        { innerText: 68400, duration: 2.2, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation) return;
    setReportSubmitted(true);
    soundFX.playChime();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#10b981', '#38bdf8']
    });

    setTimeout(() => {
      setReportSubmitted(false);
      setReportDetails('');
    }, 4000);
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Collective Neighborhood Impact</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            BreatheTogether Community Action Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Individual choices amplify when coordinated as a neighborhood. Connect with local clean-air pods, coordinate carpooling, and alert wardens to open burning.
          </p>
        </div>

        <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-full font-mono">
          Live Community Pods: Active
        </span>
      </div>

      {/* GSAP Collective Counter Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Total Community CO₂ Prevented</span>
            <div className="text-3xl font-black font-mono text-emerald-300 mt-1 flex items-baseline">
              <span ref={co2Ref}>14,680</span> <span className="text-sm ml-1.5 font-normal text-slate-400">kg</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">Equivalent to planting 680 urban trees</span>
          </div>
          <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
            <Leaf className="w-8 h-8" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-slate-400">Ground PM2.5 Exhaust Avoided</span>
            <div className="text-3xl font-black font-mono text-cyan-300 mt-1 flex items-baseline">
              <span ref={pmRef}>68,400</span> <span className="text-sm ml-1.5 font-normal text-slate-400">grams</span>
            </div>
            <span className="text-[11px] text-cyan-400/80 mt-1 block">Spared from vulnerable children&apos;s lungs</span>
          </div>
          <div className="p-3 bg-cyan-500/20 rounded-2xl text-cyan-400">
            <TrendingDown className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Active Pods List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Active Neighborhood Pods
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
              {pods.length} pods
            </span>
          </h3>
          <button className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Pod</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pods.map((pod) => (
            <div
              key={pod.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-white text-sm">{pod.name}</h4>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    {pod.membersCount} members
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{pod.neighborhood}</span>
                </div>
                <p className="text-xs text-slate-300 mt-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                  &ldquo;{pod.recentReport}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Active Carpools: <strong className="text-white">{pod.activeCarpools}</strong></span>
                <button className="px-3 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] transition-all cursor-pointer">
                  Join Pod
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Air Warden Incident Reporting */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Community Air Warden Reporting</h3>
              <p className="text-[11px] text-slate-400">Report illicit open burning, diesel generator pollution, or uncovered construction dust to local pods.</p>
            </div>
          </div>
        </div>

        {reportSubmitted ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">Incident Dispatched to Municipal Air Pod & Wardens</strong>
              <span>Thank you for protecting your neighborhood&apos;s winter air!</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Violation Type:</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Open Biomass / Trash Burning">Open Biomass / Trash Burning</option>
                <option value="Industrial Diesel Generator Idling">Industrial Diesel Generator Idling</option>
                <option value="Uncovered Road Construction Dust">Uncovered Construction Dust Plume</option>
                <option value="Brick Kiln Black Smoke Surge">Brick Kiln Smoke Surge</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Location or Landmark:</label>
              <input
                type="text"
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
                placeholder="e.g. Ring Road Overpass, Sector 7"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg shadow-rose-900/40 cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Alert to Pod</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
