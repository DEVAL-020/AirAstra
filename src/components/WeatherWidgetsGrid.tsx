'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { SmogShaderCanvas } from './SmogShaderCanvas';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface WeatherWidgetsGridProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
}

export function WeatherWidgetsGrid({
  airData,
  onOpenPurifier3D
}: WeatherWidgetsGridProps) {
  const scalePercent = Math.min(Math.max((airData.aqi / 500) * 100, 2), 98);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Widget 1: Air Quality Breakdown */}
      <div className="card-chai p-5 flex flex-col justify-between space-y-4 lg:col-span-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium text-foreground">Air quality index</span>
            <Chip tone={airData.aqi > 200 ? 'danger' : 'default'}>{airData.category}</Chip>
          </div>

          <div>
            <span className="font-mono text-3xl font-light text-foreground">
              {airData.aqi}
            </span>
            <span className="ml-2 font-mono text-xs text-neutral-400">
              EPA US standard
            </span>
          </div>

          {/* Scale bar */}
          <div className="space-y-1.5">
            <div className="relative h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div 
                className="absolute inset-0 h-full w-full rounded-full"
                style={{
                  background: 'linear-gradient(to right, #10b981 0%, #eab308 20%, #f97316 40%, #ef4444 60%, #8b5cf6 80%, #581c87 100%)'
                }}
              />
            </div>
            <div className="relative w-full h-2">
              <div 
                className="absolute top-0 -ml-1 size-2.5 bg-white rounded-full border border-black/40 transition-all duration-300"
                style={{ left: `${scalePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pollutants list */}
        <div className="pt-3 border-t border-border/40 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>PM2.5 (Fine soot)</span>
            <span className="font-mono font-medium text-foreground">{airData.pm25} µg/m³</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>PM10 (Coarse dust)</span>
            <span className="font-mono font-medium text-foreground">{airData.pm10} µg/m³</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Nitrogen dioxide (NO₂)</span>
            <span className="font-mono font-medium text-foreground">{airData.no2} µg/m³</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Ozone (O₃)</span>
            <span className="font-mono font-medium text-foreground">{airData.o3} µg/m³</span>
          </div>
        </div>
      </div>

      {/* Widget 2: 3D Inversion Shader Canvas */}
      <div className="card-chai p-5 flex flex-col justify-between space-y-3 lg:col-span-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Layers className="size-3.5" />
            <span>Atmospheric inversion simulation</span>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            Boundary ceiling at ~180m
          </span>
        </div>

        <div className="relative flex-1 min-h-[170px] rounded-lg overflow-hidden border border-border/30 bg-black/40">
          <SmogShaderCanvas aqi={airData.aqi} inversionStrength={airData.inversionStrength} />
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Ground-level cold lake traps particulate matter. Dispersal happens during <Highlight>afternoon solar heating</Highlight> when thermal updrafts open.
        </p>
      </div>

      {/* Widget 3: Wind */}
      <div className="card-chai p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Wind className="size-3.5 text-neutral-400" />
          <span>Surface wind</span>
        </div>

        <div>
          <span className="font-mono text-3xl font-light text-foreground">
            {airData.windSpeed}
          </span>
          <span className="ml-1.5 font-mono text-xs text-neutral-400">
            km/h • NW
          </span>
        </div>

        <p className="pt-2 border-t border-border/40 text-xs text-neutral-400 leading-relaxed">
          Calm surface wind allows vehicular exhaust and solid fuels to stagnate.
        </p>
      </div>

      {/* Widget 4: Humidity */}
      <div className="card-chai p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Droplets className="size-3.5 text-neutral-400" />
          <span>Relative humidity</span>
        </div>

        <div>
          <span className="font-mono text-3xl font-light text-foreground">
            {airData.humidity}%
          </span>
          <span className="ml-1.5 font-mono text-xs text-neutral-400">
            Moisture saturation
          </span>
        </div>

        <p className="pt-2 border-t border-border/40 text-xs text-neutral-400 leading-relaxed">
          High humidity bonds with ambient sulfates, creating visible smog aerosol droplets.
        </p>
      </div>

      {/* Widget 5: Visibility */}
      <div className="card-chai p-5 flex flex-col justify-between space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Eye className="size-3.5 text-neutral-400" />
          <span>Visibility</span>
        </div>

        <div>
          <span className="font-mono text-3xl font-light text-foreground">
            1.1
          </span>
          <span className="ml-1.5 font-mono text-xs text-neutral-400">
            km (Reduced by haze)
          </span>
        </div>

        <p className="pt-2 border-t border-border/40 text-xs text-neutral-400 leading-relaxed">
          Safe indoor cross ventilation window scheduled for {airData.ventilationSafeWindow}.
        </p>
      </div>
    </div>
  );
}
