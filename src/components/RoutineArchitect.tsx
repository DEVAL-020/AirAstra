'use client';

import React, { useState } from 'react';
import { AirQualityData, RoutineItem } from '@/types';
import { generateAIAirRoutine } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { 
  CalendarClock, 
  Sparkles, 
  Car, 
  Bike, 
  Train, 
  Baby, 
  HeartHandshake, 
  CheckCircle2, 
  Circle, 
  Leaf, 
  Wind, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoutineArchitectProps {
  airData: AirQualityData;
}

export const RoutineArchitect: React.FC<RoutineArchitectProps> = ({ airData }) => {
  const [householdType, setHouseholdType] = useState('Family with young school kids');
  const [commuteMode, setCommuteMode] = useState('Two-wheeler / Motorbike commute');
  const [vulnerable, setVulnerable] = useState<string[]>(['Asthmatic child']);
  const [housingType, setHousingType] = useState('Mid-rise flat near arterial road');
  
  const [loading, setLoading] = useState(false);
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Generate initial routine
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

  // Toggle completion of a step
  const toggleStep = (id: string) => {
    const nextState = !completedSteps[id];
    setCompletedSteps((prev) => ({ ...prev, [id]: nextState }));
    
    if (nextState) {
      soundFX.playChime();
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#38bdf8']
      });
    }
  };

  // Vulnerability toggle
  const toggleVulnerable = (item: string) => {
    if (vulnerable.includes(item)) {
      setVulnerable(vulnerable.filter(v => v !== item));
    } else {
      setVulnerable([...vulnerable, item]);
    }
  };

  // Calculate total saved impact
  const totalCo2Saved = routines.reduce((sum, r) => sum + r.personalImpact.co2SavedGrams, 0);
  const totalPmAvoided = routines.reduce((sum, r) => sum + r.personalImpact.pmInhaledAvoidedUg, 0);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>GenAI Lifestyle Adaptation Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Low-Emission Daily Routine Architect
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Generates custom daily schedules engineered around {airData.city}&apos;s winter inversion curve to minimize toxic lung deposition and slash community tailpipe emissions.
          </p>
        </div>

        {/* Impact summary counters */}
        {routines.length > 0 && (
          <div className="flex items-center space-x-3 bg-emerald-950/40 border border-emerald-500/30 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Daily Direct Impact</span>
              <span className="text-xs font-bold text-emerald-300">
                -{(totalCo2Saved / 1000).toFixed(1)}kg CO₂ • -{totalPmAvoided}µg PM2.5
              </span>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Household & Commute Configurator Tabs */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 md:p-5 space-y-4">
        <span className="text-xs font-semibold text-slate-300 block">Personalize for Your Family & Living Scenario:</span>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Household Type */}
          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Household Structure:</label>
            <select
              value={householdType}
              onChange={(e) => setHouseholdType(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Family with young school kids">Family with young school kids</option>
              <option value="Dual-income professionals">Dual-income professionals</option>
              <option value="Multi-generation family with seniors">Multi-generation family with seniors</option>
              <option value="Solo remote worker & pets">Solo remote worker & pets</option>
            </select>
          </div>

          {/* Commute Mode */}
          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Primary Daily Transit:</label>
            <select
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Two-wheeler / Motorbike commute">Two-wheeler / Motorbike (High Exposure)</option>
              <option value="Private Petrol/Diesel Car">Private Petrol/Diesel Car</option>
              <option value="Metro / Public Transit">Metro / Public Transit</option>
              <option value="Remote / Work From Home">Remote / Work From Home</option>
            </select>
          </div>

          {/* Housing Environment */}
          <div>
            <label className="text-slate-400 block mb-1.5 font-medium">Dwelling Exposure:</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Mid-rise flat near arterial road">Mid-rise flat near arterial road</option>
              <option value="Ground floor independent house">Ground floor independent house (Severe Inversion)</option>
              <option value="High-rise apartment (12th floor+)">High-rise apartment (Above initial boundary)</option>
              <option value="Suburban gated residential">Suburban residential pocket</option>
            </select>
          </div>
        </div>

        {/* Vulnerable check pills */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Vulnerable members present:</span>
          {['Asthmatic child', 'Senior (65+)', 'Infant / Toddler', 'Cardiac history'].map((item) => {
            const active = vulnerable.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleVulnerable(item)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Smog Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{routines.length > 0 ? 'Regenerate Custom Routine' : 'Generate AI Smog Routine'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Routine Timeline Cards */}
      {routines.length === 0 && !loading && (
        <div className="text-center py-12 border border-dashed border-emerald-500/20 rounded-3xl p-8 space-y-3">
          <CalendarClock className="w-10 h-10 text-emerald-400/60 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">Ready to Architect Your Winter Day</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &quot;Generate AI Smog Routine&quot; above to calculate hour-by-hour routines tailored to your lifestyle and current AQI in {airData.city}.
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
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-75'
                    : 'bg-slate-900/60 border-white/10 hover:border-emerald-500/30'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  {/* Left: Time and Title */}
                  <div className="flex items-start space-x-3.5">
                    <button
                      onClick={() => toggleStep(item.id)}
                      className="mt-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                          {item.timeSlot}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          item.riskLevel === 'danger'
                            ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                            : item.riskLevel === 'caution'
                            ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                            : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                        }`}>
                          {item.riskLevel} exposure
                        </span>
                        {item.maskRequired && (
                          <span className="text-[10px] bg-slate-800 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/20">
                            N95 Mask Needed
                          </span>
                        )}
                      </div>
                      <h4 className={`text-base font-bold text-white mt-1 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Right: Personal Impact Pill */}
                  <div className="flex items-center space-x-2 text-xs bg-black/40 border border-white/5 px-3 py-1.5 rounded-xl self-start md:self-auto">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300">
                      Saves <strong className="text-emerald-300 font-mono">{item.personalImpact.co2SavedGrams}g CO₂</strong> & avoids <strong className="text-cyan-300 font-mono">{item.personalImpact.pmInhaledAvoidedUg}µg</strong> PM2.5
                    </span>
                  </div>
                </div>

                {/* Habit Swap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/15">
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-1">Standard Habit</span>
                    <p className="text-slate-300">{item.standardHabit}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/25">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Low-Emission Alternative</span>
                    <p className="text-emerald-200 font-medium">{item.lowEmissionAlternative}</p>
                  </div>
                </div>

                {/* Atmospheric Science Explainer */}
                <div className="mt-3 text-[11px] text-slate-400 flex items-start space-x-2 bg-black/20 p-2.5 rounded-lg">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-300">Why this matters: </strong>
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
};
