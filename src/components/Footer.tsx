'use client';

import React from 'react';
import { 
  Wind, 
  ShieldAlert, 
  Layers, 
  Stethoscope, 
  Scan, 
  Users, 
  Printer, 
  ArrowUp, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'overview' | 'routine' | 'hacks' | 'vision' | 'chat' | 'community' | 'export') => void;
  onOpenEmergency: () => void;
  onOpenPurifier3D: () => void;
  currentCity: string;
  currentAQI: number;
}

export function Footer({
  onSelectTab,
  onOpenEmergency,
  onOpenPurifier3D,
  currentCity,
  currentAQI
}: FooterProps) {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative mt-24 border-t border-border/40 pt-16 pb-12 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-[1440px] before:-translate-x-1/2 before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)] dark:before:bg-orange-300">
      <div className="mx-auto max-w-6xl px-6 sm:px-12 space-y-12">
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Live Status (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-black/30 text-white">
                <span className="font-brand text-lg font-bold text-brand">A</span>
              </div>
              <div>
                <span className="font-brand text-xl font-bold tracking-tight text-foreground">
                  AirAstra
                </span>
                <span className="ml-2 text-xs text-neutral-400 font-medium">
                  urban smog os
                </span>
              </div>
            </div>

            <p className="text-sm text-neutral-300 max-w-sm leading-relaxed">
              GenAI-powered urban atmospheric defense helping families and communities navigate severe winter smog, ground temperature inversions, and high particulate pollution.
            </p>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-border/50 bg-black/30 px-3.5 py-1.5 text-xs text-neutral-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Telemetry active for <strong>{currentCity}</strong> (AQI {currentAQI})</span>
            </div>
          </div>

          {/* Column 2: Interactive Modules */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
              Platform tools
            </span>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('overview')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Activity className="size-3.5 text-neutral-400" />
                  <span>Air weather forecast</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('routine')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Wind className="size-3.5 text-neutral-400" />
                  <span>Low-emission routine</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('hacks')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="size-3.5 text-neutral-400" />
                  <span>DIY filtration lab</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPurifier3D}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Layers className="size-3.5 text-neutral-400" />
                  <span>3D filter simulator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('vision')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Scan className="size-3.5 text-neutral-400" />
                  <span>AirSnap room scanner</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('chat')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Stethoscope className="size-3.5 text-neutral-400" />
                  <span>Astra voice doctor</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('community')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Users className="size-3.5 text-neutral-400" />
                  <span>Neighborhood pods</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Standards & Frameworks */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
              Standards & science
            </span>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">WHO 2021 air guidelines</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">US EPA AQI breakpoints</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">Harvard ACH ventilation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">Corsi-Rosenthal CADR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">Boundary layer physics</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                <span className="text-neutral-300">Aerosol dispersal physics</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Protocols */}
          <div className="space-y-3.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">
              Emergency defense
            </span>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>
                <button
                  type="button"
                  onClick={onOpenEmergency}
                  className="hover:text-red-400 transition-colors text-left cursor-pointer flex items-center gap-1.5 font-medium text-red-300"
                >
                  <ShieldAlert className="size-3.5 text-red-400" />
                  <span>Level 4 smog protocol</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectTab('export')}
                  className="hover:text-brand transition-colors text-left cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="size-3.5 text-neutral-400" />
                  <span>Printable family plan</span>
                </button>
              </li>
              <li className="pt-2 border-t border-border/30 text-xs text-neutral-400 space-y-1">
                <span className="block font-medium text-neutral-300">Emergency lines:</span>
                <span className="block font-mono text-neutral-400">Ambulance: 108 / 112</span>
                <span className="block font-mono text-neutral-400">Pediatric Triage: 102</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex flex-wrap items-center gap-2 text-center sm:text-left">
            <span>© 2026 AirAstra. Designed for clean air and resilient communities.</span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="text-neutral-400">Privacy first: zero personal tracking</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-brand transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
