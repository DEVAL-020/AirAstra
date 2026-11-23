'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CommunityPod } from '@/types';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { 
  Users, 
  AlertTriangle, 
  Leaf, 
  MapPin, 
  Plus, 
  Send, 
  CheckCircle2, 
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

export function CommunityHub() {
  const co2Ref = useRef<HTMLSpanElement>(null);
  const pmRef = useRef<HTMLSpanElement>(null);

  const [pods, setPods] = useState<CommunityPod[]>([
    {
      id: 'p1',
      name: 'Oakridge School EV Pool',
      neighborhood: 'North Sector (3.2km radius)',
      membersCount: 24,
      co2SavedKg: 1840,
      pm25AvoidedGrams: 8200,
      activeCarpools: 6,
      recentReport: '4 diesel vans replaced with shared electric transit for morning school run.'
    },
    {
      id: 'p2',
      name: 'Downtown Tech Campus Micro-Transit',
      neighborhood: 'Metro Corridor Tech Zone',
      membersCount: 58,
      co2SavedKg: 4620,
      pm25AvoidedGrams: 21500,
      activeCarpools: 14,
      recentReport: '100% compliance with carpool lane off-peak commuting during inversion hours.'
    },
    {
      id: 'p3',
      name: 'Greenway Senior Health Walking Pod',
      neighborhood: 'East Lake Community Center',
      membersCount: 31,
      co2SavedKg: 620,
      pm25AvoidedGrams: 3400,
      activeCarpools: 2,
      recentReport: 'Shifted all morning walks to the HEPA-purified community indoor gym.'
    }
  ]);

  const [reportType, setReportType] = useState('Open Biomass / Trash Burning');
  const [reportLocation, setReportLocation] = useState('Sector 4 Near Ring Road');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (co2Ref.current) {
      gsap.fromTo(
        co2Ref.current,
        { innerText: 0 },
        { innerText: 14680, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
    if (pmRef.current) {
      gsap.fromTo(
        pmRef.current,
        { innerText: 0 },
        { innerText: 68400, duration: 1.8, snap: { innerText: 1 }, ease: 'power2.out' }
      );
    }
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportLocation) return;
    setReportSubmitted(true);
    soundFX.playChime();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ffffff', '#f59e0b', '#10b981']
    });

    setTimeout(() => {
      setReportSubmitted(false);
      setReportDetails('');
    }, 4000);
  };

  return (
    <div className="card-chai p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            BreatheTogether community hub
          </h2>
          <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Coordinated neighborhood action across housing pods to maintain <Highlight>collective smog defense</Highlight> during cold inversions.
          </p>
        </div>

        <Chip tone="default" className="text-xs sm:text-sm font-semibold">3 active local pods</Chip>
      </div>

      {/* Impact Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="rounded-xl border border-border/70 bg-neutral-100/60 dark:bg-black/20 p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Community CO₂ prevented</span>
            <div className="font-mono text-2xl font-bold text-foreground mt-1 flex items-baseline">
              <span ref={co2Ref}>14,680</span> <span className="text-xs sm:text-sm ml-1 font-semibold text-neutral-600 dark:text-neutral-400">kg</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5 block">Equivalent to 680 mature urban trees</span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-white dark:bg-black/30 text-brand shadow-xs">
            <Leaf className="size-4" />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-neutral-100/60 dark:bg-black/20 p-4 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-400">Ground PM2.5 avoided</span>
            <div className="font-mono text-2xl font-bold text-foreground mt-1 flex items-baseline">
              <span ref={pmRef}>68,400</span> <span className="text-xs sm:text-sm ml-1 font-semibold text-neutral-600 dark:text-neutral-400">grams</span>
            </div>
            <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5 block">Spared from neighborhood children lungs</span>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-white dark:bg-black/30 text-brand shadow-xs">
            <TrendingDown className="size-4" />
          </div>
        </div>
      </div>

      {/* Pods Grid */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-montserrat text-sm font-bold text-foreground">
            Active neighborhood pods
          </h3>
          <button type="button" className="text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer">
            <Plus className="size-3.5" />
            <span>Create new pod</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {pods.map((pod) => (
            <div
              key={pod.id}
              className="rounded-xl border border-border/70 bg-neutral-100/60 dark:bg-black/20 p-4 flex flex-col justify-between space-y-3 transition-colors hover:border-border shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-montserrat text-sm font-bold text-foreground">{pod.name}</h4>
                  <Chip tone="default">{pod.membersCount} members</Chip>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                  <MapPin className="size-3.5 text-neutral-500 shrink-0" />
                  <span>{pod.neighborhood}</span>
                </div>
                <p className="text-xs font-medium text-neutral-800 dark:text-neutral-300 mt-2.5 rounded-lg border border-border/60 bg-white dark:bg-black/30 p-2.5 leading-relaxed shadow-xs">
                  &ldquo;{pod.recentReport}&rdquo;
                </p>
              </div>

              <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                <span className="text-neutral-600 dark:text-neutral-400 text-[11px] font-medium">Carpools: <strong className="text-foreground">{pod.activeCarpools}</strong></span>
                <button
                  type="button"
                  className="inline-flex h-7 items-center rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black px-3 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
                >
                  Join pod
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Reporting */}
      <div className="rounded-xl border border-red-500/40 bg-red-100/60 dark:bg-red-950/10 p-4 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-700 dark:text-red-400" />
          <h3 className="font-montserrat text-sm font-bold text-foreground">Community air warden alert</h3>
        </div>

        {reportSubmitted ? (
          <div className="p-3 rounded-lg border border-green-500/40 bg-green-100/80 dark:bg-green-950/20 flex items-center gap-2 text-green-900 dark:text-green-300 text-xs font-semibold shadow-xs">
            <CheckCircle2 className="size-4 text-green-600 dark:text-green-400 shrink-0" />
            <span>Alert notified to local wardens. Thank you for protecting neighborhood clean air.</span>
          </div>
        ) : (
          <form onSubmit={handleReportSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div>
              <label className="text-neutral-700 dark:text-neutral-300 font-bold block mb-1">Issue type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-9 rounded-md border border-neutral-300 dark:border-border bg-white dark:bg-black/30 px-3 text-xs font-semibold text-foreground focus:outline-none focus:border-brand cursor-pointer shadow-xs"
              >
                <option value="Open Biomass / Trash Burning">Open biomass or trash burning</option>
                <option value="Industrial Diesel Generator Idling">Diesel generator idling</option>
                <option value="Uncovered Road Construction Dust">Uncovered construction dust</option>
                <option value="Brick Kiln Black Smoke Surge">Brick kiln smoke surge</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-700 dark:text-neutral-300 font-bold block mb-1">Location or landmark</label>
              <input
                type="text"
                value={reportLocation}
                onChange={(e) => setReportLocation(e.target.value)}
                placeholder="e.g. Ring Road Overpass, Sector 7"
                className="w-full h-9 rounded-md border border-neutral-300 dark:border-border bg-white dark:bg-black/30 px-3 text-xs font-semibold text-foreground focus:outline-none focus:border-brand shadow-xs"
                required
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-9 inline-flex items-center justify-center rounded-md bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="size-3.5 mr-1.5" />
                <span>Submit alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
