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
import { Backdrop } from '@/components/ui/backdrop';
import { Segmented } from '@/components/ui/segmented';

export default function AirAstraHome() {
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_CITIES[0]);
  const [airData, setAirData] = useState<AirQualityData>(() => getSyntheticCityData(POPULAR_CITIES[0], 8));
  const [activeTab, setActiveTab] = useState<'overview' | 'routine' | 'hacks' | 'vision' | 'chat' | 'community' | 'export'>('overview');
  
  const [isPurifier3DOpen, setIsPurifier3DOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

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

  const segmentedOptions = [
    { value: 'overview' as const, label: 'Air weather' },
    { value: 'routine' as const, label: 'Daily routine' },
    { value: 'hacks' as const, label: 'DIY filter lab' },
    { value: 'vision' as const, label: 'Room scanner' },
    { value: 'chat' as const, label: 'Air doctor' },
    { value: 'community' as const, label: 'Neighborhood' },
    { value: 'export' as const, label: 'Family plan' }
  ];

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased selection:bg-brand selection:text-white">
      {/* Atmospheric Page Background SVG with hexagon glow */}
      <Backdrop />

      {/* Sticky Navbar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        airData={airData}
      />

      {/* Main Container: max-w-6xl with p-6 sm:p-12 */}
      <main className="mx-auto w-full max-w-6xl p-6 sm:p-12 space-y-8">
        {/* Segmented Toolbar Control */}
        <div className="flex justify-center">
          <Segmented
            label="AirAstra views"
            options={segmentedOptions}
            value={activeTab}
            onChange={(val) => setActiveTab(val)}
          />
        </div>

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <WeatherHero
              airData={airData}
              onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
            />

            <TodaysSuggestions
              airData={airData}
              onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
              onOpenEmergency={() => setIsEmergencyOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
            />

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

      {/* Atmospheric Footer with orange hairline */}
      <footer className="relative mt-20 border-t border-border/40 py-10 text-center text-xs text-neutral-400 before:absolute before:top-0 before:left-1/2 before:h-px before:w-1/2 before:-translate-x-1/2 before:bg-linear-to-r before:from-transparent before:via-orange-500/30 before:to-transparent">
        <div className="mx-auto max-w-6xl px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-brand font-bold text-foreground">AirAstra</span>
            <span className="text-neutral-500">•</span>
            <span>Urban Smog Defense & Community Clean Air OS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
            <span>Open-Meteo telemetry</span>
            <span>EPA breakpoints</span>
            <span>Harvard ACH standards</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
