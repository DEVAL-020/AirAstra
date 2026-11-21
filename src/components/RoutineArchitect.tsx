'use client';

import React, { useState, useEffect } from 'react';
import { AirQualityData, RoutineItem } from '@/types';
import { generateAIAirRoutine } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import { 
  CheckCircle2, 
  Circle, 
  Leaf, 
  Wind, 
  Calendar, 
  Loader2, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { motion, AnimatePresence } from 'framer-motion';
import { Highlight } from '@/components/ui/highlight';
import { cn } from '@/lib/utils';

interface RoutineArchitectProps {
  airData: AirQualityData;
}

export function RoutineArchitect({ airData }: RoutineArchitectProps) {
  const [householdType, setHouseholdType] = useState('Family with young school kids');
  const [commuteMode, setCommuteMode] = useState('Two-wheeler / Motorbike commute');
  const [vulnerable, setVulnerable] = useState<string[]>(['Asthmatic child', 'Infant / Toddler']);
  const [housingType, setHousingType] = useState('Mid-rise flat near arterial road');
  
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Generate routine automatically on mount and whenever city changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    generateAIAirRoutine(
      {
        householdType,
        commuteMode,
        vulnerableMembers: vulnerable,
        housingType
      },
      airData
    )
      .then((items) => {
        if (isMounted) {
          setRoutines(items);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [airData.city]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const items = await generateAIAirRoutine(
        {
          householdType,
          commuteMode,
          vulnerableMembers: vulnerable,
          housingType
        },
        airData
      );
      setRoutines(items);
      setCompletedSteps({});
      soundFX.playChime();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (id: string) => {
    const nextState = !completedSteps[id];
    setCompletedSteps((prev) => ({ ...prev, [id]: nextState }));
    if (nextState) {
      soundFX.playChime();
    }
  };

  const toggleVulnerable = (item: string) => {
    setVulnerable((prev) => 
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const totalCo2Saved = routines.reduce((sum, r) => sum + r.personalImpact.co2SavedGrams, 0);
  const totalPmAvoided = routines.reduce((sum, r) => sum + r.personalImpact.pmInhaledAvoidedUg, 0);

  return (
    <div className="card-chai p-6 sm:p-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Low-emission daily routine
          </h2>
          <p className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Plan your day around {airData.city}&apos;s winter inversion curve with <Highlight>practical emission alternatives</Highlight> that reduce lung exposure.
          </p>
        </div>

        {routines.length > 0 && (
          <div className="flex items-center gap-3.5 rounded-xl border border-border/80 bg-neutral-100 dark:bg-neutral-900/60 px-4 py-2.5 shadow-xs">
            <div className="text-right">
              <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 block">Personal daily impact</span>
              <span className="text-sm font-mono font-bold text-foreground">
                -{(totalCo2Saved / 1000).toFixed(1)}kg CO₂ / -{totalPmAvoided}µg PM2.5
              </span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-emerald-100 dark:bg-black/40 text-emerald-700 dark:text-brand">
              <Leaf className="size-4" />
            </div>
          </div>
        )}
      </div>

      {/* Household configurator with High Visibility Inputs */}
      <div className="rounded-xl border border-border/70 bg-neutral-100/60 dark:bg-neutral-900/50 p-5 sm:p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <span className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" />
            Household and commute profile
          </span>
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
            Tailored to your daily exposure
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 block mb-2">
              Household structure
            </label>
            <div className="relative">
              <select
                value={householdType}
                onChange={(e) => setHouseholdType(e.target.value)}
                className="w-full h-11 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-brand cursor-pointer shadow-xs appearance-none"
              >
                <option value="Family with young school kids" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Family with young school kids</option>
                <option value="Dual-income professionals" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Dual-income professionals</option>
                <option value="Multi-generation family with seniors" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Multi-generation family with seniors</option>
                <option value="Solo remote worker & pets" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Solo remote worker & pets</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-neutral-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 block mb-2">
              Primary daily transit
            </label>
            <div className="relative">
              <select
                value={commuteMode}
                onChange={(e) => setCommuteMode(e.target.value)}
                className="w-full h-11 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-brand cursor-pointer shadow-xs appearance-none"
              >
                <option value="Two-wheeler / Motorbike commute" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Two-wheeler / Motorbike (Open air)</option>
                <option value="Private Petrol/Diesel Car" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Private car</option>
                <option value="Metro / Public Transit" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Metro or electric bus</option>
                <option value="Remote / Work From Home" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Work from home</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-neutral-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200 block mb-2">
              Dwelling exposure
            </label>
            <div className="relative">
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value)}
                className="w-full h-11 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 text-sm font-bold text-neutral-900 dark:text-white focus:outline-none focus:border-brand cursor-pointer shadow-xs appearance-none"
              >
                <option value="Mid-rise flat near arterial road" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Mid-rise flat near arterial road</option>
                <option value="Ground floor independent house" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Ground floor independent house</option>
                <option value="High-rise apartment (12th floor+)" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">High-rise apartment (12th floor+)</option>
                <option value="Suburban gated residential" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white py-2">Suburban residential pocket</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 dark:text-neutral-400">
                <svg className="size-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Vulnerable Member Pills with High Contrast */}
        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-300">Vulnerable members:</span>
            {['Asthmatic child', 'Senior (65+)', 'Infant / Toddler', 'Cardiac condition'].map((item) => {
              const active = vulnerable.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleVulnerable(item)}
                  className={cn(
                    "rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer border shadow-xs",
                    active
                      ? "border-amber-500 bg-amber-100 text-amber-900 dark:bg-amber-500/20 dark:text-amber-300 font-bold"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-neutral-500 dark:hover:text-white"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="btn-asym inline-flex h-11 items-center justify-center bg-neutral-900 text-white dark:bg-white dark:text-black px-6 text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                <span>Recalculating...</span>
              </>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-4 text-brand" />
                Update routine
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Routine Timeline */}
      {routines.length === 0 && !loading && (
        <div className="text-center py-10 border border-dashed border-border/40 rounded-xl p-6 space-y-3 bg-black/20">
          <Calendar className="size-9 text-neutral-400 mx-auto" />
          <h3 className="text-base font-semibold text-foreground">Calculating initial schedule...</h3>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto">
            Formulating hour-by-hour swaps tailored to current air conditions.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {routines.map((item, index) => {
            const isCompleted = !!completedSteps[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={cn(
                  "rounded-xl border p-5 transition-all",
                  isCompleted
                    ? "border-border/30 bg-neutral-100/40 dark:bg-black/10 opacity-70"
                    : "border-border/70 bg-white dark:bg-black/40 hover:border-border shadow-xs"
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      onClick={() => toggleStep(item.id)}
                      className="mt-0.5 text-neutral-500 hover:text-foreground cursor-pointer"
                      title={isCompleted ? "Mark incomplete" : "Mark step complete"}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="size-5 text-neutral-400 dark:text-neutral-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-neutral-800 dark:text-neutral-200">
                          {item.timeSlot}
                        </span>
                        <Chip tone={item.riskLevel === 'danger' ? 'danger' : 'default'} className="text-xs font-semibold">
                          {item.riskLevel} exposure
                        </Chip>
                        {item.maskRequired && (
                          <Chip tone="special" className="text-xs font-semibold">N95 mask</Chip>
                        )}
                      </div>
                      <h4 className={cn(
                        "text-base sm:text-lg font-bold text-foreground mt-1.5",
                        isCompleted && "line-through text-neutral-500"
                      )}>
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-mono font-medium text-neutral-800 dark:text-neutral-200 self-start md:self-auto bg-neutral-100 dark:bg-black/30 px-3 py-1.5 rounded-lg border border-border/60">
                    Saves <strong className="text-foreground">{item.personalImpact.co2SavedGrams}g CO₂</strong> • Avoids <strong className="text-emerald-700 dark:text-emerald-400">{item.personalImpact.pmInhaledAvoidedUg}µg PM2.5</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                  <div className="rounded-xl border border-red-500/40 bg-red-100/70 dark:bg-red-950/20 p-4 shadow-xs">
                    <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider block mb-1">Standard habit</span>
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">{item.standardHabit}</p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-100/70 dark:bg-emerald-950/20 p-4 shadow-xs">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">Low-emission alternative</span>
                    <p className="text-neutral-800 dark:text-neutral-100 leading-relaxed font-medium">{item.lowEmissionAlternative}</p>
                  </div>
                </div>

                <div className="mt-3.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5 pt-3 border-t border-border/50">
                  <Wind className="size-4 text-brand shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-foreground font-bold">Atmospheric context: </strong>
                    {item.scienceRationale}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
