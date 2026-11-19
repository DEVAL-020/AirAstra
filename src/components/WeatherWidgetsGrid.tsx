'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { SmogShaderCanvas } from './SmogShaderCanvas';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Thermometer, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface WeatherWidgetsGridProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
}

export const WeatherWidgetsGrid: React.FC<WeatherWidgetsGridProps> = ({
  airData,
  onOpenPurifier3D
}) => {
  // Calculate percentage on EPA 0 - 500 scale
  const scalePercent = Math.min(Math.max((airData.aqi / 500) * 100, 2), 98);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Widget 1: Air Quality Index & Pollutant Breakdown */}
      <div className="weather-card p-5 flex flex-col justify-between space-y-4 lg:col-span-1">
        <div className="space-y-3">
          <div className="flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-white/50 font-semibold">
            <Gauge className="w-3.5 h-3.5 text-white/60" />
            <span>Air Quality Index</span>
          </div>

          <div>
            <span className="text-3xl font-light tracking-tight text-white font-mono">
              {airData.aqi}
            </span>
            <span className="text-xs text-white/60 ml-2 font-medium">
              • {airData.category}
            </span>
          </div>

          {/* Clean Apple Weather Style Gradient Scale Bar */}
          <div className="space-y-1.5">
            <div className="relative h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="absolute inset-0 h-full w-full rounded-full"
                style={{
                  background: 'linear-gradient(to right, #10b981 0%, #eab308 20%, #f97316 40%, #ef4444 60%, #8b5cf6 80%, #581c87 100%)'
                }}
              />
            </div>
            {/* Indicator pin */}
            <div className="relative w-full h-2">
              <div 
                className="absolute top-0 -ml-1.5 w-3 h-3 bg-white rounded-full shadow-md border border-black/30 transition-all duration-300"
                style={{ left: `${scalePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detailed Pollutants Table */}
        <div className="pt-3 border-t border-white/5 space-y-2 text-xs">
          <div className="flex justify-between text-white/70">
            <span>PM2.5 (Fine particulate)</span>
            <span className="font-mono text-white font-medium">{airData.pm25} µg/m³</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>PM10 (Coarse dust)</span>
            <span className="font-mono text-white font-medium">{airData.pm10} µg/m³</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Nitrogen Dioxide (NO₂)</span>
            <span className="font-mono text-white font-medium">{airData.no2} µg/m³</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Ozone (O₃)</span>
            <span className="font-mono text-white font-medium">{airData.o3} µg/m³</span>
          </div>
        </div>
      </div>

      {/* Widget 2: 3D Atmospheric Inversion Simulation */}
      <div className="weather-card p-5 flex flex-col justify-between space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-white/60" />
            <span>Atmospheric Inversion Simulation</span>
          </div>
          <span className="text-white/40 font-mono normal-case">
            Boundary Height ~180m
          </span>
        </div>

        {/* Embedded clean Three.js canvas */}
        <div className="relative flex-1 min-h-[170px] rounded-xl overflow-hidden bg-black/20 border border-white/5">
          <SmogShaderCanvas aqi={airData.aqi} inversionStrength={airData.inversionStrength} />
        </div>

        <p className="text-xs text-white/60 leading-relaxed pt-1">
          Cold winter surface air is trapped beneath a warmer atmospheric layer. Trapped particulates cannot disperse until the afternoon solar heating cycle.
        </p>
      </div>

      {/* Widget 3: Wind & Aerosol Stagnation */}
      <div className="weather-card p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          <Wind className="w-3.5 h-3.5 text-white/60" />
          <span>Wind & Movement</span>
        </div>

        <div>
          <span className="text-3xl font-light tracking-tight text-white font-mono">
            {airData.windSpeed}
          </span>
          <span className="text-xs text-white/60 ml-1.5 font-medium">
            km/h • NW
          </span>
        </div>

        <div className="pt-2 border-t border-white/5 text-xs text-white/65 leading-relaxed">
          Calm wind speed is causing localized smoke stagnation over neighborhoods.
        </div>
      </div>

      {/* Widget 4: Humidity & Aerosol Suspension */}
      <div className="weather-card p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          <Droplets className="w-3.5 h-3.5 text-white/60" />
          <span>Humidity & Fog</span>
        </div>

        <div>
          <span className="text-3xl font-light tracking-tight text-white font-mono">
            {airData.humidity}%
          </span>
          <span className="text-xs text-white/60 ml-1.5 font-medium">
            Relative Humidity
          </span>
        </div>

        <div className="pt-2 border-t border-white/5 text-xs text-white/65 leading-relaxed">
          High relative humidity bonds with chemical nitrates, creating heavy winter haze droplets.
        </div>
      </div>

      {/* Widget 5: Visibility & Safe Ventilation */}
      <div className="weather-card p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center space-x-1.5 text-[11px] uppercase tracking-wider text-white/50 font-semibold">
          <Eye className="w-3.5 h-3.5 text-white/60" />
          <span>Visibility</span>
        </div>

        <div>
          <span className="text-3xl font-light tracking-tight text-white font-mono">
            1.1
          </span>
          <span className="text-xs text-white/60 ml-1.5 font-medium">
            km • Reduced by Smog
          </span>
        </div>

        <div className="pt-2 border-t border-white/5 text-xs text-white/65 leading-relaxed">
          Optimal indoor airing recommended at <strong className="text-emerald-400 font-normal">{airData.ventilationSafeWindow}</strong>.
        </div>
      </div>
    </div>
  );
};
