'use client';

import React, { useState } from 'react';
import { AirQualityData } from '@/types';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Car, 
  Calendar, 
  Flame, 
  Leaf,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';
import { soundFX } from '@/lib/sound';
import { cn } from '@/lib/utils';

interface TripCombinerProps {
  airData: AirQualityData;
}

interface ErrandOption {
  id: string;
  name: string;
  category: string;
  distanceKm: number;
  typicalHour: string;
}

const AVAILABLE_ERRANDS: ErrandOption[] = [
  { id: 'school', name: 'School Drop & Pickup', category: 'Family', distanceKm: 4.5, typicalHour: '08:00 AM' },
  { id: 'grocery', name: 'Fresh Market & Groceries', category: 'Household', distanceKm: 3.2, typicalHour: '10:30 AM' },
  { id: 'pharmacy', name: 'Pharmacy & Wellness Store', category: 'Medical', distanceKm: 2.8, typicalHour: '11:15 AM' },
  { id: 'office', name: 'Office / Co-working commute', category: 'Work', distanceKm: 12.0, typicalHour: '08:45 AM' },
  { id: 'parcel', name: 'Parcel Dispatch / Post', category: 'Errand', distanceKm: 3.0, typicalHour: '16:00 PM' },
  { id: 'bank', name: 'Bank & Financial Center', category: 'Finance', distanceKm: 4.0, typicalHour: '12:00 PM' }
];

