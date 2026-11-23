'use client';

import React, { useState, useEffect } from 'react';
import { CityPreset, POPULAR_CITIES } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { soundFX } from '@/lib/sound';
import { 
  Volume2, 
  VolumeX, 
  Compass, 
  Search,
  ChevronDown,
  Loader2,
  Info,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const [isLocating, setIsLocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!geoNotice) return;
    const timer = setTimeout(() => setGeoNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [geoNotice]);

  const toggleSound = () => {
    const newState = soundFX.toggleHepaHum();
    setIsAmbientOn(newState);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser. Please select your city from the dropdown.');
      return;
    }
    setIsLocating(true);
    setGeoNotice(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
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
        setIsLocating(false);
        if (err.code === 1) {
          // PERMISSION_DENIED
          setGeoNotice('Location permission was denied. You can select your city from the dropdown or enable location in your browser address bar.');
        } else if (err.code === 2) {
          // POSITION_UNAVAILABLE
          setGeoNotice('GPS position is currently unavailable. Please pick your city from the list.');
        } else {
          // TIMEOUT or other
          setGeoNotice('Location request timed out. Please pick your city from the dropdown.');
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled
          ? 'border-b border-border/40 bg-background/80 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-2.5 sm:px-6 lg:px-12 gap-1 sm:gap-3 w-full max-w-full">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="flex size-7.5 sm:size-9 items-center justify-center rounded-lg border border-border bg-neutral-100 dark:bg-black/20 text-brand shadow-xs">
            <span className="font-brand text-sm sm:text-lg font-bold text-brand">A</span>
          </div>
          <span className="hidden min-[380px]:inline font-brand text-base sm:text-xl font-bold tracking-tight text-foreground">
            AirAstra
          </span>
        </div>

        {/* City selector in toolbar style */}
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-neutral-300 dark:border-border/80 bg-white dark:bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm shadow-xs flex-1 min-w-0 max-w-[190px] sm:max-w-none">
          <Search className="size-3.5 sm:size-4 text-brand shrink-0" />
          <div className="relative flex-1 min-w-0 flex items-center">
            <select
              value={currentCity.name}
              onChange={(e) => {
                const found = POPULAR_CITIES.find((c) => c.name === e.target.value);
                if (found) onSelectCity(found);
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none cursor-pointer truncate appearance-none pr-4.5"
            >
              <optgroup label="India (Major Metros & Smog Zones)">
                {POPULAR_CITIES.filter(c => c.country === 'India').map((c) => (
                  <option key={c.name} value={c.name} className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white py-1">
                    {c.name}, {c.country}
                  </option>
                ))}
              </optgroup>
              <optgroup label="International Winter Inversion Cities">
                {POPULAR_CITIES.filter(c => c.country !== 'India' && c.name !== 'My Location').map((c) => (
                  <option key={c.name} value={c.name} className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white py-1">
                    {c.name}, {c.country}
                  </option>
                ))}
              </optgroup>
              {currentCity.name === 'My Location' && (
                <option value="My Location" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white py-1">
                  My Location (GPS)
                </option>
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 size-3 sm:size-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
          </div>

          <button
            type="button"
            onClick={handleGeoLocation}
            disabled={isLocating}
            title={isLocating ? 'Detecting your location...' : 'Detect my location'}
            aria-label="Detect my location"
            className="rounded p-0.5 text-neutral-500 dark:text-neutral-400 hover:text-brand transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isLocating ? (
              <Loader2 className="size-3.5 sm:size-4 animate-spin text-brand" />
            ) : (
              <Compass className="size-3.5 sm:size-4" />
            )}
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            title={isAmbientOn ? 'Mute air purifier sound' : 'Play ambient purifier sound'}
            aria-label="Toggle sound"
            className={cn(
              'inline-flex size-7.5 sm:size-9 items-center justify-center rounded-md border text-xs sm:text-sm transition-colors cursor-pointer shadow-xs shrink-0',
              isAmbientOn
                ? 'border-brand text-brand bg-brand/10'
                : 'border-neutral-300 dark:border-border bg-white dark:bg-transparent text-neutral-700 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800/40'
            )}
          >
            {isAmbientOn ? <Volume2 className="size-3.5 sm:size-4" /> : <VolumeX className="size-3.5 sm:size-4" />}
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* Gentle Geolocation Notice Toast */}
      {geoNotice && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-3 sm:px-6 py-2 text-xs sm:text-sm text-amber-200 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
            <Info className="size-4 text-amber-400 shrink-0" />
            <span className="leading-tight text-neutral-100">{geoNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setGeoNotice(null)}
            className="rounded p-1 text-amber-400/80 hover:text-amber-200 hover:bg-amber-500/20 transition-colors shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
