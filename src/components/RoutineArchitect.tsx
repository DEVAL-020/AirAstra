'use client';

import React, { useState } from 'react';
import { AirQualityData, RoutineItem } from '@/types';
import { generateAIAirRoutine } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { 
  Calendar, 
  Car, 
  CheckCircle2, 
  Circle, 
  Leaf, 
  Wind, 
  TrendingDown,
  Loader2,
  RefreshCw,
  UserCheck
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
        colors: ['#10b981', '#34d399', '#38bdf8']
      });
    }
  };

  const toggleVulnerable = (item: string) => {
    if (vulnerable.includes(item)) {
      setVulnerable(vulnerable.filter(v => v !== item));
    } else {
      setVulnerable([...vulnerable, item]);
    }
  };

  const totalCo2Saved = routines.reduce((sum, r) => sum + r.personalImpact.co2SavedGrams, 0);
  const totalPmAvoided = routines.reduce((sum, r) => sum + r.personalImpact.pmInhaledAvoidedUg, 0);

  return (
    <div className="w-full bg-[#0b1813] rounded-3xl p-5 sm:p-7 border border-white/10 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily Smog Navigation Plan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Low-Emission Daily Routine
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Personalized hour-by-hour schedule designed around {airData.city}&apos;s winter inversion peaks. Protect your family&apos;s lungs while lowering your personal tailpipe footprint.
          </p>
        </div>

        {routines.length > 0 && (
          <div className="flex items-center space-x-3 bg-[#11241c] border border-emerald-500/30 px-4 py-2 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Personal Direct Savings</span>
              <span className="text-xs font-bold text-emerald-300">
                -{(totalCo2Saved / 1000).toFixed(1)}kg CO₂ • -{totalPmAvoided}µg PM2.5
              </span>
            </div>
            <div className="p-2 bg-emerald-500/15 rounded-xl text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>

      {/* Household & Commute Configurator */}
      <div className="bg-[#10221a] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            Tell us about your household & daily travel:
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-400" />
            Human-centered tailoring
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Household Type:</label>
            <select
              value={householdType}
              onChange={(e) => setHouseholdType(e.target.value)}
              className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Family with young school kids">Family with young school kids</option>
              <option value="Dual-income professionals">Dual-income professionals</option>
              <option value="Multi-generation family with seniors">Multi-generation family with seniors</option>
              <option value="Solo remote worker & pets">Solo remote worker & pets</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Main Daily Commute:</label>
            <select
              value={commuteMode}
              onChange={(e) => setCommuteMode(e.target.value)}
              className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Two-wheeler / Motorbike commute">Two-wheeler / Motorbike (Open Air)</option>
              <option value="Private Petrol/Diesel Car">Private Car</option>
              <option value="Metro / Public Transit">Metro / Bus Transit</option>
              <option value="Remote / Work From Home">Remote / Work From Home</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Home Location Exposure:</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value)}
              className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs"
            >
              <option value="Mid-rise flat near arterial road">Mid-rise flat near arterial road</option>
              <option value="Ground floor independent house">Ground floor independent house</option>
              <option value="High-rise apartment (12th floor+)">High-rise apartment (12th floor+)</option>
              <option value="Suburban gated residential">Suburban residential pocket</option>
            </select>
          </div>
        </div>

        {/* Vulnerable check pills */}
        <div className="pt-2 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400">Vulnerable family members:</span>
          {['Asthmatic child', 'Senior (65+)', 'Infant / Toddler', 'Cardiac condition'].map((item) => {
            const active = vulnerable.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleVulnerable(item)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border ${
                  active
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-[#0a1712] border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Generate Button */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Formulating Your Day...</span>
              </>
            ) : (
              <span>{routines.length > 0 ? 'Update Routine' : 'Generate Daily Routine'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Routine Cards */}
      {routines.length === 0 && !loading && (
        <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl p-6 space-y-2">
          <Calendar className="w-8 h-8 text-emerald-400/50 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">Ready to Plan Your Day</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click &quot;Generate Daily Routine&quot; above to see practical swaps tailored to your home and current air quality in {airData.city}.
          </p>
        </div>
      )}

      <div className="space-y-3.5">
        <AnimatePresence>
          {routines.map((item, index) => {
            const isCompleted = !!completedSteps[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-[#0a1712]/60 border-emerald-500/30 opacity-70'
                    : 'bg-[#10221a] border-white/5 hover:border-emerald-500/20'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
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
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-black/30 text-slate-300 border border-white/5">
                          {item.timeSlot}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.riskLevel === 'danger'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : item.riskLevel === 'caution'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {item.riskLevel}
                        </span>
                        {item.maskRequired && (
                          <span className="text-[10px] bg-[#0c1a14] text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                            N95 Mask Needed
                          </span>
                        )}
                      </div>
                      <h4 className={`text-base font-bold text-white mt-1 ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs bg-black/30 border border-white/5 px-3 py-1.5 rounded-xl self-start md:self-auto">
                    <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-300 text-[11px]">
                      Saves <strong className="text-emerald-300 font-mono">{item.personalImpact.co2SavedGrams}g CO₂</strong> • Avoids <strong className="text-cyan-300 font-mono">{item.personalImpact.pmInhaledAvoidedUg}µg</strong> PM2.5
                    </span>
                  </div>
                </div>

                {/* Habit Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/15">
                    <span className="text-[10px] uppercase font-bold text-red-300 block mb-1">Standard Habit</span>
                    <p className="text-slate-300 leading-relaxed">{item.standardHabit}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/25 border border-emerald-500/20">
                    <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Low-Emission Alternative</span>
                    <p className="text-emerald-200 font-medium leading-relaxed">{item.lowEmissionAlternative}</p>
                  </div>
                </div>

                {/* Why this matters */}
                <div className="mt-3 text-[11px] text-slate-400 flex items-start space-x-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
                  <Wind className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-200">The science: </strong>
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
