export interface AirQualityData {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  aqi: number; // US AQI scale (0 - 500+)
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Very Poor' | 'Hazardous';
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  no2: number; // ug/m3
  so2: number; // ug/m3
  o3: number; // ug/m3
  co: number; // ug/m3
  temperature: number; // °C
  humidity: number; // %
  windSpeed: number; // km/h
  inversionStrength: 'Low' | 'Moderate' | 'Severe' | 'Critical';
  ventilationSafeWindow: string; // e.g. "13:00 - 15:30"
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2';
  healthAdvisory: string;
  dataSource?: string;
  hourlyForecast: {
    hour: string;
    aqi: number;
    inversionTrapped: boolean;
    temperature: number;
  }[];
}

export interface RoutineItem {
  id: string;
  timeSlot: string; // "06:30 - 08:00"
  title: string;
  category: 'commute' | 'exercise' | 'school' | 'indoor' | 'errand' | 'sleep';
  riskLevel: 'safe' | 'caution' | 'danger';
  standardHabit: string;
  lowEmissionAlternative: string;
  scienceRationale: string;
  personalImpact: {
    co2SavedGrams: number;
    pmInhaledAvoidedUg: number;
  };
  purifierRecommendation: 'off' | 'low' | 'medium' | 'turbo_hepa';
  maskRequired: boolean;
}

export interface DIYAirHack {
  id: string;
  title: string;
  category: 'purifier' | 'sealing' | 'botanical' | 'cooking' | 'moisture';
  estimatedCost: string;
  diyDifficulty: 'Easy (10 min)' | 'Moderate (30 min)' | 'Advanced (1 hour)';
  cleanAirDeliveryRate: string; // CADR estimate
  effectivenessPercent: number;
  materialsNeeded: string[];
  steps: string[];
  mechanicsExplainer: string;
  humanProTip: string;
}

export interface VisionDiagnosticResult {
  roomType: string;
  smogDefenseScore: number; // 0 - 100
  leakageRisk: 'High' | 'Moderate' | 'Well Sealed';
  identifiedHazards: {
    item: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    fix: string;
  }[];
  purifierPlacementRating: 'Optimal' | 'Sub-optimal' | 'Obstructed' | 'Missing';
  actionChecklist: string[];
  botanicalPlacementTip: string;
}

export interface CommunityPod {
  id: string;
  name: string;
  neighborhood: string;
  membersCount: number;
  co2SavedKg: number;
  pm25AvoidedGrams: number;
  activeCarpools: number;
  recentReport: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'astra' | 'system';
  text: string;
  timestamp: string;
  isAudio?: boolean;
  suggestedActions?: string[];
}
