'use client';

import React, { useState } from 'react';
import { VisionDiagnosticResult } from '@/types';
import { analyzeIndoorSmogPhoto } from '@/lib/gemini';
import { soundFX } from '@/lib/sound';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  AlertCircle, 
  Flower2, 
  Loader2, 
  Eye, 
  RefreshCw,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AirSnapVisionProps {
  currentAQI: number;
}

export const AirSnapVision: React.FC<AirSnapVisionProps> = ({ currentAQI }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roomContext, setRoomContext] = useState<string>('Living Room Window & Balcony Door');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VisionDiagnosticResult | null>(null);

  // Sample presets for instant testing
  const presets = [
    {
      label: 'Single-Pane Window with Micro-Drafts',
      context: 'Living Room Window Sash',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%231e293b"/><rect x="40" y="30" width="220" height="140" fill="%23334155" stroke="%2394a3b8" stroke-width="4"/><line x1="150" y1="30" x2="150" y2="170" stroke="%2394a3b8" stroke-width="3"/><line x1="40" y1="100" x2="260" y2="100" stroke="%2394a3b8" stroke-width="3"/><text x="75" y="115" fill="%23cbd5e1" font-size="12" font-family="sans-serif">Leaky Winter Sill</text></svg>'
    },
    {
      label: 'Obstructed Filter in Dark Corner',
      context: 'Master Bedroom Filter Setup',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%230f172a"/><rect x="20" y="70" width="60" height="110" fill="%23475569" stroke="%2364748b" stroke-width="2"/><text x="95" y="125" fill="%2394a3b8" font-size="12" font-family="sans-serif">Choked Wall Placement</text></svg>'
    },
    {
      label: 'Unventilated Gas Cooktop',
      context: 'Kitchen Stove & Exhaust Vent',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%2318181b"/><circle cx="100" cy="120" r="30" fill="%2327272a" stroke="%23f59e0b" stroke-width="3"/><circle cx="200" cy="120" r="30" fill="%2327272a" stroke="%23ef4444" stroke-width="3"/><text x="90" y="60" fill="%23fbbf24" font-size="12" font-family="sans-serif">Combustion NO2 Spike</text></svg>'
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
    <div className="w-full glass-panel rounded-3xl p-6 md:p-8 border border-emerald-500/20 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-semibold uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Multimodal Vision Diagnostic AI</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            AirSnap Indoor Smog Hazard Scanner
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Upload a snapshot of your room, window frame, or air purifier setup. Vision AI detects thermal drafts, filter choke points, and combustion pollution.
          </p>
        </div>

        <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-3 py-1.5 rounded-full font-mono">
          Gemini 1.5 Flash Multimodal Vision
        </span>
      </div>

      {/* Upload & Preset Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Input Viewport */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-white/5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">Select or Upload Room Scene:</label>
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
                      ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="relative border-2 border-dashed border-emerald-500/30 rounded-2xl p-4 text-center hover:border-emerald-500/60 transition-colors bg-black/20">
            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Selected scene"
                  className="max-h-48 mx-auto rounded-xl border border-white/10 object-contain shadow-md"
                />
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-[11px] text-slate-400 font-mono">{roomContext}</span>
                  <label className="text-[11px] text-emerald-400 underline cursor-pointer hover:text-emerald-300">
                    Change Photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                <Upload className="w-8 h-8 text-emerald-400/70 mb-2" />
                <span className="text-xs font-semibold text-slate-200">Click to upload photo or drag & drop</span>
                <span className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG, WEBP from your phone or camera</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          {/* Run Diagnostic Button */}
          <button
            onClick={runDiagnostic}
            disabled={!selectedImage || loading}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 cursor-pointer disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Computer Vision Diagnostic...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run Vision Smog Scan</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Diagnostic Results */}
        <div className="lg:col-span-7 bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* Score Header */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Indoor Smog Defense Rating</span>
                  <span className="text-2xl font-black text-white flex items-center gap-2">
                    {result.smogDefenseScore} / 100
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      result.smogDefenseScore >= 75
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {result.leakageRisk} Leakage Risk
                    </span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Purifier Placement</span>
                  <span className="text-xs font-bold text-cyan-300 font-mono">{result.purifierPlacementRating}</span>
                </div>
              </div>

              {/* Identified Hazards Breakdown */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-200 block">AI Detected Vulnerabilities:</span>
                {result.identifiedHazards.map((hz, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <AlertCircle className={`w-3.5 h-3.5 ${hz.severity === 'High' ? 'text-rose-400' : 'text-amber-400'}`} />
                        {hz.item}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded ${
                        hz.severity === 'High' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {hz.severity} Severity
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{hz.description}</p>
                    <div className="pt-1 text-[11px] text-emerald-300 font-medium">
                      💡 <strong>Prescribed Remedy: </strong>{hz.fix}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Checklist & Botanical Recommendation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Priority Action Steps
                  </span>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    {result.actionChecklist.slice(0, 3).map((act, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-400 font-mono">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-950/25 border border-teal-500/20">
                  <span className="font-bold text-teal-300 block mb-2 flex items-center gap-1.5">
                    <Flower2 className="w-3.5 h-3.5" />
                    Botanical Zoning Advice
                  </span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {result.botanicalPlacementTip}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-3">
              <Eye className="w-10 h-10 text-emerald-500/40" />
              <h4 className="text-sm font-semibold text-slate-300">No Image Diagnosed Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Select one of the sample scenarios on the left or upload your own room/window photo to run the GenAI visual diagnostic.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
