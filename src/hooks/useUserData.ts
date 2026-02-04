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
const AUTH_KEY = 'ecobalance_auth';

interface StoredData {
  inputs: UserInputs;
  lastUpdated: string;
  history: { date: string; emissions: CalculatedEmissions }[];
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

const defaultInputs: UserInputs = {
  electricity: 250,
  electricityCost: 2000,
  lpgCylinders: 1,
  transportMode: 'car',
  weeklyDistance: 100,
  dietType: 'mixed',
  nonVegMealsPerWeek: 7,
  appliances: {
    ac: 4,
    refrigerator: true,
    washingMachine: 3,
    waterHeater: 15,
    tv: 3,
    microwave: 5,
    dishwasher: 0,
  },
  shopping: {
    clothingPerMonth: 2,
    electronicsPerYear: 3,
    onlineOrdersPerMonth: 6,
  },
  waste: {
    wastePerWeek: 5,
    recyclingPercent: 20,
    composting: false,
  },
};

export function useUserData() {
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs);
  const [emissions, setEmissions] = useState<CalculatedEmissions | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load data from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_KEY);
    if (storedAuth) {
      try {
        const authData: AuthUser = JSON.parse(storedAuth);
        setUser(authData);
      } catch (e) {
        console.error('Failed to parse auth data');
      }
    }

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

  const login = useCallback((email: string, password: string, name?: string): { success: boolean; error?: string } => {
    // Simple local auth - check if user exists
    const usersKey = 'ecobalance_users';
    const usersData = localStorage.getItem(usersKey);
    const users: Record<string, { password: string; name: string }> = usersData ? JSON.parse(usersData) : {};

    if (users[email]) {
      if (users[email].password === password) {
        const authUser: AuthUser = {
          id: email,
          email,
          name: users[email].name,
          createdAt: new Date().toISOString(),
        };
        setUser(authUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
        return { success: true };
      }
      return { success: false, error: 'Incorrect password' };
    }
    return { success: false, error: 'User not found. Please sign up first.' };
  }, []);

  const signup = useCallback((email: string, password: string, name: string): { success: boolean; error?: string } => {
    const usersKey = 'ecobalance_users';
    const usersData = localStorage.getItem(usersKey);
    const users: Record<string, { password: string; name: string }> = usersData ? JSON.parse(usersData) : {};

    if (users[email]) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    users[email] = { password, name };
    localStorage.setItem(usersKey, JSON.stringify(users));

    const authUser: AuthUser = {
      id: email,
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    setUser(authUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return {
    inputs,
    emissions,
    recommendations,
    progress,
    isOnboarded,
    isLoading,
    user,
    updateInputs,
    completeOnboarding,
    resetData,
    login,
    signup,
    logout,
  };
}
