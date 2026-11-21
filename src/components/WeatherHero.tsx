'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { 
  Clock, 
  Sun, 
  CloudFog, 
  Moon, 
  ArrowUpRight,
  ShieldAlert,
  Layers
} from 'lucide-react';
import { AnimatedBadge } from '@/components/ui/animated-badge';
import { Highlight } from '@/components/ui/highlight';
import { Chip } from '@/components/ui/chip';

interface WeatherHeroProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
}

export function WeatherHero({
  airData,
  onOpenPurifier3D,
  onOpenEmergency
}: WeatherHeroProps) {
  const aqiList = airData.hourlyForecast.map((h) => h.aqi);
  const maxAqi = Math.max(...aqiList, airData.aqi);
  const minAqi = Math.min(...aqiList, airData.aqi);

  return (
    <section className="space-y-8 pt-4 pb-2">
      {/* Hero Lead Section */}
      <div className="flex flex-col items-center text-center space-y-4">
        <AnimatedBadge>
          <span className="text-xs sm:text-sm font-medium">Urban Smog & Inversion Monitor</span>
        </AnimatedBadge>

        <h1 className="text-5xl font-bold tracking-tight max-md:leading-tight md:text-7xl lg:text-8xl text-foreground">
          {airData.city} <span className="font-mono text-3xl md:text-5xl font-light text-neutral-400">({airData.aqi} AQI)</span>
        </h1>

        <p className="max-w-3xl text-lg text-neutral-300 md:text-2xl leading-relaxed">
          Cold winter surface air traps toxic particulates. Protect your household with <Highlight>proven low-emission routines</Highlight> and clean air hacks.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-3">
          <button
            type="button"
            onClick={onOpenPurifier3D}
            className="btn-asym inline-flex h-11 items-center gap-2 bg-white px-6 text-base font-semibold text-black transition-colors hover:bg-neutral-200 cursor-pointer"
          >
            Open 3D filter simulator <ArrowUpRight className="-ml-1 size-4" aria-hidden="true" />
          </button>

          {airData.aqi > 200 && (
            <button
              type="button"
              onClick={onOpenEmergency}
              className="btn-asym-mirror inline-flex h-11 items-center gap-2 border border-border bg-transparent px-5 text-base font-medium text-foreground transition-colors hover:bg-black/90 cursor-pointer"
            >
              <ShieldAlert className="size-5 text-red-400" />
              Smog protocol
            </button>
          )}
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <div className="card-chai p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Clock className="size-4 text-neutral-400" />
            <span className="font-semibold text-foreground">24-hour inversion forecast</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-neutral-400 font-medium">Safe flush window:</span>
            <Chip tone="success" className="text-xs sm:text-sm font-semibold">{airData.ventilationSafeWindow}</Chip>
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none]">
          {airData.hourlyForecast.map((hour, idx) => {
            const isNow = idx === 0;
            const hourNum = parseInt(hour.hour.split(':')[0]);
            const isNight = hourNum < 6 || hourNum > 18;

            return (
              <div
                key={hour.hour + idx}
                className="flex-shrink-0 flex flex-col items-center justify-between min-w-[72px] p-3 rounded-xl border border-border/30 bg-black/20 text-center space-y-2"
              >
                <span className="text-xs sm:text-sm text-neutral-300 font-semibold">
                  {isNow ? 'Now' : hour.hour.replace(':00', '')}
                </span>

                <div className="text-foreground my-0.5">
                  {hour.inversionTrapped ? (
                    <CloudFog className="size-5 text-red-400" />
                  ) : isNight ? (
                    <Moon className="size-5 text-neutral-400" />
                  ) : (
                    <Sun className="size-5 text-amber-300" />
                  )}
                </div>

                <span className="text-sm sm:text-base font-mono font-bold text-foreground">
                  {hour.aqi}
                </span>

                <span className="text-xs text-neutral-400 font-mono">
                  {hour.temperature}°C
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
