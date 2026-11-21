'use client';

import React, { useState } from 'react';
import { AirQualityData, RoutineItem } from '@/types';
import { generateAIAirRoutine } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Leaf, 
  Wind, 
  TrendingDown,
  Loader2,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface RoutineArchitectProps {
  airData: AirQualityData;
}

export function RoutineArchitect({ airData }: RoutineArchitectProps) {
  const [householdType, setHouseholdType] = useState('Family with young school kids');
  const [commuteMode, setCommuteMode] = useState('Two-wheeler / Motorbike commute');
  const [vulnerable, setVulnerable] = useState<string[]>(['Asthmatic child']);
  const [housingType, setHousingType] = useState('Mid-rise flat near arterial road');
  
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

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
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#ffffff', '#f59e0b', '#10b981']
      });
    }
  };

  const toggleVulnerable = (item: string) => {
    if (vulnerable.includes(item)) {
      setVulnerable(vulnerable.filter((v) => v !== item));
    } else {
      setVulnerable([...vulnerable, item]);
    }
  };

  const totalCo2Saved = routines.reduce((sum, r) => sum + r.personalImpact.co2SavedGrams, 0);
  const totalPmAvoided = routines.reduce((sum, r) => sum + r.personalImpact.pmInhaledAvoidedUg, 0);

  return (
    <div className="card-chai p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="font-montserrat text-xl font-semibold text-foreground">
            Low-emission daily routine
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Plan your day around {airData.city}&apos;s winter inversion curve with <Highlight>practical emission alternatives</Highlight> that reduce lung exposure.
          </p>
        </div>

        {routines.length > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-black/20 px-3.5 py-2">
            <div className="text-right">
              <span className="text-[10px] text-neutral-400 block">Personal daily impact</span>
              <span className="text-xs font-mono font-semibold text-foreground">
                -{(totalCo2Saved / 1000).toFixed(1)}kg CO₂ / -{totalPmAvoided}µg PM2.5
              </span>
            </div>
            <div className="flex size-7 items-center justify-center rounded-md border border-border bg-black/30 text-brand">
              <Leaf className="size-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* Household configurator */}
      <div className="rounded-xl border border-border/40 bg-black/20 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            Household and commute profile
          </span>
          <span className="text-[11px] text-neutral-400">
            Tailored to your daily exposure
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-neutral-400 block mb-1">Household structure</label>
            <select
              value={householdType}
              onChange={(e) => setHouseholdType(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs text-foreground focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="Family with young school kids">Family with young school kids</option>
              <option value="Dual-income professionals">Dual-income professionals</option>
              <option value="Multi-generation family with seniors">Multi-generation family with seniors</option>
              <option value="Solo remote worker & pets">Solo remote worker & pets</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Primary daily transit</label>
            <select
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs text-foreground focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="Two-wheeler / Motorbike commute">Two-wheeler / Motorbike (Open air)</option>
              <option value="Private Petrol/Diesel Car">Private car</option>
              <option value="Metro / Public Transit">Metro or electric bus</option>
              <option value="Remote / Work From Home">Work from home</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Dwelling exposure</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs text-foreground focus:outline-none focus:border-brand cursor-pointer"
            >
              <option value="Mid-rise flat near arterial road">Mid-rise flat near arterial road</option>
              <option value="Ground floor independent house">Ground floor independent house</option>
              <option value="High-rise apartment (12th floor+)">High-rise apartment (12th floor+)</option>
              <option value="Suburban gated residential">Suburban residential pocket</option>
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-border/30 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-neutral-400">Vulnerable members:</span>
          {['Asthmatic child', 'Senior (65+)', 'Infant / Toddler', 'Cardiac condition'].map((item) => {
            const active = vulnerable.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleVulnerable(item)}
                className={`rounded px-2.5 py-1 text-xs transition-colors cursor-pointer border ${
                  active
                    ? 'border-brand text-brand bg-brand/5'
                    : 'border-border/40 text-neutral-400 hover:text-foreground hover:bg-black/30'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Formulating routine...</span>
              </>
            ) : (
              <span>{routines.length > 0 ? 'Update routine' : 'Generate routine'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Routine Timeline */}
      {routines.length === 0 && !loading && (
        <div className="text-center py-8 border border-dashed border-border/40 rounded-xl p-6 space-y-2">
          <Calendar className="size-8 text-neutral-500 mx-auto" />
          <h3 className="font-montserrat text-sm font-semibold text-foreground">No routine generated yet</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Click Generate routine to calculate hour-by-hour swaps tailored to current air conditions.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {routines.map((item, index) => {
            const isCompleted = !!completedSteps[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`rounded-xl border p-4 transition-colors ${
                  isCompleted
                    ? 'border-border/20 bg-black/10 opacity-70'
                    : 'border-border/40 bg-black/20 hover:border-border'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleStep(item.id)}
                      className="mt-0.5 text-neutral-400 hover:text-foreground cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="size-4 text-green-400" />
                      ) : (
                        <Circle className="size-4" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-neutral-400">
                          {item.timeSlot}
                        </span>
                        <Chip tone={item.riskLevel === 'danger' ? 'danger' : 'default'}>
                          {item.riskLevel} exposure
                        </Chip>
                        {item.maskRequired && (
                          <Chip tone="special">N95 mask</Chip>
                        )}
                      </div>
                      <h4 className={`font-montserrat text-sm font-semibold text-foreground mt-1 ${isCompleted ? 'line-through text-neutral-500' : ''}`}>
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-neutral-400 self-start md:self-auto">
                    Saves {item.personalImpact.co2SavedGrams}g CO₂ / Avoids {item.personalImpact.pmInhaledAvoidedUg}µg PM2.5
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs">
                  <div className="rounded-lg border border-red-500/20 bg-red-950/10 p-3">
                    <span className="text-[11px] font-semibold text-red-400 block mb-1">Standard habit</span>
                    <p className="text-neutral-300 leading-relaxed">{item.standardHabit}</p>
                  </div>

                  <div className="rounded-lg border border-green-500/20 bg-green-950/10 p-3">
                    <span className="text-[11px] font-semibold text-green-400 block mb-1">Low-emission alternative</span>
                    <p className="text-neutral-200 leading-relaxed">{item.lowEmissionAlternative}</p>
                  </div>
                </div>

                <div className="mt-2.5 text-xs text-neutral-400 flex items-start gap-2 pt-2 border-t border-border/20">
                  <Wind className="size-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-neutral-300">Atmospheric context: </strong>
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
