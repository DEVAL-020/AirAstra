'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Wind, 
  ChevronDown,
  ChevronUp,
  Cpu,
  Flame,
  Flower2,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface IndoorHacksLabProps {
  onOpenPurifier3D: () => void;
}

export function IndoorHacksLab({ onOpenPurifier3D }: IndoorHacksLabProps) {
  const [roomLength, setRoomLength] = useState<number>(15);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [roomHeight, setRoomHeight] = useState<number>(9);
  const [activeCategory, setActiveCategory] = useState<'all' | 'purifier' | 'sealing' | 'botanical' | 'cooking'>('all');
  const [expandedHack, setExpandedHack] = useState<string | null>('h1');

  const roomVolumeCuFt = roomLength * roomWidth * roomHeight;
  const targetAch = 5;
  const requiredCadr = Math.round((roomVolumeCuFt * targetAch) / 60);

  const hacks = [
    {
      id: 'h1',
      title: 'The Corsi-Rosenthal box (compounded surface HEPA alternative)',
      category: 'purifier',
      cost: '~$25 to $35 total',
      difficulty: 'Easy (20 mins)',
      cadr: '450 to 550 CFM',
      materials: [
        '1x 20-inch standard box fan (3-speed)',
        '4x 20x20x1 or 20x20x2 MERV-13 furnace filters',
        '1x 20x20 cardboard base square',
        '1x Roll of duct tape or painter tape',
        '1x Cardboard donut shroud with 18-inch hole'
      ],
      steps: [
        'Tape the 4 MERV-13 filters together into a square cube. Make sure the filter airflow arrows point inside toward the center.',
        'Tape the cardboard bottom plate securely to seal the base of the cube.',
        'Place the 20-inch box fan on top, blowing air upward out of the cube.',
        'Cut a circular cardboard donut shroud with an 18-inch diameter opening and tape it over the fan grille. This prevents corner air recirculation and increases airflow by 22 percent.',
        'Plug in and run on Speed 1 for quiet nighttime filtration or Speed 2 for rapid post-commute room clearing.'
      ],
      science: 'Standard commercial purifiers force air through one thick filter with high resistance. A four-filter cube increases total filtration surface area by 400 percent, reducing static backpressure and allowing maximum airflow.'
    },
    {
      id: 'h2',
      title: 'Radiator-assisted wet microfiber PM2.5 aerosol trap',
      category: 'sealing',
      cost: '~$3 (household items)',
      difficulty: '5 mins',
      cadr: 'Passive (~40 CFM eq.)',
      materials: [
        '2x Clean microfiber towels',
        'Shallow metal tray or ceramic dish',
        'Clean boiled or distilled water'
      ],
      steps: [
        'Fill shallow tray with 1 to 2 cm of water and place directly in front of or on top of your radiator.',
        'Drape the bottom edge of the microfiber towel into the water, hanging the rest vertically.',
        'Capillary action draws moisture upward across the towel weave as warm radiator currents flow through it.',
        'Rinse or replace towel every 48 hours to remove collected dust and prevent mold.'
      ],
      science: 'Winter smog is accompanied by dry air below 30 percent relative humidity, which keeps fine particles electrostatically suspended. Evaporative humidification binds water molecules to hygroscopic soot, tripling their mass and causing them to precipitate onto surfaces.'
    },
    {
      id: 'h3',
      title: 'NASA clean air botanical sanctuary',
      category: 'botanical',
      cost: '~$15 to $25 per plant',
      difficulty: 'Set and forget',
      cadr: 'Biological VOC absorption',
      materials: [
        'Sansevieria (Snake Plant / Mother-in-Law Tongue)',
        'Areca Palm (Chrysalidocarpus lutescens)',
        'Epipremnum aureum (Money Plant / Golden Pothos)',
        'Spathiphyllum (Peace Lily)'
      ],
      steps: [
        'Place Snake Plant in the bedroom: it utilizes Crassulacean Acid Metabolism to absorb CO2 and release oxygen at night during winter smog inversion.',
        'Place one Areca Palm in the living room per 100 square feet: its high transpiration rate adds 1 liter of natural clean moisture to the air daily.',
        'Wipe plant leaves gently with a damp cotton cloth once a week. Soot deposition clogs leaf stomata and cuts botanical absorption by 60 percent.'
      ],
      science: 'NASA Clean Air research demonstrates that rhizosphere bacteria in plant potting soil break down ambient benzene, toluene, and formaldehyde trapped inside unventilated winter homes.'
    },
    {
      id: 'h4',
      title: 'Kitchen NO₂ isolation and thermal pressure defense',
      category: 'cooking',
      cost: '$0 (Technique)',
      difficulty: 'Immediate',
      cadr: 'Prevents 120 µg/m³ peak indoor NO₂',
      materials: [
        'Ducted kitchen exhaust hood',
        'Damp draft towel for interior door base',
        'Pot lids for all stove boiling and frying'
      ],
      steps: [
        'Turn exhaust fan on 2 minutes before lighting any gas burner to establish negative pressure draft.',
        'Close the internal door separating kitchen from bedrooms and living quarters.',
        'Keep lids tightly on pots to prevent steam and oil aerosol mixing.',
        'Never run kitchen exhaust and open bedroom windows simultaneously. This creates a vacuum chimney effect that pulls outside winter smog directly through bedroom gaps.'
      ],
      science: 'Gas burners produce unburned nitrogen dioxide and carbon monoxide at levels exceeding WHO limits within 15 minutes of unventilated cooking in a closed winter home.'
    }
  ];

  const filteredHacks = activeCategory === 'all' 
    ? hacks 
    : hacks.filter((h) => h.category === activeCategory);

  return (
    <div className="card-chai p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="font-montserrat text-xl font-semibold text-foreground">
            Indoor hacks and DIY filter lab
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Low-cost modifications and blueprints to build a <Highlight>pressurized clean-air sanctuary</Highlight> for under $35.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenPurifier3D}
          className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <Wind className="size-3.5 mr-1.5" />
          <span>Launch 3D filter simulator</span>
        </button>
      </div>

      {/* CAD Calculator */}
      <div className="rounded-xl border border-border/40 bg-black/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="size-4 text-brand" />
            <h3 className="font-montserrat text-sm font-semibold text-foreground">
              Room sizing and CADR calculator
            </h3>
          </div>
          <Chip tone="default">Harvard 5 ACH standard</Chip>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="text-neutral-400 block mb-1">Room length (feet)</label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(Math.max(6, Number(e.target.value)))}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Room width (feet)</label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Math.max(6, Number(e.target.value)))}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-brand"
            />
          </div>
          <div>
            <label className="text-neutral-400 block mb-1">Ceiling height (feet)</label>
            <input
              type="number"
              value={roomHeight}
              onChange={(e) => setRoomHeight(Math.max(7, Number(e.target.value)))}
              className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs font-mono text-foreground focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border/30 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block">Room volume</span>
            <span className="font-mono text-sm font-semibold text-foreground">{roomVolumeCuFt.toLocaleString()} cu ft</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 block">Target CADR</span>
            <span className="font-mono text-sm font-semibold text-brand">{requiredCadr} CFM</span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 block">Recommended build</span>
            <span className="text-xs font-semibold text-foreground block">
              {requiredCadr > 350 ? '4-Filter Corsi-Rosenthal cube' : '2-Filter wedge'}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 block">Estimated build cost</span>
            <span className="font-mono text-sm font-semibold text-foreground">~$28 total</span>
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'All hacks' },
          { id: 'purifier', label: 'DIY purifiers' },
          { id: 'sealing', label: 'Drafts and sealing' },
          { id: 'botanical', label: 'Botanical plants' },
          { id: 'cooking', label: 'Kitchen and combustion' }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id as any)}
            className={`rounded px-3 py-1 text-xs transition-colors cursor-pointer border ${
              activeCategory === cat.id
                ? 'border-brand text-brand bg-brand/5'
                : 'border-border/40 text-neutral-400 hover:text-foreground hover:bg-black/20'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Blueprints Accordion */}
      <div className="space-y-3">
        {filteredHacks.map((hack) => {
          const isOpen = expandedHack === hack.id;

          return (
            <div
              key={hack.id}
              className="rounded-xl border border-border/40 bg-black/20 transition-colors"
            >
              <button
                type="button"
                onClick={() => setExpandedHack(isOpen ? null : hack.id)}
                className="w-full p-4 text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-black/30 text-brand">
                    {hack.category === 'purifier' && <Wind className="size-4" />}
                    {hack.category === 'sealing' && <ShieldCheck className="size-4" />}
                    {hack.category === 'botanical' && <Flower2 className="size-4" />}
                    {hack.category === 'cooking' && <Flame className="size-4" />}
                  </div>
                  <div>
                    <h4 className="font-montserrat text-sm font-semibold text-foreground">{hack.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Chip tone="default">{hack.cost}</Chip>
                      <span className="text-[11px] text-neutral-400">{hack.difficulty}</span>
                      <span className="text-[11px] text-neutral-400 font-mono">{hack.cadr}</span>
                    </div>
                  </div>
                </div>

                <div className="text-neutral-400">
                  {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-border/30 space-y-4 text-xs">
                      <div>
                        <span className="font-semibold text-neutral-300 block mb-1.5">Materials needed</span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-neutral-400">
                          {hack.materials.map((m, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="size-1 rounded-full bg-brand" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-neutral-300 block mb-1.5">Build steps</span>
                        <div className="space-y-1.5">
                          {hack.steps.map((st, i) => (
                            <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-black/20 text-neutral-300">
                              <span className="font-mono text-[11px] text-neutral-400 shrink-0 font-semibold">
                                {i + 1}.
                              </span>
                              <p className="leading-relaxed">{st}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-border/30 bg-black/30 text-neutral-400 leading-relaxed">
                        <strong className="text-neutral-200 block mb-0.5">Physical mechanics</strong>
                        {hack.science}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
