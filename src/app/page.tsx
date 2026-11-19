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
  Calendar, 
  Wrench, 
  Camera, 
  MessageSquare, 
  Users, 
  Printer, 
  Wind,
  ShieldCheck,
  Heart
} from 'lucide-react';

export default function AirAstraHome() {
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_CITIES[0]); // Default: New Delhi
  const [airData, setAirData] = useState<AirQualityData>(() => getSyntheticCityData(POPULAR_CITIES[0], 8));
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
    { id: 'routine', label: 'Daily Routine', icon: Calendar },
    { id: 'hacks', label: 'DIY Filter Lab', icon: Wrench },
    { id: 'vision', label: 'AirSnap Leak Scanner', icon: Camera },
    { id: 'chat', label: 'Astra Health Advisor', icon: MessageSquare },
    { id: 'community', label: 'Community Pods', icon: Users },
    { id: 'export', label: 'Printable Family Plan', icon: Printer }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#09140f] text-slate-100">
      {/* Top Header */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        airData={airData}
        onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 space-y-6">
        {/* Exact Visual Counterpart from Contest Image 2: Urban Air Quality Assistant & Today's Suggestions */}
        <TodaysSuggestions
          airData={airData}
          onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* Hero Section: Live AQI Dial + 3D GLSL Inversion Simulation */}
        <AQIHero
          airData={airData}
          onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1.5 bg-[#0d1e17] rounded-2xl border border-white/5 scrollbar-none">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body View */}
        <section className="transition-all duration-200">
          {activeTab === 'routine' && <RoutineArchitect airData={airData} />}
          {activeTab === 'hacks' && <IndoorHacksLab onOpenPurifier3D={() => setIsPurifier3DOpen(true)} />}
          {activeTab === 'vision' && <AirSnapVision currentAQI={airData.aqi} />}
          {activeTab === 'chat' && <AstraVoiceChat currentAQI={airData.aqi} city={airData.city} />}
          {activeTab === 'community' && <CommunityHub />}
          {activeTab === 'export' && <FamilyPlanExport airData={airData} />}
        </section>
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

      {/* Human Footer */}
      <footer className="mt-12 border-t border-white/5 py-8 px-4 md:px-8 bg-[#070f0b] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-bold text-white">AirAstra</span>
            <span>• Built for severe winter urban smog mitigation</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>Open-Meteo Air Quality Telemetry</span>
            <span>•</span>
            <span>WHO 2021 Guidelines</span>
            <span>•</span>
            <span>Harvard Healthy Buildings ACH Standard</span>
            <span>•</span>
            <span>EPA Breakpoints</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
