'use client';

import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';
import { soundFX } from '@/lib/sound';
import { Chip } from '@/components/ui/chip';

interface EmergencySmogModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
  aqi: number;
}

export function EmergencySmogModal({ isOpen, onClose, city, aqi }: EmergencySmogModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    soundFX.playChime();
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const protocols = [
    {
      id: 'p1',
      title: 'Consolidate household into a single clean room',
      desc: 'Pick the smallest interior bedroom with the fewest external windows. Relocate infants, asthmatics, and seniors here with the air purifier running.'
    },
    {
      id: 'p2',
      title: 'Perimeter micro-draft sealing',
      desc: 'Roll damp towels and press them tightly along exterior door sills and window seams to block incoming cold particulate infiltration.'
    },
    {
      id: 'p3',
      title: 'Vehicle AC emergency recirculation',
      desc: 'If travel is unavoidable, set vehicle climate control strictly to internal recirculation. Never draw outside air in traffic congestion.'
    },
    {
      id: 'p4',
      title: 'Certified N95 mask seal check',
      desc: 'Pinch the metal nose strip firmly against the nose bridge with both hands. Inhale sharply: the mask should slightly pull inward without edge leakage.'
    },
    {
      id: 'p5',
      title: 'Mucociliary hydration and nasal rinse',
      desc: 'Drink warm water with ginger; perform isotonic saline nasal flush to clear acid aerosols and soot from upper airway cilia.'
    }
  ];

  const allCompleted = protocols.every((p) => checkedItems[p.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="card-chai relative w-full max-w-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/40 pb-3 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 shrink-0">
              <ShieldAlert className="size-4 sm:size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-montserrat text-base sm:text-lg font-bold text-foreground">
                  Severe smog lockdown protocol
                </h3>
                <Chip tone="danger">Level 4</Chip>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">
                Active alert for {city} (AQI {aqi})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-foreground p-1.5 cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Warning callout */}
        <div className="p-3.5 sm:p-4 rounded-xl border border-red-500/40 bg-red-100/80 dark:bg-red-950/20 text-xs sm:text-sm text-red-900 dark:text-red-300 flex items-start gap-3 font-medium shadow-xs">
          <AlertTriangle className="size-4.5 sm:size-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Cold thermal inversion has collapsed the ground boundary layer. Cease outdoor physical exertion and maintain continuous HEPA or Corsi-Rosenthal filtration.
          </p>
        </div>

        {/* Checklist */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 [scrollbar-width:none]">
          <span className="text-xs sm:text-sm font-bold text-foreground block">
            Tactical defense checklist
          </span>
          {protocols.map((p) => {
            const isDone = !!checkedItems[p.id];

            return (
              <div
                key={p.id}
                onClick={() => toggleCheck(p.id)}
                role="button"
                tabIndex={0}
                className={`p-3.5 sm:p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-3.5 shadow-xs ${
                  isDone
                    ? 'border-border/30 bg-neutral-100/40 dark:bg-black/10 opacity-70'
                    : 'border-border/70 bg-white dark:bg-black/20 hover:border-border'
                }`}
              >
                <div className="mt-0.5 text-neutral-500">
                  {isDone ? (
                    <CheckCircle2 className="size-5 text-emerald-600 dark:text-green-400" />
                  ) : (
                    <Circle className="size-5 text-neutral-400" />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm sm:text-base font-bold text-foreground ${isDone ? 'line-through text-neutral-500' : ''}`}>
                    {p.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-400 font-mono">
            {Object.values(checkedItems).filter(Boolean).length} / {protocols.length} completed
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 text-white dark:bg-white dark:text-black px-4 text-xs font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-xs"
          >
            {allCompleted ? 'Lockdown secured' : 'Acknowledge protocol'}
          </button>
        </div>
      </div>
    </div>
  );
}
