import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SustainabilityPreference {
  id: string;
  name: string;
  weight: number; // 0-1, how important this factor is
}

export interface UserPreferences {
  sustainabilityFactors: SustainabilityPreference[];
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  certifications: string[];
  materials: string[];
  impactPriority: 'water' | 'co2' | 'recycled' | 'all';
}

interface PreferencesStore {
  preferences: UserPreferences;
  isOnboarded: boolean;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  sustainabilityFactors: [
    { id: 'organic', name: 'Organic Materials', weight: 0.8 },
    { id: 'recycled', name: 'Recycled Content', weight: 0.7 },
    { id: 'water-conservation', name: 'Water Conservation', weight: 0.6 },
    { id: 'carbon-neutral', name: 'Carbon Footprint', weight: 0.5 },
    { id: 'fair-trade', name: 'Fair Trade', weight: 0.7 },
    { id: 'durability', name: 'Product Durability', weight: 0.9 },
  ],
  priceRange: { min: 0, max: 500 },
  categories: [],
  certifications: [],
  materials: [],
  impactPriority: 'all'
};

export const useSustainabilityPreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      isOnboarded: false,
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        })),
      completeOnboarding: () => set({ isOnboarded: true }),
      resetPreferences: () => set({ 
        preferences: defaultPreferences, 
        isOnboarded: false 
      }),
    }),
    {
      name: 'sustainability-preferences',
    }
  )
);