import { useState, useEffect, useCallback } from 'react';
import {
  UserInputs,
  CalculatedEmissions,
  Recommendation,
  UserProgress,
  calculateEmissions,
  generateRecommendations,
  calculateProgress,
} from '@/lib/emissions';

const STORAGE_KEY = 'ecobalance_user_data';

interface StoredData {
  inputs: UserInputs;
  lastUpdated: string;
  history: { date: string; emissions: CalculatedEmissions }[];
}

const defaultInputs: UserInputs = {
  electricity: 250,
  lpgCylinders: 1,
  transportMode: 'car',
  weeklyDistance: 100,
  dietType: 'mixed',
  nonVegMealsPerWeek: 7,
};

export function useUserData() {
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs);
  const [emissions, setEmissions] = useState<CalculatedEmissions | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StoredData = JSON.parse(stored);
        setInputs(data.inputs);
        setIsOnboarded(true);
      } catch (e) {
        console.error('Failed to parse stored data');
      }
    }
    setIsLoading(false);
  }, []);

  // Recalculate when inputs change
  useEffect(() => {
    if (!isLoading) {
      const newEmissions = calculateEmissions(inputs);
      setEmissions(newEmissions);
      setRecommendations(generateRecommendations(inputs, newEmissions));
      setProgress(calculateProgress(newEmissions));
    }
  }, [inputs, isLoading]);

  const updateInputs = useCallback((newInputs: Partial<UserInputs>) => {
    setInputs((prev) => {
      const updated = { ...prev, ...newInputs };
      
      // Save to localStorage
      const dataToStore: StoredData = {
        inputs: updated,
        lastUpdated: new Date().toISOString(),
        history: [],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback((initialInputs: UserInputs) => {
    setInputs(initialInputs);
    setIsOnboarded(true);
    
    const dataToStore: StoredData = {
      inputs: initialInputs,
      lastUpdated: new Date().toISOString(),
      history: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setInputs(defaultInputs);
    setIsOnboarded(false);
  }, []);

  return {
    inputs,
    emissions,
    recommendations,
    progress,
    isOnboarded,
    isLoading,
    updateInputs,
    completeOnboarding,
    resetData,
  };
}
