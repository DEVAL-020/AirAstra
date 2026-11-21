'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { 
  Wind, 
  ChevronRight, 
  ShieldCheck, 
  Clock, 
  Droplet, 
  ArrowUpRight
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface TodaysSuggestionsProps {
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
  onSelectTab: (tab: 'routine' | 'hacks' | 'vision' | 'chat') => void;
}

export function TodaysSuggestions({
  airData,
  onOpenPurifier3D,
  onOpenEmergency,
  onSelectTab
}: TodaysSuggestionsProps) {
  const suggestions = [
    {
      id: 'purifier',
      title: 'Use an air purifier',
      caption: airData.aqi > 200 ? 'Run continuously on medium or high' : 'Run on eco mode',
      icon: Wind,
      action: onOpenPurifier3D,
      chipTone: 'success' as const,
      chipLabel: '3D simulator'
    },
    {
      id: 'mask',
      title: 'Wear an N95 certified mask outside',
      caption: 'Pinch metal clip tightly across the nose bridge',
      icon: ShieldCheck,
      action: onOpenEmergency,
      chipTone: 'danger' as const,
      chipLabel: 'Essential'
    },
    {
      id: 'ventilation',
      title: `Ventilate during ${airData.ventilationSafeWindow}`,
      caption: 'Open cross windows for 15 mins during solar updraft',
      icon: Clock,
      action: () => onSelectTab('routine'),
      chipTone: 'default' as const,
      chipLabel: 'Midday window'
    },
    {
      id: 'humidity',
      title: 'Drape damp microfiber towel over radiator',
      caption: 'Binds dry airborne soot and speeds up settling',
      icon: Droplet,
      action: () => onSelectTab('hacks'),
      chipTone: 'special' as const,
      chipLabel: 'Zero cost'
    }
  ];

  return (
    <div className="card-chai p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h2 className="font-montserrat text-lg font-semibold text-foreground">
            Today&apos;s recommendations
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Targeted defense against <Highlight>severe winter inversion</Highlight> in {airData.city}.
          </p>
        </div>
        <span className="text-xs text-neutral-400 font-mono">
          Updated {airData.timestamp}
        </span>
      </div>

      {/* Prominent severity card matching Image 2 in ChaiUI style */}
      <div
        onClick={onOpenEmergency}
        role="button"
        tabIndex={0}
        className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-red-500/30 bg-black/30 p-4 transition-colors hover:border-red-500/50"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-medium">Air quality status</span>
            <Chip tone="danger">Level 4 lockdown ready</Chip>
          </div>
          <div className="font-montserrat text-lg font-semibold text-white">
            {airData.category} (AQI {airData.aqi})
          </div>
          <p className="text-xs text-neutral-400">
            Ground inversion is active. Tap to view the emergency checklist for sensitive family members.
          </p>
        </div>

        <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-black/40 text-neutral-300 group-hover:text-white">
          <ChevronRight className="size-4" />
        </div>
      </div>

      {/* Suggestion cards in ChaiUI card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {suggestions.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              onClick={item.action}
              role="button"
              tabIndex={0}
              className="group flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border/40 bg-black/20 p-3.5 transition-colors hover:border-border hover:bg-black/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-black/30 text-brand">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-montserrat text-sm font-semibold text-foreground group-hover:text-brand transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="truncate text-xs text-neutral-400 mt-0.5">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Chip tone={item.chipTone}>{item.chipLabel}</Chip>
                <ChevronRight className="size-4 text-neutral-500 group-hover:text-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