export function TripCombiner({ airData }: TripCombinerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['school', 'grocery', 'pharmacy']);
  const [vehicleType, setVehicleType] = useState<'petrol-car' | 'diesel-suv' | 'motorbike' | 'electric-metro'>('petrol-car');
  const [scheduledWindow, setScheduledWindow] = useState('13:30 - 15:30 (Solar Lift)');

  const toggleErrand = (id: string) => {
    soundFX.playChime();
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedErrands = AVAILABLE_ERRANDS.filter((e) => selectedIds.includes(e.id));

  // Emission & Exposure Physics Calculation
  // Cold start engine penalty: Catalytic converter takes ~4 km to reach 300°C operating temperature.
  // Unchained: N individual trips = N cold starts.
  // Chained: 1 combined trip = 1 cold start + warm engine cruising.
  const tripCount = selectedErrands.length || 1;
  const rawSumKm = selectedErrands.reduce((sum, e) => sum + e.distanceKm * 2, 0); // round trips back and forth
  const chainedKm = Math.round(selectedErrands.reduce((sum, e) => sum + e.distanceKm, 0) * 1.35 + 3); // chained single circuit

  const vehicleFactors = {
    'petrol-car': { co2PerKm: 180, pmPerKm: 12, coldStartCo2: 240, coldStartPm: 45 },
    'diesel-suv': { co2PerKm: 230, pmPerKm: 28, coldStartCo2: 380, coldStartPm: 95 },
    'motorbike': { co2PerKm: 75, pmPerKm: 35, coldStartCo2: 110, coldStartPm: 50 },
    'electric-metro': { co2PerKm: 15, pmPerKm: 1, coldStartCo2: 0, coldStartPm: 0 }
  };

  const vf = vehicleFactors[vehicleType];

  // Unchained emissions (3 separate round trips with 3 cold starts in morning inversion)
  const unchainedCo2Grams = Math.round(rawSumKm * vf.co2PerKm + tripCount * vf.coldStartCo2);
  const unchainedPmGrams = Math.round((rawSumKm * vf.pmPerKm + tripCount * vf.coldStartPm) / 10);

  // Chained emissions (1 combined loop with only 1 cold start)
  const chainedCo2Grams = Math.round(chainedKm * vf.co2PerKm + 1 * vf.coldStartCo2);
  const chainedPmGrams = Math.round((chainedKm * vf.pmPerKm + 1 * vf.coldStartPm) / 10);

  const co2SavingsPercent = unchainedCo2Grams > 0 ? Math.round(((unchainedCo2Grams - chainedCo2Grams) / unchainedCo2Grams) * 100) : 0;
  const co2SavedKg = ((unchainedCo2Grams - chainedCo2Grams) / 1000).toFixed(1);

  // Lung exposure index: Morning inversion has 3x higher ground soot density than 14:00 solar lift
  const morningExposureScore = Math.round(airData.aqi * 1.25);
  const thermalLiftExposureScore = Math.round(airData.aqi * 0.45);
  const exposureReductionPercent = Math.round(((morningExposureScore - thermalLiftExposureScore) / morningExposureScore) * 100);

  return (
    <div className="card-chai p-6 sm:p-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-neutral-100 dark:bg-neutral-900/60 px-3 py-1 text-xs text-neutral-800 dark:text-neutral-300 font-semibold mb-2 shadow-xs">
            <Navigation className="size-3.5 text-brand" />
            <span>Trip Chaining & Inversion Avoidance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Smart trip combiner & route planner
          </h2>
          <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            Every cold engine start emits 4x higher particulates. Combine fragmented errands into a single circuit during <Highlight>the midday thermal lift window</Highlight> to slash emissions and lung exposure.
          </p>
        </div>

        {selectedErrands.length > 0 && (
          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-neutral-100 dark:bg-neutral-900/60 px-4 py-2.5 shadow-xs">
            <div className="text-right">
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Chained Route Savings</span>
              <span className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400">
                -{co2SavedKg} kg CO₂ • -{exposureReductionPercent}% Inhalation Risk
              </span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
              <Leaf className="size-4" />
            </div>
          </div>
        )}
      </div>

      {/* Errand Selection & Vehicle Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Errand Checkbox List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Select your daily errand stops</span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{selectedErrands.length} destinations selected</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AVAILABLE_ERRANDS.map((errand) => {
              const isSelected = selectedIds.includes(errand.id);
              return (
                <button
                  key={errand.id}
                  type="button"
                  onClick={() => toggleErrand(errand.id)}
                  className={cn(
                    "flex items-start justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer shadow-xs",
                    isSelected
                      ? "border-brand bg-brand/10 dark:bg-white/5 text-foreground ring-1 ring-brand/40"
                      : "border-border/70 bg-white dark:bg-neutral-900/30 text-neutral-700 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-700 hover:text-foreground"
                  )}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 border border-border/50">
                        {errand.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">{errand.distanceKm} km</span>
                    </div>
                    <div className="text-sm font-bold text-foreground">{errand.name}</div>
                    <div className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">Typical: {errand.typicalHour}</div>
                  </div>

                  <div className="mt-1">
                    {isSelected ? (
                      <CheckCircle2 className="size-5 text-brand" />
                    ) : (
                      <Plus className="size-5 text-neutral-400 dark:text-neutral-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Vehicle & Timing Options */}
        <div className="space-y-4 rounded-xl border border-border/70 bg-neutral-100/60 dark:bg-neutral-900/40 p-5 shadow-xs">
          <span className="text-sm font-bold text-foreground block">Transit Parameters</span>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">Vehicle Powertrain</label>
            <div className="relative">
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as any)}
                className="w-full h-11 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-brand cursor-pointer shadow-xs appearance-none"
              >
                <option value="petrol-car" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Petrol Hatchback / Sedan</option>
                <option value="diesel-suv" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Diesel SUV (Heavy PM)</option>
                <option value="motorbike" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Motorbike / Scooter</option>
                <option value="electric-metro" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">Metro / Electric Transit</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-neutral-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg border border-border/60 bg-white dark:bg-black/40 space-y-1.5 shadow-xs">
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Recommended Execution Window</span>
            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              {airData.ventilationSafeWindow}
            </div>
            <p className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Ground inversion boundary breaks due to solar heating, dispersing concentrated ground exhaust.
            </p>
          </div>
        </div>
      </div>

      {/* Comparison: Unchained vs Chained Trip Performance */}
      <div className="rounded-xl border border-border/70 bg-neutral-100/40 dark:bg-black/40 p-6 space-y-5 shadow-xs">
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" />
          Trip Chaining Impact Analysis
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Unchained Profile */}
          <div className="border border-red-500/40 rounded-xl bg-red-100/60 dark:bg-red-950/10 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
              <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase">Unchained Errands (Fragmented)</span>
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">{tripCount} isolated trips</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Total Travel</span>
                <span className="text-base font-bold font-mono text-foreground">{rawSumKm} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Cold Engine Starts</span>
                <span className="text-base font-bold font-mono text-red-700 dark:text-red-400">{tripCount} cold starts</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">CO₂ Generated</span>
                <span className="text-base font-bold font-mono text-foreground">{unchainedCo2Grams} g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Commuter Inhaled Exposure</span>
                <span className="text-base font-bold font-mono text-red-700 dark:text-red-400">High Risk (Inversion)</span>
              </div>
            </div>

            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Multiple cold starts force the engine to run rich with unheated catalytic converters, spewing 400% higher hydrocarbons and fine particulates into morning cold air.
            </p>
          </div>

          {/* Chained Profile */}
          <div className="border border-emerald-500/40 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/10 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Chained Loop (Optimized Window)</span>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold">{co2SavingsPercent}% CO₂ Reduction</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Total Travel</span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">{chainedKm} km</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Cold Engine Starts</span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">1 cold start only</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">CO₂ Generated</span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">{chainedCo2Grams} g</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white dark:bg-black/30 border border-border/50 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400 block">Inhalation Reduction</span>
                <span className="text-base font-bold font-mono text-emerald-700 dark:text-emerald-400">-{exposureReductionPercent}% Inhaled PM</span>
              </div>
            </div>

            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              One warm loop keeps the catalytic converter at optimal 450°C efficiency, while scheduling during thermal lift ensures commuter avoids morning soot stagnation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
