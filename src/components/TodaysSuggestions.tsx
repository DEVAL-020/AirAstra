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
  Heart
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
      badge: 'Interactive 3D CAD'
    },
    {
      id: 'mask',
      title: 'Wear an N95 mask outdoors',
      caption: 'Pinch metal clip tightly across nasal bridge',
      icon: ShieldCheck,
      action: onOpenEmergency,
      badge: 'Essential'
    },
    {
      id: 'ventilation',
      title: `Ventilate during ${airData.ventilationSafeWindow}`,
      caption: 'Open cross-breeze windows for 15 mins during thermal lift',
      icon: Clock,
      action: () => onSelectTab('routine'),
      badge: 'Midday Window'
    },
    {
      id: 'humidity',
      title: 'Hang damp towel near room heater',
      caption: 'Binds dry airborne soot and increases particle settling',
      icon: Droplet,
      action: () => onSelectTab('hacks'),
      badge: 'Zero-Cost Hack'
    }
  ];

  return (
    <div className="weather-card p-5 sm:p-6 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">
            Health & Clean Air Recommendations
          </h3>
        </div>
        <span className="text-[11px] text-white/40">
          Tailored for {airData.city}
        </span>
      </div>

      {/* Prominent Red Banner from Contest Image 2 */}
      <div
        onClick={onOpenEmergency}
        role="button"
        tabIndex={0}
        className={`p-4 rounded-xl cursor-pointer transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-between gap-4 border ${
          airData.aqi > 300
            ? 'bg-rose-950/70 border-rose-500/40 text-rose-100'
            : airData.aqi > 200
            ? 'bg-[#48141d] border-rose-500/30 text-rose-100'
            : airData.aqi > 150
            ? 'bg-amber-950/60 border-amber-500/30 text-amber-100'
            : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-100'
        }`}
      >
        <div className="space-y-0.5">
          <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75 block">
            Air Quality Status
          </span>
          <div className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{airData.category} (AQI {airData.aqi})</span>
          </div>
          <p className="text-xs opacity-80 leading-snug">
            Cold winter temperature inversion active. Tap to view the emergency checklist.
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* "Today's Suggestions" Section */}
      <div className="space-y-2.5 pt-1">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block">
          Today&apos;s Suggestions
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {suggestions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={item.action}
                role="button"
                tabIndex={0}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-white truncate block">
                      {item.title}
                    </span>
                    <p className="text-[11px] text-white/50 truncate mt-0.5">
                      {item.caption}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0 text-white/40">
                  <span className="hidden lg:inline text-[10px] text-white/60 bg-white/10 px-2 py-0.5 rounded">
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
