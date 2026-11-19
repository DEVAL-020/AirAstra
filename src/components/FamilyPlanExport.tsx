'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { Printer, Download, ShieldCheck, Heart, Wind, CheckSquare, Sparkles } from 'lucide-react';

interface FamilyPlanExportProps {
  airData: AirQualityData;
}

export const FamilyPlanExport: React.FC<FamilyPlanExportProps> = ({ airData }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Family Preparedness Blueprint</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Printable Family Refrigerator Smog Protocol
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            A concise, high-visibility action card to print out and stick on the refrigerator or family notice board throughout the winter smog season.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all hover:scale-102 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet Card */}
      <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 print:border-black print:text-black print:bg-white text-slate-200">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              AirAstra Family Defense Dossier
            </span>
            <h3 className="text-xl font-black text-white mt-0.5">
              Winter Smog & Clean Air Operating Plan ({airData.city})
            </h3>
            <span className="text-xs text-slate-400">Baseline Inversion Condition: {airData.category} • Safe Window: {airData.ventilationSafeWindow}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 block">UPDATED</span>
            <span className="text-xs font-mono font-bold text-emerald-400">Current Winter Season</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Column 1: School & Kids */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2.5">
            <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5" />
              1. Children & School Protocol
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>✓ Certified N95 mask packed in backpack side pouch</li>
              <li>✓ Eye wash drops & saline nasal spray for post-school rinse</li>
              <li>✓ Request indoor recess when AQI &gt; 200</li>
              <li>✓ Carpool van with closed windows strictly enforced</li>
            </ul>
          </div>

          {/* Column 2: Home Sanctuary */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2.5">
            <span className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5" />
              2. Home Sanctuary Rules
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>✓ Bedroom Corsi-Rosenthal filter runs 24/7 on Speed 1</li>
              <li>✓ Aerate home ONLY during {airData.ventilationSafeWindow}</li>
              <li>✓ Towel draft-stopper placed under main entry door</li>
              <li>✓ Gas stove exhaust fan started 2 mins before cooking</li>
            </ul>
          </div>

          {/* Column 3: Daily Routine */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2.5">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              3. Low-Emission Daily Swaps
            </span>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>✓ Shift morning cardio indoors to protect alveolar walls</li>
              <li>✓ Eliminate vehicle idle-warming; use metro or carpool</li>
              <li>✓ Electric kettle / induction boiling over open flame</li>
              <li>✓ Drink warm ginger infusion to lubricate bronchioles</li>
            </ul>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Emergency Respiratory Helpline: <strong>112 / Local Pediatric Triage</strong></span>
          <span className="font-mono text-emerald-400">Powered by AirAstra • Winter Clean Air Initiative</span>
        </div>
      </div>
    </div>
  );
};
