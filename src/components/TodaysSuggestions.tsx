'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { 
  Wind, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Droplet, 
  Sparkles,
  AlertOctagon,
  Layers
} from 'lucide-react';

interface TodaysSuggestionsProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
  onSelectTab: (tab: 'routine' | 'hacks' | 'vision' | 'chat') => void;
}

export const TodaysSuggestions: React.FC<TodaysSuggestionsProps> = ({
  airData,
  onOpenPurifier3D,
  onOpenEmergency,
  onSelectTab
}) => {
  const suggestions = [
    {
      id: 'purifier',
      title: 'Use an air purifier',
      subtitle: airData.aqi > 250 ? 'Run continuous on High (Corsi-Rosenthal or HEPA)' : 'Run on Low/Auto mode',
      icon: Wind,
      badge: 'Immediate Impact',
      action: onOpenPurifier3D,
      highlight: true
    },
    {
      id: 'mask',
      title: 'Wear an N95 certified mask outdoors',
      subtitle: 'Cloth & surgical masks leak 80% of fine PM2.5',
      icon: ShieldCheck,
      badge: 'Required',
      action: onOpenEmergency,
      highlight: airData.aqi > 200
    },
    {
      id: 'ventilation',
      title: `Ventilate only during ${airData.ventilationSafeWindow}`,
      subtitle: 'Midday thermal updrafts disperse ground inversion',
      icon: Clock,
      badge: '15-min Window',
      action: () => onSelectTab('routine'),
      highlight: false
    },
    {
      id: 'hack',
      title: 'Drape wet microfiber towel over radiator',
      subtitle: 'Binds dry airborne soot and increases deposition',
      icon: Droplet,
      badge: 'DIY Hack',
      action: () => onSelectTab('hacks'),
      highlight: false
    }
  ];

  return (
    <div className="w-full bg-[#0a1813] border border-emerald-500/25 rounded-3xl p-5 md:p-6 shadow-2xl space-y-4">
      {/* Title & Brand from Screenshot */}
      <div className="flex items-center justify-between border-b border-emerald-500/15 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <span className="text-sm">🍃</span>
          </div>
          <div>
            <h3 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              Urban Air Quality Assistant
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Location: {airData.city}</span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Live AI Guidance
        </span>
      </div>

      {/* Prominent Red Banner matching Screenshot: "Air Quality Very Poor (AQI 312) >" */}
      <div
        onClick={onOpenEmergency}
        className={`p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex items-center justify-between border ${
          airData.aqi > 300
            ? 'bg-[#4c0d1b] border-rose-500/50 hover:bg-[#5c1021] text-rose-100 shadow-rose-950/50'
            : airData.aqi > 200
            ? 'bg-[#4a121a] border-rose-500/40 hover:bg-[#5a1721] text-rose-100 shadow-rose-950/40'
            : 'bg-[#1b3d2b] border-emerald-500/40 text-emerald-100'
        }`}
      >
        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider text-rose-200/80 font-semibold block">
            Air Quality
          </span>
          <div className="text-base md:text-lg font-black text-white flex items-center gap-2">
            <span>{airData.category} (AQI {airData.aqi})</span>
          </div>
          <span className="text-[11px] text-rose-200/70 block">
            Ground Inversion Active • Tap for Emergency Lockdown Checklist
          </span>
        </div>

        <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-white/90">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* Section Title matching Screenshot: "Today's Suggestions" */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
          Today&apos;s Suggestions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={item.action}
                className="group p-3.5 rounded-2xl bg-[#0f241c]/90 hover:bg-[#153327] border border-emerald-500/20 hover:border-emerald-400/40 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs md:text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 text-slate-400 group-hover:text-emerald-300 transition-colors">
                  <span className="hidden md:inline text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-emerald-400">
                    {item.badge}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
