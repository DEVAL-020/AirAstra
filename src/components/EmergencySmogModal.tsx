'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Circle, AlertTriangle, HeartPulse, Wind, Stethoscope } from 'lucide-react';
import { soundFX } from '@/lib/sound';

interface EmergencySmogModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  aqi: number;
}

export const EmergencySmogModal: React.FC<EmergencySmogModalProps> = ({ isOpen, onClose, city, aqi }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    soundFX.playChime();
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const protocols = [
    {
      id: 'p1',
      title: 'Consolidate Household into a Single "Clean Room"',
      desc: 'Pick the smallest interior bedroom with the fewest external windows. Relocate infants, asthmatics, and seniors here with the air purifier on high.'
    },
    {
      id: 'p2',
      title: 'Perimeter Micro-Draft Sealing',
      desc: 'Roll damp towels and press them tightly along the exterior door sill and window seams to block incoming cold particulate infiltration.'
    },
    {
      id: 'p3',
      title: 'Vehicle AC Emergency Recirculation',
      desc: 'If travel is unavoidable, set vehicle climate control strictly to "Internal Recirculation". Never draw outside air in traffic jams.'
    },
    {
      id: 'p4',
      title: 'Certified N95 / FFP2 Seal Check',
      desc: 'Pinch metal nose-strip firmly against bridge of nose with both hands. Perform negative pressure check: inhale sharply; mask should slightly collapse inward without edge leakage.'
    },
    {
      id: 'p5',
      title: 'Mucociliary Hydration & Nasal Rinse',
      desc: 'Drink warm water with ginger; perform isotonic saline nasal flush to clear acid aerosols and soot from upper airway cilia.'
    }
  ];

  const allCompleted = protocols.every(p => checkedItems[p.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-rose-950 via-slate-950 to-slate-950 border border-rose-500/50 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-rose-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/20 border border-rose-500/40 rounded-2xl text-rose-400 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-bold block">
                Severe Smog Lockdown Protocol
              </span>
              <h3 className="text-xl font-black text-white">
                Emergency Smog Defense: {city} (AQI {aqi})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning callout */}
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <p className="leading-relaxed">
            Cold thermal inversion has collapsed ground boundary height. Ultrafine PM2.5 levels are in the hazardous toxic zone. Cease all outdoor physical exertion immediately.
          </p>
        </div>

        {/* Action Checklist */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
          <span className="text-xs font-bold text-slate-300 block">Immediate Tactical Defense Checklist:</span>
          {protocols.map((p) => {
            const isDone = !!checkedItems[p.id];

            return (
              <div
                key={p.id}
                onClick={() => toggleCheck(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isDone
                    ? 'bg-rose-950/20 border-emerald-500/40 opacity-80'
                    : 'bg-slate-900/60 border-white/10 hover:border-rose-500/40'
                }`}
              >
                <div className="mt-0.5 text-slate-400">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-bold text-white ${isDone ? 'line-through text-slate-400' : ''}`}>
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-rose-500/20 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Completed: <strong className="text-white font-mono">{Object.values(checkedItems).filter(Boolean).length} / {protocols.length}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-950/50 cursor-pointer"
          >
            {allCompleted ? 'Lockdown Plan Secured' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
