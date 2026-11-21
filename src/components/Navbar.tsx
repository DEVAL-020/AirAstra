'use client';

import React, { useState, useEffect } from 'react';
import { CityPreset, POPULAR_CITIES } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { soundFX } from '@/lib/sound';
import { 
  Volume2, 
  VolumeX, 
  Compass, 
  Search
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
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200',
        scrolled
          ? 'border-b border-border/40 bg-background/80 backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-6 lg:px-12 gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border bg-neutral-100 dark:bg-black/20 text-brand shadow-xs">
            <span className="font-brand text-base sm:text-lg font-bold text-brand">A</span>
          </div>
          <div>
            <span className="font-brand text-lg sm:text-xl font-bold tracking-tight text-foreground">
              AirAstra
            </span>
            <span className="ml-1.5 hidden md:inline text-xs text-neutral-600 dark:text-neutral-400 font-bold">
              smog defense
            </span>
          </div>
        </div>

        {/* City selector in toolbar style */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg border-2 border-neutral-300 dark:border-border bg-white dark:bg-black/20 px-2 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm shadow-xs max-w-[170px] sm:max-w-none">
          <Search className="size-3.5 sm:size-4 text-neutral-600 dark:text-neutral-400 shrink-0" />
          <select
            value={currentCity.name}
            onChange={(e) => {
              const found = POPULAR_CITIES.find((c) => c.name === e.target.value);
              if (found) onSelectCity(found);
            }}
            className="bg-transparent text-xs sm:text-base font-bold text-foreground focus:outline-none cursor-pointer truncate max-w-[95px] sm:max-w-none"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
                {c.name}, {c.country}
              </option>
            ))}
            {currentCity.name === 'My Location' && (
              <option value="My Location" className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
                My Location (GPS)
              </option>
            )}
          </select>

          <button
            type="button"
            onClick={handleGeoLocation}
            title="Detect my location"
            aria-label="Detect my location"
            className="rounded p-0.5 sm:p-1 text-neutral-600 dark:text-neutral-400 hover:text-brand transition-colors cursor-pointer shrink-0"
          >
            <Compass className="size-3.5 sm:size-4" />
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            title={isAmbientOn ? 'Mute air purifier sound' : 'Play ambient purifier sound'}
            aria-label="Toggle sound"
            className={cn(
              'inline-flex size-8 sm:size-9 items-center justify-center rounded-md border text-sm transition-colors cursor-pointer shadow-xs',
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
    </header>
  );
}
