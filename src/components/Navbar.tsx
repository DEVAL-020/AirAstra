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
  Search,
  CloudFog
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
          country: 'GPS Location',
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
      <header className="sticky top-0 z-40 w-full bg-[#0b1118]/85 border-b border-white/5 px-4 md:px-8 py-2.5 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Weather App Style Logo */}
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/90">
              <CloudFog className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-base font-semibold tracking-tight text-white">AirAstra</span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-white/40">Air Weather</span>
            </div>
          </div>

          {/* Minimalist City Selector */}
          <div className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3.5 py-1.5 text-xs transition-colors shadow-sm">
            <Search className="w-3.5 h-3.5 text-white/40 shrink-0" />
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = POPULAR_CITIES.find(c => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1 text-xs"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-[#121a24] text-white">
                  {c.name}, {c.country}
                </option>
              ))}
              {currentCity.name === 'My Location' && (
                <option value="My Location" className="bg-[#121a24] text-white">
                  My Location (GPS)
                </option>
              )}
            </select>

            <button
              onClick={handleGeoLocation}
              title="Detect my location"
              className="p-1 rounded-full hover:bg-white/15 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center space-x-2">
            {/* Ambient Sound Toggle */}
            <button
              onClick={toggleSound}
              title={isAmbientOn ? 'Turn off air filter hum' : 'Play quiet air purifier hum'}
              className={`p-2 rounded-full border text-xs transition-all cursor-pointer ${
                isAmbientOn
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-white/5 border-white/5 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {isAmbientOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* API Key Modal */}
            <button
              onClick={handleOpenKeyModal}
              title="API Key Configuration"
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Key Setup Dialog */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-md weather-card-solid p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">Gemini API Key</h3>
                <p className="text-xs text-white/50 mt-0.5">Optional: Connect your personal Gemini key</p>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-white/50 hover:text-white p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              AirAstra works out of the box with calibrated atmospheric models. Entering a key enables direct vision analysis and live reasoning.
            </p>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center space-x-2 text-xs text-emerald-300 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/30">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Key saved securely to browser!</span>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs shadow-md cursor-pointer hover:bg-white/90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
