'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { 
  Clock, 
  AlertTriangle, 
  Sun, 
  CloudFog, 
  Moon, 
  Wind,
  ShieldAlert,
  Layers
} from 'lucide-react';

interface WeatherHeroProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
}

export const WeatherHero: React.FC<WeatherHeroProps> = ({
  airData,
  onOpenPurifier3D,
  onOpenEmergency
}) => {
  const getCategoryColor = (aqi: number) => {
    if (aqi > 300) return 'text-purple-400';
    if (aqi > 200) return 'text-rose-400';
    if (aqi > 150) return 'text-orange-400';
    if (aqi > 100) return 'text-amber-400';
    if (aqi > 50) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  const getAqiDotBg = (aqi: number) => {
    if (aqi > 300) return 'bg-purple-500';
    if (aqi > 200) return 'bg-rose-500';
    if (aqi > 150) return 'bg-orange-500';
    if (aqi > 100) return 'bg-amber-500';
    return 'bg-emerald-400';
  };

  // Find max & min predicted AQI for the day
  const aqiList = airData.hourlyForecast.map(h => h.aqi);
  const maxAqi = Math.max(...aqiList, airData.aqi);
  const minAqi = Math.min(...aqiList, airData.aqi);

  return (
    <div className="w-full space-y-6 pt-2 pb-4">
      {/* Apple Weather Style Centered Hero Header */}
      <div className="text-center space-y-1.5 py-4">
        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-white/90">
          {airData.city}
        </h1>

        {/* Big Apple Weather Style Number */}
        <div className="flex items-center justify-center">
          <span className="text-7xl sm:text-8xl font-extralight tracking-tighter text-white font-mono">
            {airData.aqi}
          </span>
        </div>

        {/* Condition Text */}
        <div className="space-y-0.5">
          <p className={`text-lg sm:text-xl font-medium tracking-tight ${getCategoryColor(airData.aqi)}`}>
            {airData.category} Air Quality
          </p>
          <p className="text-xs sm:text-sm text-white/60">
            H: {maxAqi} • L: {minAqi} • Ground PM2.5: <span className="font-mono text-white/80">{airData.pm25} µg/m³</span>
          </p>
        </div>

        {/* Minimalist Action Buttons */}
        <div className="pt-3 flex items-center justify-center gap-2.5">
          <button
            onClick={onOpenPurifier3D}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D Air Filter CAD</span>
          </button>

          {airData.aqi > 200 && (
            <button
              onClick={onOpenEmergency}
              className="px-3.5 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-medium border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Smog Advisory</span>
            </button>
          )}
        </div>
      </div>

      {/* Hourly Air Quality Weather Strip (Apple Weather Style) */}
      <div className="weather-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/50 font-semibold border-b border-white/5 pb-2.5">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-white/60" />
            <span>Hourly Smog & Inversion Forecast</span>
          </div>
          <span className="text-white/40 normal-case">
            Safe ventilation window: <strong className="text-emerald-400 font-mono font-normal">{airData.ventilationSafeWindow}</strong>
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {airData.hourlyForecast.map((hour, idx) => {
            const isNow = idx === 0;
            const hourNum = parseInt(hour.hour.split(':')[0]);
            const isNight = hourNum < 6 || hourNum > 18;

            return (
              <div
                key={hour.hour + idx}
                className="flex-shrink-0 flex flex-col items-center justify-between min-w-[56px] space-y-2 text-center"
              >
                <span className="text-xs text-white/70 font-medium">
                  {isNow ? 'Now' : hour.hour.replace(':00', '')}
                </span>

                {/* Weather icon */}
                <div className="text-white/80 my-0.5">
                  {hour.inversionTrapped ? (
                    <CloudFog className="w-4 h-4 text-rose-300/80" />
                  ) : isNight ? (
                    <Moon className="w-4 h-4 text-slate-300" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-300" />
                  )}
                </div>

                {/* AQI Pill */}
                <div className="flex flex-col items-center space-y-1">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: hour.aqi > 250 ? '#f43f5e' : hour.aqi > 150 ? '#f97316' : '#10b981' }} />
                  <span className="text-xs font-mono font-semibold text-white/90">
                    {hour.aqi}
                  </span>
                </div>

                <span className="text-[11px] text-white/45 font-mono">
                  {hour.temperature}°
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
