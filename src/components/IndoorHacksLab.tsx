'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Layers, 
  Wind, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  DollarSign, 
  Check, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Flame,
  Flower2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IndoorHacksLabProps {
  onOpenPurifier3D: () => void;
}

export const IndoorHacksLab: React.FC<IndoorHacksLabProps> = ({ onOpenPurifier3D }) => {
  // CAD Calculator state
  const [roomLength, setRoomLength] = useState<number>(15);
  const [roomWidth, setRoomWidth] = useState<number>(12);
  const [roomHeight, setRoomHeight] = useState<number>(9);
  const [activeCategory, setActiveCategory] = useState<'all' | 'purifier' | 'sealing' | 'botanical' | 'cooking'>('all');
  const [expandedHack, setExpandedHack] = useState<string | null>('h1');

  // Calculation
  const roomVolumeCuFt = roomLength * roomWidth * roomHeight;
  const targetAch = 5; // Air changes per hour recommended by Harvard T.H. Chan School of Public Health
  const requiredCadr = Math.round((roomVolumeCuFt * targetAch) / 60);

  const hacks = [
    {
      id: 'h1',
      title: 'The Corsi-Rosenthal Box (Compounded Surface HEPA Alternative)',
      category: 'purifier',
      cost: '~$25 - $35 Total',
      difficulty: 'Easy (20 mins)',
      cadr: '450 - 550 CFM',
      savings: '$280 vs Commercial HEPA',
      materials: [
        '1x 20-inch standard box fan (3-speed)',
        '4x 20x20x1 or 20x20x2 MERV-13 furnace filters',
        '1x 20x20 cardboard base square',
        '1x Roll of duct tape or painter\'s tape',
        '1x Cardboard donut shroud (reduces fan back-eddy)'
      ],
      steps: [
        'Tape the 4 MERV-13 filters together in a cube, ensuring filter airflow arrows point INSIDE toward the center.',
        'Tape the cardboard bottom plate securely to seal the base of the cube.',
        'Place the 20" box fan on top, blowing air UPWARD out of the cube.',
        'Cut a circular cardboard shroud with an 18-inch diameter opening and tape it over the fan grille. This prevents corner air recirculation and increases airflow by 22%!',
        'Plug into outlet and run on Speed 1 (whisper quiet for sleep) or Speed 2 (rapid room scrub).'
      ],
      science: 'Standard commercial purifiers force air through 1 thick filter with high motor resistance. A 4-filter cube reduces air velocity across the filter medium by 75%, allowing MERV-13 fibers to capture sub-micron particles with 92%+ single-pass efficiency.'
    },
    {
      id: 'h2',
      title: 'Radiator-Assisted Wet Microfiber PM2.5 Aerosol Trap',
      category: 'sealing',
      cost: '~$3 (household items)',
      difficulty: '5 mins',
      cadr: 'Passive (~40 CFM eq.)',
      savings: '$80 vs Ultrasonic Vaporizer',
      materials: [
        '2x Microfiber towels',
        'Shallow metal roasting pan or ceramic tray',
        'Distilled or boiled clean water'
      ],
      steps: [
        'Fill tray with 1-2 cm of warm water and place atop or directly in front of the room heating radiator.',
        'Drape the lower edge of the microfiber towel in the water reservoir, hanging the rest vertically.',
        'Capillary action draws moisture upward across the towel weave as warm convection currents circulate through it.',
        'Replace or rinse the towel every 48 hours to clear trapped soot and prevent mold spores.'
      ],
      science: 'Winter smog is accompanied by ultra-dry air (<30% RH) which keeps nano-particulates electrostatically suspended. Evaporative humidification binds water molecules to hygroscopic soot, tripling their mass and causing them to precipitate onto surfaces rather than stay airborne.'
    },
    {
      id: 'h3',
      title: 'NASA 4-Tier Clean Air Botanical Sanctuary',
      category: 'botanical',
      cost: '~$15 - $25 per plant',
      difficulty: 'Set & forget',
      cadr: 'Biological VOC absorption',
      savings: 'Natural 24/7 bio-filter',
      materials: [
        'Sansevieria (Snake Plant / Mother-in-Law\'s Tongue)',
        'Areca Palm (Chrysalidocarpus lutescens)',
        'Epipremnum aureum (Money Plant / Golden Pothos)',
        'Spathiphyllum (Peace Lily)'
      ],
      steps: [
        'Place Snake Plant directly in the bedroom: it utilizes Crassulacean Acid Metabolism (CAM) to absorb CO2 and release oxygen at night during smog inversion.',
        'Place 1 Areca Palm in the living room per 100 sq ft: its high transpiration rate adds 1 liter of natural clean moisture to the air daily.',
        'Wipe plant leaves gently with a damp cotton cloth once a week — soot deposition clogs stomata and cuts botanical purification by 60%.'
      ],
      science: 'Proven by NASA Clean Air Study: Rhizosphere bacteria in plant potting soil break down ambient benzene, toluene, and formaldehyde trapped inside unventilated winter homes.'
    },
    {
      id: 'h4',
      title: 'Kitchen NO₂ Isolation & Thermal Pressure Defense',
      category: 'cooking',
      cost: '$0 (Technique)',
      difficulty: 'Immediate',
      cadr: 'Prevents 120 µg/m³ peak indoor NO₂',
      savings: '$150 vs Activated Carbon Unit',
      materials: [
        'Ducted kitchen exhaust hood',
        'Damp draft towel for interior door base',
        'Pot lids for all stove boiling/frying'
      ],
      steps: [
        'Always turn exhaust fan ON 2 minutes BEFORE lighting any gas burner to establish negative pressure draft.',
        'Close the internal door separating kitchen from bedrooms/living quarters.',
        'Keep lids tightly on pots to prevent steam/oil aerosol mixing.',
        'Never run kitchen exhaust and open bedroom windows simultaneously — this creates a vacuum chimney effect that pulls outside winter smog directly through bedroom gaps!'
      ],
      science: 'Gas burners produce unburned nitrogen dioxide (NO2) and carbon monoxide at levels exceeding WHO limits within 15 minutes of unventilated cooking in a closed winter home.'
    }
  ];

  const filteredHacks = activeCategory === 'all' 
    ? hacks 
    : hacks.filter(h => h.category === activeCategory);

  return (
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Wrench className="w-4 h-4 text-emerald-400" />
            <span>Frugal Engineering & Clean Air Science</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Indoor Air Quality Hacks & DIY Lab
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Scientifically validated, low-cost modifications to transform an ordinary apartment or house into a pressurized clean-air sanctuary for under $35.
          </p>
        </div>

        <button
          onClick={onOpenPurifier3D}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-300 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-lg shadow-emerald-950/40"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Launch 3D Purifier Simulator</span>
        </button>
      </div>

      {/* CAD Sizing Calculator Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900/90 to-[#0b1f19]/80 border border-emerald-500/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 text-white font-bold text-base">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>DIY Purifier & Room Sizing CAD Calculator</span>
          </div>
          <span className="text-xs font-mono text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            Harvard ACH Standard (5 Air Changes/Hour)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Room Length (feet):</label>
            <input
              type="number"
              value={roomLength}
              onChange={(e) => setRoomLength(Math.max(6, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Room Width (feet):</label>
            <input
              type="number"
              value={roomWidth}
              onChange={(e) => setRoomWidth(Math.max(6, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Ceiling Height (feet):</label>
            <input
              type="number"
              value={roomHeight}
              onChange={(e) => setRoomHeight(Math.max(7, Number(e.target.value)))}
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Calculated Results Bar */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Room Volume</span>
            <span className="text-lg font-bold font-mono text-white">{roomVolumeCuFt.toLocaleString()} cu ft</span>
            <span className="text-[10px] text-slate-500 block">({roomLength * roomWidth} sq ft floor)</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Required CADR</span>
            <span className="text-lg font-bold font-mono text-emerald-300">{requiredCadr} CFM</span>
            <span className="text-[10px] text-emerald-400/80 block">For 5 Air Changes/hr</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Recommended Build</span>
            <span className="text-sm font-bold text-white block mt-1">
              {requiredCadr > 350 ? '4-Filter Corsi Box' : '2-Filter Compounded Wedge'}
            </span>
            <span className="text-[10px] text-cyan-400">MERV-13 Certified</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Estimated Build Cost</span>
            <span className="text-lg font-bold font-mono text-emerald-400">~$28 Total</span>
            <span className="text-[10px] text-slate-400 block">Saves ~$320</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-2">Filter by Category:</span>
        {[
          { id: 'all', label: 'All Hacks' },
          { id: 'purifier', label: 'DIY Purifiers' },
          { id: 'sealing', label: 'Drafts & Sealing' },
          { id: 'botanical', label: 'Botanical Filters' },
          { id: 'cooking', label: 'Kitchen & Combustion' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeCategory === cat.id
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Hacks Accordion List */}
      <div className="space-y-4">
        {filteredHacks.map((hack) => {
          const isOpen = expandedHack === hack.id;

          return (
            <div
              key={hack.id}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'bg-slate-900/80 border-emerald-500/40 shadow-xl'
                  : 'bg-slate-900/40 border-white/5 hover:border-emerald-500/20'
              }`}
            >
              {/* Accordion Trigger */}
              <button
                onClick={() => setExpandedHack(isOpen ? null : hack.id)}
                className="w-full p-5 text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                    {hack.category === 'purifier' && <Wind className="w-5 h-5" />}
                    {hack.category === 'sealing' && <ShieldCheck className="w-5 h-5" />}
                    {hack.category === 'botanical' && <Flower2 className="w-5 h-5" />}
                    {hack.category === 'cooking' && <Flame className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{hack.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {hack.cost}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {hack.difficulty}
                      </span>
                      <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {hack.cadr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-slate-400 hover:text-white">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Accordion Content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 border-t border-white/5 space-y-4 text-xs">
                      {/* Materials Needed */}
                      <div>
                        <span className="font-semibold text-slate-300 block mb-2">Materials Needed:</span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                          {hack.materials.map((m, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Step-by-Step Build */}
                      <div>
                        <span className="font-semibold text-slate-300 block mb-2">Step-by-Step Instructions:</span>
                        <div className="space-y-2">
                          {hack.steps.map((st, i) => (
                            <div key={i} className="flex items-start space-x-2.5 p-2 rounded-lg bg-black/20 text-slate-300">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold">
                                {i + 1}
                              </span>
                              <p className="leading-relaxed">{st}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scientific Mechanics */}
                      <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400 block mb-1">Aerosol Science & Fluid Mechanics:</strong>
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
};
