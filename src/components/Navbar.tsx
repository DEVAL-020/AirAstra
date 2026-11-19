'use client';

import React, { useState } from 'react';
import { CityPreset, POPULAR_CITIES } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { soundFX } from '@/lib/sound';
import { getGeminiKey, saveGeminiKey } from '@/lib/gemini';
import { 
  MapPin, 
  Volume2, 
  VolumeX, 
  Key, 
  Compass, 
  X,
  Check,
  ShieldAlert,
  HelpCircle
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
      <header className="sticky top-0 z-40 w-full bg-[#091510]/90 border-b border-white/10 px-4 md:px-8 py-3 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Human Brand Name */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#142e22] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold tracking-tight text-white">AirAstra</span>
                <span className="text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full">
                  Urban Health OS
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-400 leading-none">
                Community Winter Smog & Clean Air Assistant
              </p>
            </div>
          </div>

          {/* City Selector */}
          <div className="flex items-center space-x-2 bg-[#10221a] border border-white/10 rounded-xl px-3 py-1.5 text-xs shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = POPULAR_CITIES.find(c => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-[#10221a] text-white">
                  {c.name}, {c.country}
                </option>
              ))}
              {currentCity.name === 'My Location' && (
                <option value="My Location" className="bg-[#10221a] text-white">
                  My Location (GPS)
                </option>
              )}
            </select>

            <button
              onClick={handleGeoLocation}
              title="Detect my location"
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            {/* Live AQI Badge */}
            <div className={`hidden md:flex items-center space-x-2 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
              airData.aqi > 200
                ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              <span>AQI {airData.aqi}</span>
            </div>

            {/* Ambient Purifier Sound FX Toggle */}
            <button
              onClick={toggleSound}
              title={isAmbientOn ? 'Turn off HEPA filter white noise' : 'Play relaxing HEPA filter hum'}
              className={`p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                isAmbientOn
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-[#12241c] border-white/10 text-slate-400 hover:text-white hover:bg-[#183126]'
              }`}
            >
              {isAmbientOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* API Key settings modal */}
            <button
              onClick={handleOpenKeyModal}
              title="Configure Gemini API Key (Optional)"
              className="p-2 rounded-xl bg-[#12241c] hover:bg-[#183126] border border-white/10 text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Key Setup Dialog */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#10221a] border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
                <p className="text-xs text-slate-400 mt-0.5">Optional: Direct connection to live Gemini models</p>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              AirAstra comes with a calibrated atmospheric reasoning model pre-installed. Adding your Gemini API key enables direct multimodal vision parsing and conversational synthesis.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Your API Key:</label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#0a1712] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center space-x-2 text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Key saved securely to your browser!</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer"
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
