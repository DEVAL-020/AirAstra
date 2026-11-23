'use client';

import React, { useState, useEffect } from 'react';
import { POPULAR_CITIES, CityPreset, fetchLiveAirQuality, getSyntheticCityData } from '@/lib/aqi-api';
import { AirQualityData } from '@/types';
import { Navbar } from '@/components/Navbar';
import { WeatherHero } from '@/components/WeatherHero';
import { WeatherWidgetsGrid } from '@/components/WeatherWidgetsGrid';
import { TodaysSuggestions } from '@/components/TodaysSuggestions';
import { PersonaAdvisor } from '@/components/PersonaAdvisor';
import { TripCombiner } from '@/components/TripCombiner';
import { RoutineArchitect } from '@/components/RoutineArchitect';
import { IndoorHacksLab } from '@/components/IndoorHacksLab';
import { AirSnapVision } from '@/components/AirSnapVision';
import { AstraVoiceChat } from '@/components/AstraVoiceChat';
import { CommunityHub } from '@/components/CommunityHub';
import { FamilyPlanExport } from '@/components/FamilyPlanExport';
import { Purifier3DModal } from '@/components/Purifier3DModal';
import { EmergencySmogModal } from '@/components/EmergencySmogModal';
import { Footer } from '@/components/Footer';
import { Backdrop } from '@/components/ui/backdrop';
import { Segmented } from '@/components/ui/segmented';
import { 
  Activity, 
  Users, 
  Navigation, 
  Clock, 
  Sparkles, 
  Scan, 
  Stethoscope, 
  ShieldCheck, 
  Printer 
} from 'lucide-react';

export default function AirAstraHome() {
  const [currentCity, setCurrentCity] = useState<CityPreset>(POPULAR_CITIES[0]);
  const [airData, setAirData] = useState<AirQualityData>(() => getSyntheticCityData(POPULAR_CITIES[0], 8));
  const [activeTab, setActiveTab] = useState<'overview' | 'personas' | 'trips' | 'routine' | 'hacks' | 'vision' | 'chat' | 'community' | 'export'>('overview');
  
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
    { value: 'overview' as const, label: 'Air weather', icon: Activity },
    { value: 'personas' as const, label: 'Persona safety', icon: Users, badge: 'Targeted' },
    { value: 'trips' as const, label: 'Trip combiner', icon: Navigation, badge: 'Save CO₂' },
    { value: 'routine' as const, label: 'Daily routine', icon: Clock },
    { value: 'hacks' as const, label: 'DIY filter lab', icon: Sparkles },
    { value: 'vision' as const, label: 'Room scanner', icon: Scan },
    { value: 'chat' as const, label: 'Air doctor', icon: Stethoscope },
    { value: 'community' as const, label: 'Neighborhood', icon: ShieldCheck },
    { value: 'export' as const, label: 'Family plan', icon: Printer }
  ];

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden w-full max-w-full bg-background font-sans text-foreground antialiased selection:bg-brand selection:text-white">
      {/* Atmospheric Page Background SVG with hexagon glow */}
      <Backdrop />

      {/* Sticky Navbar */}
      <Navbar
        currentCity={currentCity}
        onSelectCity={(city) => setCurrentCity(city)}
        airData={airData}
      />

      {/* Main Container: responsive max-w-6xl */}
      <main className="mx-auto w-full max-w-6xl px-3 sm:px-6 md:px-12 py-5 sm:py-8 space-y-6 sm:space-y-8">
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

            <PersonaAdvisor airData={airData} />

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

        {activeTab === 'personas' && <PersonaAdvisor airData={airData} />}
        {activeTab === 'trips' && <TripCombiner airData={airData} />}
        {activeTab === 'routine' && <RoutineArchitect airData={airData} />}
        {activeTab === 'hacks' && <IndoorHacksLab onOpenPurifier3D={() => setIsPurifier3DOpen(true)} currentAQI={airData.aqi} />}
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

      {/* Rich Interactive Footer */}
      <Footer
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenPurifier3D={() => setIsPurifier3DOpen(true)}
        currentCity={airData.city}
        currentAQI={airData.aqi}
      />
    </div>
  );
}
