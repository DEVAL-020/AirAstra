'use client';

import React, { useState } from 'react';
import { AirQualityData } from '@/types';
import { 
  Users, 
  Baby, 
  Briefcase, 
  HeartPulse, 
  Dumbbell, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Car, 
  Train, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Flame,
  Wind
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaAdvisorProps {
  airData: AirQualityData;
}

type PersonaKey = 'parents' | 'professionals' | 'seniors' | 'athletes';

export function PersonaAdvisor({ airData }: PersonaAdvisorProps) {
  const [selectedPersona, setSelectedPersona] = useState<PersonaKey>('parents');
  const [carAcRecirculation, setCarAcRecirculation] = useState(false);
  const [athleteMinutes, setAthleteMinutes] = useState(45);
  const [athleteExerciseType, setAthleteExerciseType] = useState<'running' | 'cycling' | 'brisk-walk'>('running');

  // Kids play safety determination
  const aqi = airData.aqi;
  const isSevere = aqi > 200;
  const isModerate = aqi > 100 && aqi <= 200;
  const isClean = aqi <= 100;

  // Athlete minute ventilation calculation (L/min)
  // Rest = 6 L/min, Brisk Walk = 20 L/min, Cycling = 45 L/min, Running = 65 L/min
  const ventilationRates = {
    'brisk-walk': 20,
    'cycling': 45,
    'running': 65
  };
  const currentRate = ventilationRates[athleteExerciseType];
  const totalLitersInhaled = currentRate * athleteMinutes;
  // Estimated PM2.5 inhaled in micrograms based on outdoor concentration
  // Normal human resting intake in 45 mins at 200 AQI is ~40 ug. Running is ~430 ug.
  const pm25Density = Math.round(aqi * 0.75); // rough proxy ug/m3
  const pmInhaledUg = Math.round((totalLitersInhaled / 1000) * pm25Density);
  const cigaretteEquivalents = (pmInhaledUg / 22).toFixed(1); // 1 cigarette ~ 22 ug PM2.5 deposition

  const personas = [
    {
      id: 'parents' as PersonaKey,
      title: 'Parents & School Children',
      subtitle: 'Play Safety & Commute Guard',
      icon: Baby,
      badge: 'Pediatric Care'
    },
    {
      id: 'professionals' as PersonaKey,
      title: 'Working Professionals',
      subtitle: 'Commute & In-Car Safety',
      icon: Briefcase,
      badge: 'Transit Protection'
    },
    {
      id: 'seniors' as PersonaKey,
      title: 'Seniors & Cardiopulmonary',
      subtitle: 'Morning Walk Warning & Sanctuary',
      icon: HeartPulse,
      badge: 'High Risk Guard'
    },
    {
      id: 'athletes' as PersonaKey,
      title: 'Fitness & Student Athletes',
      subtitle: 'Minute Ventilation & Gym Swaps',
      icon: Dumbbell,
      badge: 'Athletic Safety'
    }
  ];

  return (
    <div className="card-chai p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-neutral-100 dark:bg-neutral-900/60 px-3 py-1 text-xs text-neutral-800 dark:text-neutral-300 font-semibold mb-2 shadow-xs">
            <Users className="size-3.5 text-brand" />
            <span>Targeted Demographic Safety Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Personalized protection advisor
          </h2>
          <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 mt-1 max-w-2xl leading-relaxed">
            Smog does not affect everyone equally. Tailored health actions, commute shields, and safe activity windows calibrated to <Highlight>{airData.city}&apos;s real-time inversion curve</Highlight>.
          </p>
        </div>
      </div>

      {/* Persona Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
        {personas.map((persona) => {
          const isSelected = selectedPersona === persona.id;
          const Icon = persona.icon;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => setSelectedPersona(persona.id)}
              className={cn(
                "flex flex-col items-start text-left p-3 sm:p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                isSelected
                  ? "border-brand bg-brand/10 dark:bg-white/5 text-foreground ring-1 ring-brand/40 shadow-xs"
                  : "border-border/70 bg-neutral-100/70 dark:bg-neutral-900/40 text-neutral-800 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-700 hover:bg-neutral-200/50 dark:hover:bg-neutral-900/80"
              )}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-brand/20 to-transparent pointer-events-none" />
              )}
              <div className="flex items-center justify-between w-full mb-2">
                <div className={cn(
                  "p-1.5 sm:p-2 rounded-lg border",
                  isSelected ? "bg-brand/20 border-brand/50 text-brand" : "bg-white dark:bg-neutral-800 border-border text-neutral-700 dark:text-neutral-400"
                )}>
                  <Icon className="size-4 sm:size-5" />
                </div>
                <span className="text-[8.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 truncate max-w-[75px] xs:max-w-none">
                  {persona.badge}
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">{persona.title}</h3>
              <p className="text-[11px] sm:text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">{persona.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Persona Panel Content */}
      <div className="rounded-xl border-2 border-neutral-200 dark:border-border/70 bg-white dark:bg-neutral-900/40 p-4 sm:p-6 md:p-7 space-y-5 sm:space-y-6 shadow-xs">
        {/* PARENTS & SCHOOL CHILDREN */}
        {selectedPersona === 'parents' && (
          <div className="space-y-6">
            {/* Play Safety Verdict Matrix */}
            <div className={cn(
              "rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4",
              isSevere
                ? "border-red-500/50 bg-red-100/80 dark:bg-red-950/20"
                : isModerate
                ? "border-amber-500/50 bg-amber-100/80 dark:bg-amber-950/20"
                : "border-emerald-500/50 bg-emerald-100/80 dark:bg-emerald-950/20"
            )}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-400">Kids outdoor play status today</span>
                  <Chip tone={isSevere ? "danger" : isModerate ? "special" : "success"}>
                    {isSevere ? "STRICTLY INDOORS" : isModerate ? "LIMITED RECESS ONLY" : "SAFE OUTDOORS"}
                  </Chip>
                </div>
                <h4 className="text-xl font-bold text-foreground">
                  {isSevere 
                    ? "Smog inversion traps toxic fine particulate at ground level."
                    : isModerate
                    ? "Permit outdoor play only during peak solar thermal lift."
                    : "Clean air conditions. Outdoor sports and recess encouraged."}
                </h4>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300 leading-relaxed max-w-xl">
                  {isSevere
                    ? "Children breathe 50% more air per kilogram of body weight than adults and have narrower airways. Outdoor cardio today triggers severe bronchial inflammation."
                    : isModerate
                    ? `Confine any outdoor playground time between ${airData.ventilationSafeWindow}. Cancel early morning (before 09:30) and evening sports.`
                    : "No particulate restrictions today. Keep windows ventilated."}
                </p>
              </div>

              <div className="bg-white dark:bg-neutral-900/90 border border-border rounded-xl p-3 sm:p-4 text-center w-full md:w-auto md:min-w-[200px] shadow-xs">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Safest Outdoor Window</span>
                <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {airData.ventilationSafeWindow}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1 block">Solar thermal lift breaks inversion</span>
              </div>
            </div>

            {/* Practical Parent Checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <CheckCircle2 className="size-4 text-brand" />
                  <span>School Commute Shield Protocol</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Pediatric N95 Mask:</strong> Ensure snug bridge seal. Standard cloth or surgical masks leak 60% around small faces.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Bus / Van Protocol:</strong> Keep van windows rolled up in morning stop-and-go traffic where exhaust concentrations spike 4x.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Post-School Saline Rinse:</strong> Wash nasal passages with mild sterile saline to clear deposited soot before it enters lungs.</span>
                  </li>
                </ul>
              </div>

              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <Sparkles className="size-4 text-brand" />
                  <span>Active Indoor Movement Swaps</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Living Room Obstacle Course:</strong> Cushion jumps and low crawl tunnels burn active energy with zero outdoor soot inhalation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Balloon Volleyball:</strong> Excellent aerobic stimulus without heavy minute-ventilation lung stress.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                    <span><strong className="text-foreground">Purifier Placement:</strong> Keep DIY Corsi box running on Speed 1 in the playroom 20 mins prior to active games.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* WORKING PROFESSIONALS */}
        {selectedPersona === 'professionals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
                  <span>Open Motorbike Transit</span>
                </div>
                <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">145 µg</div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Average PM2.5 inhaled during 35-min peak rush commute. Maximum exposure due to unfiltered direct tailpipe drafts.
                </p>
              </div>

              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
                  <span>Car (Internal Recirculation)</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">22 µg</div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Cabin filter strips 85% of particulate when fresh air intake is toggled to internal recirculation mode.
                </p>
              </div>

              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
                  <span>Metro / Rail Transit</span>
                </div>
                <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">18 µg</div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  Air-conditioned metro cars with high-efficiency HVAC yield lowest commuter respiratory exposure and zero tailpipe emissions.
                </p>
              </div>
            </div>

            {/* Interactive Car AC Recirculation Demo */}
            <div className="rounded-xl border border-border/70 bg-white dark:bg-neutral-900/80 p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Car className="size-4 text-brand" />
                    The Cabin AC Recirculation Button Hack
                  </h4>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Toggle your car AC mode below to see how inside cabin air quality transforms on smoggy highways.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCarAcRecirculation(!carAcRecirculation)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border flex items-center gap-2 shadow-xs",
                    carAcRecirculation
                      ? "border-emerald-500 bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "border-amber-500 bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300"
                  )}
                >
                  <span>Mode: {carAcRecirculation ? "Internal Recirculation ON" : "Fresh Air Mode (Default)"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-black/40 space-y-1.5">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Highway Ambient Ingress</span>
                  <div className="text-xl font-bold font-mono text-foreground">
                    {carAcRecirculation ? "32 AQI (Filtered)" : `${airData.aqi} AQI (Raw Exhaust Inflow)`}
                  </div>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {carAcRecirculation
                      ? "Cabin air repeatedly passes through particulate filter. Zero highway soot ingress."
                      : "Sucks in high-concentration black carbon directly from truck exhaust pipes ahead."}
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-black/40 space-y-1.5">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Action Recommendation</span>
                  <div className="text-sm font-bold text-foreground">
                    {carAcRecirculation ? "Maintain recirculation for city driving" : "Press the car recirculation button immediately"}
                  </div>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Crack window open for 15 seconds every 45 mins to prevent CO2 buildup, then seal back.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SENIOR CITIZENS & SENSITIVE */}
        {selectedPersona === 'seniors' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-red-500/50 bg-red-100/70 dark:bg-red-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-base">
                <AlertTriangle className="size-5" />
                <span>The 06:00 to 08:30 AM &quot;Morning Walk Trap&quot;</span>
              </div>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                Many seniors maintain a cherished habit of dawn walks for health. In winter, this is when radiation inversion is at its <strong>deadliest peak</strong>. Ground air is at freezing temperatures, trapping heavy soot and diesel particulates within 15 meters of the street. Deep breathing in cold air triggers severe coronary vasoconstriction and lung capillary injury.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Prescribed Safe Walk Window:</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <Clock className="size-3.5" />
                  13:30 to 15:30 (Afternoon Solar Window)
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Or pace indoor ventilated corridors</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-brand" />
                  Bedroom Sanctuary Setup
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <li>• Seal bedroom door gap with a draft stopper or rolled damp towel.</li>
                  <li>• Position your air purifier 2 feet from headrest, angled upward away from direct draft.</li>
                  <li>• Keep indoor relative humidity at 40-50% using a clean warm humidifier to soothe airways.</li>
                </ul>
              </div>

              <div className="border border-border/70 rounded-xl bg-white dark:bg-black/30 p-5 space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-brand" />
                  Cleaning Protocol (Wet Mop vs Dry Sweep)
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  <li>• <strong>Never dry broom:</strong> Sweeping aerosolizes settled PM2.5, spiking indoor counts 500%.</li>
                  <li>• <strong>Wet microfiber mop only:</strong> Traps microscopic particles electrostatically.</li>
                  <li>• Close all windows before morning traffic begins (07:00 AM).</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* FITNESS & STUDENT ATHLETES */}
        {selectedPersona === 'athletes' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/70 bg-white dark:bg-black/40 p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    Minute Ventilation Rate Calculator
                  </h4>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Resting humans inhale 6 L/min. Strenuous outdoor athletic training increases pulmonary uptake tenfold.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {(['brisk-walk', 'cycling', 'running'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAthleteExerciseType(type)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer border",
                        athleteExerciseType === type
                          ? "border-brand bg-brand/20 text-brand"
                          : "border-border/60 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-foreground"
                      )}
                    >
                      {type.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculator Output */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-neutral-900/60 text-center">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Pulmonary Intake</span>
                  <span className="text-2xl font-mono font-bold text-foreground mt-1 block">
                    {totalLitersInhaled.toLocaleString()} Liters
                  </span>
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1 block">Inhaled in {athleteMinutes} minutes</span>
                </div>

                <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-neutral-900/60 text-center">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Particulate Deposition</span>
                  <span className="text-2xl font-mono font-bold text-amber-600 dark:text-amber-400 mt-1 block">
                    {pmInhaledUg} µg PM2.5
                  </span>
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1 block">Deposited deep in pulmonary alveoli</span>
                </div>

                <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-neutral-900/60 text-center">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Smog Health Penalty</span>
                  <span className="text-2xl font-mono font-bold text-red-600 dark:text-red-400 mt-1 block">
                    ~{cigaretteEquivalents} cigarettes
                  </span>
                  <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mt-1 block">Toxic particulate equivalent</span>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border/60 bg-neutral-50 dark:bg-neutral-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  <strong className="text-foreground">Athletic Strategy:</strong> Swap outdoor road cardio for indoor gym treadmill, rowing, or calisthenics with high-efficiency filtration running.
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-xs font-bold whitespace-nowrap">
                  100% Alveolar Protection
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
