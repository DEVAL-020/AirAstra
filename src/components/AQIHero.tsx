'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AirQualityData } from '@/types';
import { SmogShaderCanvas } from './SmogShaderCanvas';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Sliders, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import gsap from 'gsap';

interface AQIHeroProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
}

export const AQIHero: React.FC<AQIHeroProps> = ({ airData, onOpenPurifier3D, onOpenEmergency }) => {
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);
  const aqiCounterRef = useRef<HTMLSpanElement>(null);
  const pm25CounterRef = useRef<HTMLSpanElement>(null);

  // GSAP roll-up counter effect whenever AQI updates
  useEffect(() => {
    if (aqiCounterRef.current) {
      gsap.fromTo(
        aqiCounterRef.current,
        { innerText: 0 },
        {
          innerText: airData.aqi,
          duration: 1.6,
          snap: { innerText: 1 },
          ease: 'power3.out'
        }
      );
    }
    if (pm25CounterRef.current) {
      gsap.fromTo(
        pm25CounterRef.current,
        { innerText: 0 },
        {
          innerText: airData.pm25,
          duration: 1.4,
          snap: { innerText: 1 },
          ease: 'power2.out'
        }
      );
    }
  }, [airData.aqi, airData.pm25]);

  const getCategoryTheme = (category: AirQualityData['category']) => {
    switch (category) {
      case 'Hazardous':
        return {
          bg: 'bg-purple-950/40 border-purple-500/50 text-purple-300',
          badge: 'bg-purple-600/30 text-purple-200 border-purple-500/40',
          glow: 'shadow-purple-900/40',
          gradient: 'from-purple-900/50 to-rose-950/50'
        };
      case 'Very Poor':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
          badge: 'bg-rose-600/30 text-rose-200 border-rose-500/40',
          glow: 'shadow-rose-900/40',
          gradient: 'from-rose-950/60 to-red-900/40'
        };
      case 'Unhealthy':
        return {
          bg: 'bg-orange-950/40 border-orange-500/50 text-orange-300',
          badge: 'bg-orange-600/30 text-orange-200 border-orange-500/40',
          glow: 'shadow-orange-900/40',
          gradient: 'from-orange-950/60 to-amber-950/40'
        };
      case 'Unhealthy for Sensitive':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
          badge: 'bg-amber-600/30 text-amber-200 border-amber-500/40',
          glow: 'shadow-amber-900/40',
          gradient: 'from-amber-950/50 to-emerald-950/30'
        };
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300',
          badge: 'bg-emerald-600/30 text-emerald-200 border-emerald-500/40',
          glow: 'shadow-emerald-900/40',
          gradient: 'from-emerald-950/50 to-teal-950/40'
        };
    }
  };

  const theme = getCategoryTheme(airData.category);
  const selectedHourly = airData.hourlyForecast[selectedHourIndex] || airData.hourlyForecast[0];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden glass-panel border border-emerald-500/20 p-6 md:p-8 space-y-8">
      {/* Top Banner Alert (Matches prompt mockup: "Air Quality Very Poor (AQI 312)") */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
              Live Urban Inversion Monitor • {airData.city}, {airData.country}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
            AirAstra
            <span className="text-xs font-normal px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              Winter Smog OS
            </span>
          </h1>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPurifier3D}
            className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-102 shadow-lg shadow-emerald-950/30 cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3D Purifier Simulator</span>
          </button>

          {airData.aqi > 200 && (
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all animate-pulse hover:scale-102 cursor-pointer shadow-lg shadow-rose-950/50"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Smog Lockdown Protocol</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Big Metric + Right 3D GLSL Inversion Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Air Quality Dial & Severe Warning Card */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          {/* Mockup Card: Primary AQI Readout */}
          <div className={`p-6 rounded-3xl border transition-all ${theme.bg} ${theme.glow} shadow-xl relative overflow-hidden`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Outdoor Air Status</span>
                <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
                  {airData.category}
                </h2>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 font-mono">US EPA AQI</span>
                <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white flex items-baseline">
                  <span ref={aqiCounterRef}>{airData.aqi}</span>
                </span>
              </div>
            </div>

            {/* PM2.5 Microgram Readout & WHO Comparison */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Ground PM2.5:</span>
                <span className="ml-2 font-mono font-bold text-white text-sm">
                  <span ref={pm25CounterRef}>{airData.pm25}</span> µg/m³
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-black/40 text-rose-300 font-mono text-[11px] border border-rose-500/20">
                {Math.round(airData.pm25 / 15)}x WHO Annual Limit
              </span>
            </div>

            {/* Inversion Mechanism Badge */}
            <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center space-x-3 text-xs text-slate-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="leading-snug">
                <strong className="text-white">Winter Thermal Inversion: </strong>
                <span className="text-amber-300 font-semibold">{airData.inversionStrength}</span>. Cold ground layer traps vehicular & biomass soot.
              </div>
            </div>
          </div>

          {/* Environmental Gauges Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/10 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ambient</span>
              </div>
              <span className="text-lg font-bold font-mono text-white mt-2">{airData.temperature}°C</span>
              <span className="text-[10px] text-slate-500">Surface cold lake</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/10 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Humidity</span>
              </div>
              <span className="text-lg font-bold font-mono text-white mt-2">{airData.humidity}%</span>
              <span className="text-[10px] text-slate-500">Aerosol suspension</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-emerald-500/10 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind Speed</span>
              </div>
              <span className="text-lg font-bold font-mono text-white mt-2">{airData.windSpeed} km/h</span>
              <span className="text-[10px] text-slate-500">Stagnation zone</span>
            </div>
          </div>
        </div>

        {/* Right Column: Three.js + GLSL Particle Inversion Simulation */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/70 border border-emerald-500/20 rounded-3xl p-5 relative overflow-hidden min-h-[340px]">
          <SmogShaderCanvas aqi={airData.aqi} inversionStrength={airData.inversionStrength} />

          {/* Ventilation Window Callout Banner */}
          <div className="mt-4 p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-emerald-400 font-semibold uppercase tracking-wider text-[11px] block">
                  Optimal Home Ventilation Window
                </span>
                <span className="text-white text-sm font-bold font-mono">
                  {airData.ventilationSafeWindow}
                </span>
              </div>
            </div>
            <span className="hidden sm:inline-block text-[11px] text-emerald-300/80 bg-black/40 px-2.5 py-1 rounded-lg">
              Thermal updrafts dilute PM2.5 by ~45%
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour Diurnal Inversion Scrubber (Interactive Timeline) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            24-Hour Diurnal Smog & Inversion Trapping Forecast
          </span>
          <span className="text-slate-400 text-[11px]">
            Selected: <strong className="text-emerald-400 font-mono">{selectedHourly.hour}</strong> (Predicted AQI: {selectedHourly.aqi})
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {airData.hourlyForecast.map((item, idx) => {
            const isTrapped = item.inversionTrapped;
            const isSelected = idx === selectedHourIndex;

            return (
              <button
                key={item.hour + idx}
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border transition-all cursor-pointer min-w-[78px] text-center ${
                  isSelected
                    ? 'bg-emerald-500/25 border-emerald-400 shadow-lg shadow-emerald-950/50 scale-105'
                    : isTrapped
                    ? 'bg-rose-950/20 border-rose-500/25 hover:bg-rose-950/30 text-rose-300'
                    : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <span className="text-[11px] font-mono text-slate-400">{item.hour}</span>
                <span className={`text-base font-bold font-mono my-1 ${
                  item.aqi > 250 ? 'text-rose-400' : item.aqi > 150 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.aqi}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{item.temperature}°</span>
                {isTrapped && (
                  <span className="mt-1 text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-semibold">
                    Inversion
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
