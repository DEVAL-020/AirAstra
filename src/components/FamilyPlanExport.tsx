'use client';

import React from 'react';
import { AirQualityData } from '@/types';
import { Printer, ShieldCheck, Heart, Wind, CheckSquare } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface FamilyPlanExportProps {
  airData: AirQualityData;
}

export function FamilyPlanExport({ airData }: FamilyPlanExportProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card-chai p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Printable family smog protocol
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-1 max-w-xl leading-relaxed">
            A high-visibility action card to stick on the <Highlight>family refrigerator or notice board</Highlight> throughout the winter season.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Printer className="size-3.5 mr-1.5" />
          <span>Print or save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="rounded-xl border border-border/40 bg-black/20 p-6 space-y-5 print:border-black print:text-black print:bg-white text-neutral-200">
        <div className="flex items-start justify-between border-b border-border/30 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
              AirAstra Family Action Dossier
            </span>
            <h3 className="font-montserrat text-lg font-semibold text-foreground mt-0.5">
              Winter smog clean air operating plan ({airData.city})
            </h3>
            <span className="text-xs text-neutral-400">Baseline condition: {airData.category} / Safe flush window: {airData.ventilationSafeWindow}</span>
          </div>
          <div className="text-right">
            <Chip tone="default">Winter season protocol</Chip>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-lg border border-border/30 bg-black/30 space-y-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Heart className="size-3.5 text-brand" />
              1. Children and school protocol
            </span>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li>✓ Certified N95 mask packed in backpack side pouch</li>
              <li>✓ Eye wash drops and saline nasal spray for post-school rinse</li>
              <li>✓ Request indoor recess when AQI exceeds 200</li>
              <li>✓ Carpool van with closed windows strictly enforced</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-border/30 bg-black/30 space-y-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Wind className="size-3.5 text-brand" />
              2. Home sanctuary rules
            </span>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li>✓ Bedroom Corsi-Rosenthal filter runs 24/7 on Speed 1</li>
              <li>✓ Aerate home only during {airData.ventilationSafeWindow}</li>
              <li>✓ Towel draft-stopper placed under main entry door</li>
              <li>✓ Gas stove exhaust started 2 mins before cooking</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg border border-border/30 bg-black/30 space-y-2">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <CheckSquare className="size-3.5 text-brand" />
              3. Low-emission daily swaps
            </span>
            <ul className="space-y-1 text-neutral-400 text-[11px]">
              <li>✓ Shift morning cardio indoors to protect alveolar walls</li>
              <li>✓ Eliminate vehicle idle-warming; use shared transit</li>
              <li>✓ Electric kettle and induction boiling over open flame</li>
              <li>✓ Drink warm ginger infusion to lubricate bronchioles</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-neutral-400 gap-2">
          <span>Emergency respiratory helpline: 112 or local pediatric triage</span>
          <span className="font-mono text-neutral-400">Powered by AirAstra chaicode edition</span>
        </div>
      </div>
    </div>
  );
}
