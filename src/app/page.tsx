'use client';

import React, { useState, useEffect } from 'react';
import { POPULAR_CITIES, CityPreset, fetchLiveAirQuality, getSyntheticCityData } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { Navbar } from '@/components/Navbar';
import { WeatherHero } from '@/components/WeatherHero';
import { WeatherWidgetsGrid } from '@/components/WeatherWidgetsGrid';
import { TodaysSuggestions } from '@/components/TodaysSuggestions';
import { RoutineArchitect } from '@/components/RoutineArchitect';
import { IndoorHacksLab } from '@/components/IndoorHacksLab';
import { AirSnapVision } from '@/components/AirSnapVision';
import { AstraVoiceChat } from '@/components/AstraVoiceChat';
import { CommunityHub } from '@/components/CommunityHub';
import { FamilyPlanExport } from '@/components/FamilyPlanExport';
import { Purifier3DModal } from '@/components/Purifier3DModal';
import { EmergencySmogModal } from '@/components/EmergencySmogModal';

export default function AirAstraHome() {
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_CITIES[0]); // Default: New Delhi
  const [airData, setAirData] = useState<AirQualityData>(() => getSyntheticCityData(POPULAR_CITIES[0], 8));
  const [activeTab, setActiveTab] = useState<'overview' | 'routine' | 'hacks' | 'vision' | 'chat' | 'community' | 'export'>('overview');
  
  // Modals
  const [isPurifier3DOpen, setIsPurifier3DOpen] = useState<boolean>(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);

  // Fetch live AQI whenever selected city changes
  useEffect(() => {
    let isMounted = true;
    fetchLiveAirQuality(currentCity).then((data) => {
      if (isMounted) {
        setAirData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentCity]);

  const tabs = [
    { id: 'overview', label: 'Air Weather' },
    { id: 'routine', label: 'Daily Routine' },
    { id: 'hacks', label: 'DIY Filter Lab' },
    { id: 'vision', label: 'Room Scanner' },
    { id: 'chat', label: 'Air Doctor' },
    { id: 'community', label: 'Neighborhood' },
    { id: 'export', label: 'Family Plan' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1118] text-slate-100">
      {/* Weather App Top Bar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        airData={airData}
        onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Weather App Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-4 space-y-6">
        {/* iOS Style Segmented Control Tab Switcher */}
        <div className="flex justify-center">
          <div className="ios-segment inline-flex items-center overflow-x-auto max-w-full scrollbar-none">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`ios-segment-btn whitespace-nowrap cursor-pointer ${
                  activeTab === t.id ? 'active' : ''
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Apple Weather Style Centered Hero & Hourly Forecast Strip */}
            <WeatherHero
              airData={airData}
              onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            {/* PromptWars Reference Mockup Component: Urban Air Quality Assistant & Today's Suggestions */}
            <TodaysSuggestions
              airData={airData}
              onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

            {/* Apple Weather Style Environmental Metric Widgets Grid */}
            <WeatherWidgetsGrid
              airData={airData}
              onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
            />
          </div>
        )}

        {activeTab === 'routine' && <RoutineArchitect airData={airData} />}
        {activeTab === 'hacks' && <IndoorHacksLab onOpenPurifier3D={() => setIsPurifier3DOpen(true)} />}
        {activeTab === 'vision' && <AirSnapVision currentAQI={airData.aqi} />}
        {activeTab === 'chat' && <AstraVoiceChat currentAQI={airData.aqi} city={airData.city} />}
        {activeTab === 'community' && <CommunityHub />}
        {activeTab === 'export' && <FamilyPlanExport airData={airData} />}
      </main>

      {/* 3D Simulation & Emergency Modals */}
      <Purifier3DModal
        isOpen={isPurifier3DOpen}
        onClose={() => setIsPurifier3DOpen(false)}
      />

      <EmergencySmogModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        city={airData.city}
        aqi={airData.aqi}
      />

      {/* Minimalist Weather App Footer */}
      <footer className="mt-12 border-t border-white/5 py-6 px-4 text-center text-xs text-white/40">
        <p>AirAstra Weather • Real-time meteorological telemetry & atmospheric inversion science</p>
        <p className="mt-1 text-[11px] text-white/25">EPA Breakpoints • Harvard T.H. Chan Standards • WHO Guidelines</p>
      </footer>
    </div>
  );
}
