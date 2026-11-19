'use client';

import React, { useState } from 'react';
import { VisionDiagnosticResult } from '@/types';
import { analyzeIndoorSmogPhoto } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import { 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Flower2, 
  Loader2, 
  Eye, 
  Layers,
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AirSnapVisionProps {
  currentAQI: number;
}

export const AirSnapVision: React.FC<AirSnapVisionProps> = ({ currentAQI }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roomContext, setRoomContext] = useState<string>('Living Room Window & Balcony Door');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VisionDiagnosticResult | null>(null);

  const presets = [
    {
      label: 'Single-Pane Sliding Window Sill',
      context: 'Living Room Window Sash',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2313221b"/><rect x="40" y="30" width="220" height="140" fill="%231a3127" stroke="%2334d399" stroke-width="2"/><line x1="150" y1="30" x2="150" y2="170" stroke="%2334d399" stroke-width="2"/><line x1="40" y1="100" x2="260" y2="100" stroke="%2334d399" stroke-width="2"/><text x="80" y="115" fill="%23a7f3d0" font-size="12" font-family="sans-serif">Window Micro-Gaps</text></svg>'
    },
    {
      label: 'Purifier Choked Behind Wall/Curtain',
      context: 'Bedroom Filter Placement',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111f18"/><rect x="25" y="70" width="60" height="110" fill="%231c382b" stroke="%236ee7b7" stroke-width="2"/><text x="100" y="125" fill="%2394a3b8" font-size="12" font-family="sans-serif">Wall-Blocked Intake</text></svg>'
    },
    {
      label: 'Unvented Gas Cooktop in Kitchen',
      context: 'Kitchen Stove & Exhaust',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23151f1a"/><circle cx="95" cy="115" r="28" fill="%2322382c" stroke="%23f59e0b" stroke-width="2"/><circle cx="195" cy="115" r="28" fill="%2322382c" stroke="%23ef4444" stroke-width="2"/><text x="85" y="60" fill="%23fbbf24" font-size="12" font-family="sans-serif">Internal Combustion</text></svg>'
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runDiagnostic = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const res = await analyzeIndoorSmogPhoto(selectedImage, roomContext, currentAQI);
      setResult(res);
      soundFX.playChime();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0b1813] rounded-3xl p-5 sm:p-7 border border-white/10 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>Indoor Air & Leak Diagnostic</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            AirSnap Room Vulnerability Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Take or upload a photo of your window frame, radiator, or room corner. Inspects for cold inversion draft infiltration, filter choking, and indoor gas traps.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-[#10221a] px-3 py-1.5 rounded-full border border-white/5">
          <Home className="w-3.5 h-3.5 text-emerald-400" />
          <span>Building Envelope Health</span>
        </div>
      </div>

      {/* Upload and Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Image Selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[#10221a] p-5 rounded-2xl border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Choose a sample room scenario or upload yours:</label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(p.preview);
                    setRoomContext(p.context);
                  }}
                  className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedImage === p.preview
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                      : 'bg-[#0a1712] border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-emerald-500/40 transition-colors bg-black/20">
            {selectedImage ? (
              <div className="space-y-2.5">
                <img
                  src={selectedImage}
                  alt="Selected scene"
                  className="max-h-44 mx-auto rounded-xl border border-white/10 object-contain"
                />
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-[11px] text-slate-400">{roomContext}</span>
                  <label className="text-[11px] text-emerald-400 underline cursor-pointer hover:text-emerald-300">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                <Upload className="w-7 h-7 text-emerald-400/60 mb-2" />
                <span className="text-xs font-semibold text-slate-200">Upload window or room photo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG from your camera</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Run Diagnostic Button */}
          <button
            onClick={runDiagnostic}
            disabled={!selectedImage || loading}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Infiltration Points...</span>
              </>
            ) : (
              <span>Run Room Inspection</span>
            )}
          </button>
        </div>

        {/* Right Column: Findings */}
        <div className="lg:col-span-7 bg-[#0f2018] border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Scorecard */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#142e22] border border-emerald-500/25">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-300 block">Smog Defense Rating</span>
                  <span className="text-2xl font-black text-white flex items-center gap-2">
                    {result.smogDefenseScore} / 100
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      result.smogDefenseScore >= 75
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {result.leakageRisk} Leakage
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Air Purifier Airflow</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{result.purifierPlacementRating}</span>
                </div>
              </div>

              {/* Identified Issues */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Detected Vulnerabilities:</span>
                {result.identifiedHazards.map((hz, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#12251d] border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <AlertCircle className={`w-3.5 h-3.5 ${hz.severity === 'High' ? 'text-rose-400' : 'text-amber-400'}`} />
                        {hz.item}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded ${
                        hz.severity === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {hz.severity} Priority
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{hz.description}</p>
                    <div className="pt-1 text-[11px] text-emerald-300">
                      🛠️ <strong>Recommended Fix: </strong>{hz.fix}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Steps & Plants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-[#12251d] border border-white/5">
                  <span className="font-bold text-emerald-400 block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Action Steps
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {result.actionChecklist.slice(0, 3).map((act, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-[#12251d] border border-white/5">
                  <span className="font-bold text-teal-300 block mb-1.5 flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5" />
                    Botanical Recommendation
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {result.botanicalPlacementTip}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-10 text-slate-400 space-y-2">
              <Eye className="w-8 h-8 text-emerald-500/40" />
              <h4 className="text-sm font-semibold text-slate-300">No Photo Scanned Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Select one of the sample scenarios on the left or upload a photo to inspect room drafts and filter placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
