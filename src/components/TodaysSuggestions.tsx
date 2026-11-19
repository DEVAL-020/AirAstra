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
  Info
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
      caption: airData.aqi > 200 ? 'Run continuously on medium or high speed' : 'Run on eco/auto mode',
      icon: Wind,
      action: onOpenPurifier3D,
      badge: 'Interactive 3D'
    },
    {
      id: 'mask',
      title: 'Wear an N95 mask outside',
      caption: 'Pinch metal clip tightly to bridge of nose',
      icon: ShieldCheck,
      action: onOpenEmergency,
      badge: 'Doctor Recommended'
    },
    {
      id: 'ventilation',
      title: `Ventilate house during ${airData.ventilationSafeWindow}`,
      caption: 'Open cross-breeze windows for 15 mins while sun is warmest',
      icon: Clock,
      action: () => onSelectTab('routine'),
      badge: 'Low Smog Window'
    },
    {
      id: 'humidity',
      title: 'Hang damp towel near room heater',
      caption: 'Moist air binds tiny airborne dust and helps it settle',
      icon: Droplet,
      action: () => onSelectTab('hacks'),
      badge: 'Zero-Cost Hack'
    }
  ];

  return (
    <div className="w-full bg-[#0d1e17] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
      {/* Header with clean leaf brand and human subtitle */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Urban Air Quality Assistant
            </h3>
            <p className="text-xs text-slate-400">
              Personalized guidance for {airData.city} • Updated {airData.timestamp}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Station monitor verified</span>
        </div>
      </div>

      {/* Primary Severity Card (Exact visual counterpart to Screenshot 2) */}
      <div
        onClick={onOpenEmergency}
        role="button"
        tabIndex={0}
        className={`p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.008] active:scale-[0.995] shadow-lg flex items-center justify-between gap-4 border ${
          airData.aqi > 300
            ? 'bg-[#5c1322] hover:bg-[#6b1628] border-red-500/40 text-rose-100 shadow-rose-950/40'
            : airData.aqi > 200
            ? 'bg-[#50131e] hover:bg-[#5f1725] border-rose-500/35 text-rose-100 shadow-rose-950/30'
            : airData.aqi > 150
            ? 'bg-[#4d240d] hover:bg-[#5c2b0f] border-amber-500/40 text-amber-100'
            : 'bg-[#133826] hover:bg-[#18442e] border-emerald-500/35 text-emerald-100'
        }`}
      >
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
            Air Quality
          </span>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-baseline gap-2">
            <span>{airData.category}</span>
            <span className="text-base sm:text-lg font-normal opacity-90 font-mono">(AQI {airData.aqi})</span>
          </div>
          <p className="text-xs opacity-85 leading-snug pt-0.5">
            Ground-level cold smog is trapping traffic soot. Tap to view the family protection checklist.
          </p>
        </div>

        <div className="w-9 h-9 rounded-full bg-black/25 border border-white/10 flex items-center justify-center text-white/90 shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      {/* "Today's Suggestions" Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Today&apos;s Suggestions
          </h4>
          <span className="text-[11px] text-slate-400">
            Based on current {airData.city} weather
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={item.action}
                role="button"
                tabIndex={0}
                className="group p-4 rounded-2xl bg-[#12241c] hover:bg-[#183126] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#1a382a] border border-emerald-500/25 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className="hidden lg:inline-block text-[10px] font-medium text-emerald-400/90 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                    {item.badge}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-white/5 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
