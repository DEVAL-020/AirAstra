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
  Layers,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { AnimatedBadge } from '@/components/ui/animated-badge';
import { Highlight } from '@/components/ui/highlight';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';

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
          {airData.city} <span className="font-mono text-3xl md:text-5xl font-light text-neutral-600 dark:text-neutral-400">({airData.aqi} AQI)</span>
        </h1>

        <p className="max-w-3xl text-lg text-neutral-700 dark:text-neutral-300 font-medium md:text-2xl leading-relaxed">
          Cold winter surface air traps toxic particulates. Protect your household with <Highlight>proven low-emission routines</Highlight> and clean air hacks.
        </p>

        {/* Live Data Source and Timestamp Verification Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-xs sm:text-sm">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-neutral-100/90 dark:bg-neutral-900/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-600 dark:bg-emerald-500"></span>
            </span>
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">Live Telemetry:</span>
            <span className="font-mono font-bold text-foreground">{airData.timestamp}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-neutral-100/90 dark:bg-neutral-900/80 px-3.5 py-1.5 backdrop-blur-md shadow-xs">
            <Radio className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-neutral-600 dark:text-neutral-400 font-medium">Verified Source:</span>
            <span className="font-bold text-foreground">
              {airData.dataSource || 'Open-Meteo & CPCB Global Atmospheric Network'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="solid"
            size="lg"
            onClick={onOpenPurifier3D}
            className="text-base font-semibold shadow-xs"
          >
            Open 3D filter simulator
          </Button>

          {airData.aqi > 200 && (
            <Button
              variant="outline"
              size="lg"
              onClick={onOpenEmergency}
              className="text-base font-semibold"
            >
              <ShieldAlert className="size-5 text-red-600 dark:text-red-400" />
              Smog protocol
            </Button>
          )}
        </div>
      </div>

      {/* Hourly Forecast Strip */}
      <div className="card-chai p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 text-sm text-neutral-800 dark:text-neutral-200 font-semibold">
            <Clock className="size-4 text-neutral-600 dark:text-neutral-400" />
            <span className="font-semibold text-foreground">24-hour inversion forecast</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Safe flush window:</span>
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
                className="flex-shrink-0 flex flex-col items-center justify-between min-w-[72px] p-3 rounded-xl border border-border/60 bg-neutral-100/60 dark:bg-black/20 text-center space-y-2"
              >
                <span className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-300 font-bold">
                  {isNow ? 'Now' : hour.hour.replace(':00', '')}
                </span>

                <div className="text-foreground my-0.5">
                  {hour.inversionTrapped ? (
                    <CloudFog className="size-5 text-red-600 dark:text-red-400" />
                  ) : isNight ? (
                    <Moon className="size-5 text-neutral-600 dark:text-neutral-400" />
                  ) : (
                    <Sun className="size-5 text-amber-500 dark:text-amber-300" />
                  )}
                </div>

                <span className="text-sm sm:text-base font-mono font-bold text-foreground">
                  {hour.aqi}
                </span>

                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono font-semibold">
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
