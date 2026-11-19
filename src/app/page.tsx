'use client';

import React, { useState, useEffect } from 'react';
import { POPULAR_CITIES, CityPreset, fetchLiveAirQuality, getSyntheticCityData } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { Navbar } from '@/components/Navbar';
import { AQIHero } from '@/components/AQIHero';
import { TodaysSuggestions } from '@/components/TodaysSuggestions';
import { RoutineArchitect } from '@/components/RoutineArchitect';
import { IndoorHacksLab } from '@/components/IndoorHacksLab';
import { AirSnapVision } from '@/components/AirSnapVision';
import { AstraVoiceChat } from '@/components/AstraVoiceChat';
import { CommunityHub } from '@/components/CommunityHub';
import { FamilyPlanExport } from '@/components/FamilyPlanExport';
import { Purifier3DModal } from '@/components/Purifier3DModal';
import { EmergencySmogModal } from '@/components/EmergencySmogModal';
import { 
  CalendarClock, 
  Wrench, 
  Camera, 
  MessageSquare, 
  Users, 
  Printer, 
  Wind,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function AirAstraHome() {
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_CITIES[0]); // Default: New Delhi
  const [airData, setAirData] = useState<AirQualityData>(getSyntheticCityData(POPULAR_CITIES[0]));
  const [activeTab, setActiveTab] = useState<'routine' | 'hacks' | 'vision' | 'chat' | 'community' | 'export'>('routine');
  
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
    { id: 'routine', label: 'Daily Routine Architect', icon: CalendarClock },
    { id: 'hacks', label: 'Indoor Hacks & DIY Lab', icon: Wrench },
    { id: 'vision', label: 'AirSnap Vision AI', icon: Camera },
    { id: 'chat', label: 'Astra Voice Advisor', icon: MessageSquare },
    { id: 'community', label: 'BreatheTogether Pods', icon: Users },
    { id: 'export', label: 'Family Smog Protocol', icon: Printer }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#060b09] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        airData={airData}
        onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-8">
        {/* Hero Section: Live AQI Dial + 3D GLSL Inversion Simulation */}
        <AQIHero
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

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/25 scale-102 font-bold'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body View */}
        <section className="transition-all duration-300">
          {activeTab === 'routine' && <RoutineArchitect airData={airData} />}
          {activeTab === 'hacks' && <IndoorHacksLab onOpenPurifier3D={() => setIsPurifier3DOpen(true)} />}
          {activeTab === 'vision' && <AirSnapVision currentAQI={airData.aqi} />}
          {activeTab === 'chat' && <AstraVoiceChat currentAQI={airData.aqi} city={airData.city} />}
          {activeTab === 'community' && <CommunityHub />}
          {activeTab === 'export' && <FamilyPlanExport airData={airData} />}
        </section>
      </main>

      {/* Modals */}
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

      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 py-8 px-4 md:px-8 bg-black/40 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">AirAstra</span>
            <span>• Built for severe winter urban smog mitigation</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Open-Meteo Air Quality API</span>
            <span>•</span>
            <span>WHO 2021 Particulate Guidelines</span>
            <span>•</span>
            <span>Harvard T.H. Chan ACH Standards</span>
            <span>•</span>
            <span>EPA Breakpoints</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
