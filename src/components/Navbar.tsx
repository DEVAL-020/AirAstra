'use client';

import React, { useState, useEffect } from 'react';
import { CityPreset, POPULAR_CITIES } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { soundFX } from '@/lib/sound';
import { getGeminiKey, saveGeminiKey } from '@/lib/gemini';
import { 
  Volume2, 
  VolumeX, 
  Key, 
  Compass, 
  X,
  Check,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  currentCity: CityPreset;
  onSelectCity: (city: CityPreset) => void;
  airData: AirQualityData;
}

export function Navbar({
  currentCity,
  onSelectCity,
  airData
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200',
          scrolled
            ? 'border-b border-border/40 bg-background/80 backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-12">
          {/* Logo in ChaiCode style */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-black/20 text-white">
              <span className="font-brand text-lg font-bold text-brand">A</span>
            </div>
            <div>
              <span className="font-brand text-xl font-bold tracking-tight text-foreground">
                AirAstra
              </span>
              <span className="ml-2 text-xs text-neutral-400 font-medium">
                chaicode edition
              </span>
            </div>
          </div>

          {/* City selector in toolbar style */}
          <div className="flex items-center gap-2.5 rounded-lg border border-border bg-black/20 px-3.5 py-2 text-sm">
            <Search className="size-4 text-neutral-400" />
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = POPULAR_CITIES.find((c) => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="bg-transparent text-sm sm:text-base font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="bg-neutral-900 text-white">
                  {c.name}, {c.country}
                </option>
              ))}
              {currentCity.name === 'My Location' && (
                <option value="My Location" className="bg-neutral-900 text-white">
                  My Location (GPS)
                </option>
              )}
            </select>

            <button
              type="button"
              onClick={handleGeoLocation}
              title="Detect my location"
              aria-label="Detect my location"
              className="rounded p-1 text-neutral-400 hover:text-brand transition-colors"
            >
              <Compass className="size-4" />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              title={isAmbientOn ? 'Mute air purifier sound' : 'Play ambient purifier sound'}
              aria-label="Toggle sound"
              className={cn(
                'inline-flex size-9 items-center justify-center rounded-md border text-sm transition-colors',
                isAmbientOn
                  ? 'border-brand text-brand'
                  : 'border-border text-neutral-400 hover:text-foreground hover:bg-neutral-800/40'
              )}
            >
              {isAmbientOn ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>

            <button
              type="button"
              onClick={handleOpenKeyModal}
              title="Configure Gemini key"
              aria-label="Configure Gemini key"
              className="inline-flex size-9 items-center justify-center rounded-md border border-border text-neutral-400 hover:text-foreground hover:bg-neutral-800/40 transition-colors"
            >
              <Key className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card-chai relative w-full max-w-md p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-montserrat text-base font-semibold text-foreground">Gemini API Key</h3>
                <p className="text-xs text-neutral-400">Optional: connect your personal key for live visual inspection</p>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="text-neutral-400 hover:text-foreground p-1"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full h-9 rounded-md border border-border bg-black/30 px-3 text-xs text-foreground focus:outline-none focus:border-brand font-mono"
                />
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 text-xs text-green-400">
                  <Check className="size-4" />
                  <span>Key saved securely to browser</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="inline-flex h-8 items-center px-3 text-xs text-neutral-400 hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-asym inline-flex h-8 items-center bg-white px-4 text-xs font-semibold text-black hover:bg-neutral-200"
                >
                  Save key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
