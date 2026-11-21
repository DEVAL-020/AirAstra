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
  Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip } from '@/components/ui/chip';
import { Highlight } from '@/components/ui/highlight';

interface AirSnapVisionProps {
  currentAQI: number;
}

export function AirSnapVision({ currentAQI }: AirSnapVisionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [roomContext, setRoomContext] = useState<string>('Living room window and balcony door');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<VisionDiagnosticResult | null>(null);

  const presets = [
    {
      label: 'Single-pane sliding window sill',
      context: 'Living room window sash',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111111"/><rect x="40" y="30" width="220" height="140" fill="%23181818" stroke="%23333333" stroke-width="2"/><line x1="150" y1="30" x2="150" y2="170" stroke="%23444444" stroke-width="2"/><line x1="40" y1="100" x2="260" y2="100" stroke="%23444444" stroke-width="2"/><text x="80" y="115" fill="%23aaaaaa" font-size="12" font-family="sans-serif">Window Micro-Gaps</text></svg>'
    },
    {
      label: 'Purifier choked behind wall or curtain',
      context: 'Bedroom filter placement',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111111"/><rect x="25" y="70" width="60" height="110" fill="%231a1a1a" stroke="%23333333" stroke-width="2"/><text x="100" y="125" fill="%23888888" font-size="12" font-family="sans-serif">Wall-Blocked Intake</text></svg>'
    },
    {
      label: 'Unvented gas cooktop in kitchen',
      context: 'Kitchen stove and exhaust',
      preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23111111"/><circle cx="95" cy="115" r="28" fill="%231c1c1c" stroke="%23f59e0b" stroke-width="2"/><circle cx="195" cy="115" r="28" fill="%231c1c1c" stroke="%23ef4444" stroke-width="2"/><text x="85" y="60" fill="%23fbbf24" font-size="12" font-family="sans-serif">Internal Combustion</text></svg>'
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
    <div className="card-chai p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            AirSnap room scanner
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 mt-1 max-w-xl leading-relaxed">
            Take or upload a photo of your window frame, radiator, or room corner to identify <Highlight>indoor particulate infiltration points</Highlight> and drafts.
          </p>
        </div>

        <Chip tone="default" className="text-xs sm:text-sm font-semibold">Building envelope scan</Chip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 rounded-xl border border-border/40 bg-black/20 p-5">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">
              Choose a sample scenario or upload yours
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(p.preview);
                    setRoomContext(p.context);
                  }}
                  className={`rounded border px-2.5 py-1 text-xs transition-colors cursor-pointer text-left ${
                    selectedImage === p.preview
                      ? 'border-brand text-brand bg-brand/5'
                      : 'border-border/40 text-neutral-400 hover:text-foreground hover:bg-black/30'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Area */}
          <div className="relative border border-dashed border-border/60 rounded-xl p-4 text-center hover:border-brand transition-colors bg-black/30">
            {selectedImage ? (
              <div className="space-y-2.5">
                <img
                  src={selectedImage}
                  alt="Selected scene"
                  className="max-h-44 mx-auto rounded-lg border border-border/40 object-contain"
                />
                <div className="flex items-center justify-center gap-3">
                  <span className="text-[11px] text-neutral-400">{roomContext}</span>
                  <label className="text-[11px] text-brand underline cursor-pointer">
                    Change photo
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-6 cursor-pointer">
                <Upload className="size-6 text-neutral-500 mb-2" />
                <span className="text-xs font-semibold text-neutral-200">Upload window or room photo</span>
                <span className="text-[10px] text-neutral-500 mt-0.5">JPG or PNG from phone or camera</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            )}
          </div>

          <button
            type="button"
            onClick={runDiagnostic}
            disabled={!selectedImage || loading}
            className="w-full inline-flex h-9 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
                <span>Inspecting infiltration points...</span>
              </>
            ) : (
              <span>Run room inspection</span>
            )}
          </button>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-7 rounded-xl border border-border/40 bg-black/20 p-5 flex flex-col justify-between">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/40 bg-black/30">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Defense rating</span>
                  <span className="font-montserrat text-xl font-semibold text-foreground flex items-center gap-2">
                    {result.smogDefenseScore} / 100
                    <Chip tone={result.smogDefenseScore >= 75 ? 'success' : 'danger'}>
                      {result.leakageRisk} leakage
                    </Chip>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Purifier placement</span>
                  <span className="font-mono text-xs font-medium text-foreground">{result.purifierPlacementRating}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-foreground block">Detected vulnerabilities:</span>
                {result.identifiedHazards.map((hz, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-border/30 bg-black/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-200 flex items-center gap-1.5">
                        <AlertCircle className="size-3.5 text-neutral-400" />
                        {hz.item}
                      </span>
                      <Chip tone={hz.severity === 'High' ? 'danger' : 'default'}>{hz.severity} priority</Chip>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">{hz.description}</p>
                    <div className="pt-0.5 text-[11px] text-brand">
                      Recommended fix: {hz.fix}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3 rounded-lg border border-border/30 bg-black/20">
                  <span className="font-semibold text-foreground block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="size-3.5 text-green-400" />
                    Action checklist
                  </span>
                  <ul className="space-y-1 text-neutral-400 text-[11px]">
                    {result.actionChecklist.slice(0, 3).map((act, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-neutral-500">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-border/30 bg-black/20">
                  <span className="font-semibold text-foreground block mb-1.5 flex items-center gap-1.5">
                    <Flower2 className="size-3.5 text-brand" />
                    Botanical advice
                  </span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    {result.botanicalPlacementTip}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-neutral-400 space-y-2">
              <Eye className="size-8 text-neutral-600" />
              <h4 className="font-montserrat text-sm font-semibold text-foreground">No photo scanned yet</h4>
              <p className="text-xs text-neutral-500 max-w-xs">
                Select one of the sample scenarios on the left or upload a photo to inspect room drafts and filter placement.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
