'use client';

import React, { useState } from 'react';
import { CityPreset, POPULAR_CITIES } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { soundFX } from '@/lib/sound';
import { getGeminiKey, saveGeminiKey } from '@/lib/gemini';
import { 
  Wind, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Key, 
  ShieldAlert, 
  Compass, 
  Sparkles,
  X,
  Check,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  airData: AirQualityData;
  onOpenPurifier3D: () => void;
  onOpenEmergency: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  onSelectCity,
  airData,
  onOpenPurifier3D,
  onOpenEmergency
}) => {
  const [isAmbientOn, setIsAmbientOn] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const toggleSound = () => {
    const newState = soundFX.toggleHepaHum();
    setIsAmbientOn(newState);
  };

  const handleOpenKeyModal = () => {
    const existing = getGeminiKey() || '';
    setApiKeyInput(existing);
    setShowKeyModal(true);
    setSavedSuccess(false);
  };

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    saveGeminiKey(apiKeyInput);
    setSavedSuccess(true);
    soundFX.playChime();
    setTimeout(() => {
      setShowKeyModal(false);
      setSavedSuccess(false);
    }, 1200);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const customCity: CityPreset = {
          name: 'My Location',
          country: 'Local Coordinates',
          lat: Number(pos.coords.latitude.toFixed(4)),
          lon: Number(pos.coords.longitude.toFixed(4)),
          winterSmogReason: 'Local ambient urban atmospheric boundary readings.'
        };
        onSelectCity(customCity);
        soundFX.playChime();
      },
      (err) => {
        alert('Could not retrieve location: ' + err.message);
      }
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-emerald-500/20 px-4 md:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30">
              <Wind className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                AirAstra
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-300/80 font-mono">
                Winter Smog & Community Clean Air OS
              </span>
            </div>
          </div>

          {/* City Selector & Geolocation */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-white/10 rounded-2xl px-3 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = POPULAR_CITIES.find(c => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                  {c.name}, {c.country}
                </option>
              ))}
              {currentCity.name === 'My Location' && (
                <option value="My Location" className="bg-slate-900 text-white">
                  My Location (GPS)
                </option>
              )}
            </select>

            <button
              onClick={handleGeoLocation}
              title="Detect my location"
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-2.5">
            {/* Live AQI Badge */}
            <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              airData.aqi > 250
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : airData.aqi > 150
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              <span>AQI {airData.aqi}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>

            {/* Ambient Purifier Sound FX Toggle */}
            <button
              onClick={toggleSound}
              title={isAmbientOn ? 'Turn off HEPA filter white noise' : 'Play relaxing HEPA filter hum (pink noise)'}
              className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isAmbientOn
                  ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isAmbientOn ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Gemini API Key Config */}
            <button
              onClick={handleOpenKeyModal}
              title="Configure Gemini GenAI Key"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Gemini API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Gemini GenAI Key Setup</h3>
                  <p className="text-xs text-slate-400">Optional: Bring your own Gemini API key</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              AirAstra comes with a full, calibrated atmospheric AI model that works out of the box. Adding your own Google Gemini API key enables direct live multimodal reasoning.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Google Gemini API Key:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                  <Check className="w-4 h-4" />
                  <span>Key saved securely to local browser storage!</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
