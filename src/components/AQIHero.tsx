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
  Layers,
  ChevronRight,
  Info
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

  useEffect(() => {
    if (aqiCounterRef.current) {
      gsap.fromTo(
        aqiCounterRef.current,
        { innerText: 0 },
        {
          innerText: airData.aqi,
          duration: 1.4,
          snap: { innerText: 1 },
          ease: 'power2.out'
        }
      );
    }
    if (pm25CounterRef.current) {
      gsap.fromTo(
        pm25CounterRef.current,
        { innerText: 0 },
        {
          innerText: airData.pm25,
          duration: 1.2,
          snap: { innerText: 1 },
          ease: 'power2.out'
        }
      );
    }
  }, [airData.aqi, airData.pm25]);

  const getCategoryStyles = (category: AirQualityData['category']) => {
    switch (category) {
      case 'Hazardous':
      case 'Very Poor':
        return {
          card: 'bg-[#3b121b] border-red-500/35 text-rose-100',
          badge: 'bg-red-500/20 text-red-300 border-red-500/30',
          indicator: 'bg-red-500'
        };
      case 'Unhealthy':
      case 'Unhealthy for Sensitive':
        return {
          card: 'bg-[#3d2410] border-amber-500/35 text-amber-100',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          indicator: 'bg-amber-400'
        };
      default:
        return {
          card: 'bg-[#122e21] border-emerald-500/35 text-emerald-100',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          indicator: 'bg-emerald-400'
        };
    }
  };

  const styles = getCategoryStyles(airData.category);
  const selectedHourly = airData.hourlyForecast[selectedHourIndex] || airData.hourlyForecast[0];

  return (
    <div className="relative w-full rounded-3xl bg-[#0b1813] border border-white/10 p-5 sm:p-7 space-y-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Ground Station Telemetry • {airData.city}, {airData.country}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            AirAstra
            <span className="text-xs font-normal px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
              Winter Smog Operations
            </span>
          </h1>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenPurifier3D}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#142e22] hover:bg-[#1a3d2e] border border-emerald-500/30 text-emerald-300 text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>3D Filter Mechanics CAD</span>
          </button>

          {airData.aqi > 200 && (
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Smog Lockdown Protocol</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Vital Air Readouts + Right 3D Atmospheric Inversion Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Air Status Card & Gauges */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Main Air Quality Scorecard */}
          <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${styles.card} shadow-md space-y-4`}>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider opacity-75">
                  Outdoor Atmosphere
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  {airData.category}
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] opacity-75 font-mono block">US EPA AQI</span>
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  <span ref={aqiCounterRef}>{airData.aqi}</span>
                </span>
              </div>
            </div>

            {/* PM2.5 & Health Benchmark */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="opacity-75">Fine PM2.5:</span>
                <span className="ml-1.5 font-mono font-bold text-white text-sm">
                  <span ref={pm25CounterRef}>{airData.pm25}</span> µg/m³
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black/30 text-rose-200 font-mono text-[11px] border border-white/10">
                {Math.round(airData.pm25 / 15)}x WHO Limit
              </span>
            </div>

            {/* Inversion Cause Card */}
            <div className="p-3 rounded-xl bg-black/35 border border-white/10 flex items-start space-x-2.5 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-white">Winter Thermal Inversion: </span>
                <span className="text-amber-200">{airData.inversionStrength}</span>. Cold surface air cannot rise, holding vehicular soot and wood smoke inside city boundaries.
              </div>
            </div>
          </div>

          {/* Tri-Gauge Weather Stats */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#0f221a] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                <span>Temp</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1.5">{airData.temperature}°C</span>
              <span className="text-[10px] text-slate-500">Surface cold lake</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0f221a] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                <span>Humidity</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1.5">{airData.humidity}%</span>
              <span className="text-[10px] text-slate-500">Aerosol suspension</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#0f221a] border border-white/5 flex flex-col justify-between">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind</span>
              </div>
              <span className="text-base font-bold font-mono text-white mt-1.5">{airData.windSpeed} km/h</span>
              <span className="text-[10px] text-slate-500">Calm stagnation</span>
            </div>
          </div>
        </div>

        {/* Right Column: Three.js + GLSL Particle Inversion Simulator */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#08120d] border border-white/10 rounded-2xl p-4 sm:p-5 relative overflow-hidden min-h-[300px]">
          <SmogShaderCanvas aqi={airData.aqi} inversionStrength={airData.inversionStrength} />

          {/* Safe Ventilation Window Callout */}
          <div className="mt-3 p-3.5 rounded-xl bg-[#11271e] border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-300 block text-[11px]">Safe Home Ventilation Window Today:</span>
                <span className="text-emerald-300 font-bold font-mono text-xs">{airData.ventilationSafeWindow}</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 bg-black/30 px-2.5 py-1 rounded-lg self-start sm:self-auto border border-white/5">
              Sun lifts the smog lid by ~45%
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour Diurnal Timeline */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            24-Hour Smog Inversion Curve (Hourly Forecast)
          </span>
          <span className="text-slate-400 text-[11px]">
            Selected: <strong className="text-emerald-300 font-mono">{selectedHourly.hour}</strong> (Predicted AQI: {selectedHourly.aqi})
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {airData.hourlyForecast.map((item, idx) => {
            const isTrapped = item.inversionTrapped;
            const isSelected = idx === selectedHourIndex;

            return (
              <button
                key={item.hour + idx}
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex-shrink-0 flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer min-w-[74px] text-center ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-400 text-white'
                    : isTrapped
                    ? 'bg-red-950/20 border-red-500/25 hover:bg-red-950/30 text-rose-200'
                    : 'bg-[#0f221a] border-white/5 hover:bg-[#142e22] text-slate-300'
                }`}
              >
                <span className="text-[11px] font-mono text-slate-400">{item.hour}</span>
                <span className={`text-sm font-bold font-mono my-0.5 ${
                  item.aqi > 250 ? 'text-rose-400' : item.aqi > 150 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.aqi}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{item.temperature}°</span>
                {isTrapped && (
                  <span className="mt-1 text-[9px] bg-red-500/20 text-rose-300 px-1 py-0.2 rounded font-semibold">
                    Trap Peak
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
