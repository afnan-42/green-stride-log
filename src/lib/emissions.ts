// CO2e Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  // Energy
  electricity: 0.82, // kg CO2e per kWh (India average)
  lpg: 2.98, // kg CO2e per kg of LPG
  lpgCylinderKg: 14.2, // kg of LPG per cylinder
  
  // Transport (kg CO2e per km)
  transport: {
    car: 0.21,
    bike: 0.05,
    publicTransport: 0.089,
    ev: 0.053,
    walking: 0,
    cycling: 0,
  },
  
  // Food (kg CO2e per meal)
  food: {
    veg: 0.5,
    mixed: 1.2,
    nonVeg: 2.5,
  },
};

// Average benchmarks for comparison
export const BENCHMARKS = {
  excellent: 100, // kg CO2e per month
  good: 200,
  average: 350,
  high: 500,
};

export interface UserInputs {
  electricity: number; // kWh per month
  lpgCylinders: number; // cylinders per month
  transportMode: keyof typeof EMISSION_FACTORS.transport;
  weeklyDistance: number; // km per week
  dietType: 'veg' | 'mixed' | 'nonVeg';
  nonVegMealsPerWeek: number;
}

export interface EmissionsBreakdown {
  energy: number;
  transport: number;
  food: number;
  total: number;
}

export interface CalculatedEmissions {
  daily: EmissionsBreakdown;
  weekly: EmissionsBreakdown;
  monthly: EmissionsBreakdown;
  score: number; // 0-100, higher is better
  trend: 'up' | 'down' | 'stable';
  level: 'excellent' | 'good' | 'average' | 'high';
}

export function calculateEmissions(inputs: UserInputs): CalculatedEmissions {
  // Monthly calculations
  const monthlyEnergy = 
    (inputs.electricity * EMISSION_FACTORS.electricity) +
    (inputs.lpgCylinders * EMISSION_FACTORS.lpgCylinderKg * EMISSION_FACTORS.lpg);
  
  const monthlyTransport = 
    inputs.weeklyDistance * 4 * EMISSION_FACTORS.transport[inputs.transportMode];
  
  // Food calculation
  const mealsPerWeek = 21; // 3 meals * 7 days
  const nonVegMeals = inputs.dietType === 'veg' ? 0 : inputs.nonVegMealsPerWeek;
  const vegMeals = mealsPerWeek - nonVegMeals;
  
  const weeklyFood = 
    (vegMeals * EMISSION_FACTORS.food.veg) +
    (nonVegMeals * EMISSION_FACTORS.food.nonVeg);
  const monthlyFood = weeklyFood * 4;
  
  const monthlyTotal = monthlyEnergy + monthlyTransport + monthlyFood;
  const weeklyTotal = monthlyTotal / 4;
  const dailyTotal = monthlyTotal / 30;
  
  // Calculate score (inverse of emissions, 0-100)
  const maxExpected = BENCHMARKS.high;
  const score = Math.max(0, Math.min(100, Math.round((1 - monthlyTotal / maxExpected) * 100)));
  
  // Determine level
  let level: 'excellent' | 'good' | 'average' | 'high';
  if (monthlyTotal <= BENCHMARKS.excellent) level = 'excellent';
  else if (monthlyTotal <= BENCHMARKS.good) level = 'good';
  else if (monthlyTotal <= BENCHMARKS.average) level = 'average';
  else level = 'high';
  
  return {
    daily: {
      energy: monthlyEnergy / 30,
      transport: monthlyTransport / 30,
      food: monthlyFood / 30,
      total: dailyTotal,
    },
    weekly: {
      energy: monthlyEnergy / 4,
      transport: monthlyTransport / 4,
      food: weeklyFood,
      total: weeklyTotal,
    },
    monthly: {
      energy: monthlyEnergy,
      transport: monthlyTransport,
      food: monthlyFood,
      total: monthlyTotal,
    },
    score,
    trend: 'stable', // Will be calculated with historical data
    level,
  };
}

export interface Recommendation {
  id: string;
  category: 'energy' | 'transport' | 'food';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  savingsKg: number;
  savingsMoney?: number;
}

export function generateRecommendations(
  inputs: UserInputs,
  emissions: CalculatedEmissions
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Energy recommendations
  if (inputs.electricity > 200) {
    recommendations.push({
      id: 'energy-1',
      category: 'energy',
      title: 'Switch to LED lighting',
      description: 'LED bulbs use 75% less energy than incandescent bulbs. A small change that adds up over time.',
      impact: 'medium',
      savingsKg: 15,
      savingsMoney: 200,
    });
  }
  
  if (inputs.electricity > 300) {
    recommendations.push({
      id: 'energy-2',
      category: 'energy',
      title: 'Optimize AC usage',
      description: 'Setting your AC to 24°C instead of 20°C can reduce energy use by 24%. Your comfort, less carbon.',
      impact: 'high',
      savingsKg: 40,
      savingsMoney: 500,
    });
  }
  
  // Transport recommendations
  if (inputs.transportMode === 'car' && inputs.weeklyDistance > 50) {
    recommendations.push({
      id: 'transport-1',
      category: 'transport',
      title: 'Try carpooling twice a week',
      description: "Sharing rides just 2 days a week can cut your transport emissions by 40%. Plus, it's social!",
      impact: 'high',
      savingsKg: emissions.monthly.transport * 0.4,
      savingsMoney: 1000,
    });
  }
  
  if (inputs.transportMode !== 'publicTransport' && inputs.transportMode !== 'walking' && inputs.transportMode !== 'cycling') {
    recommendations.push({
      id: 'transport-2',
      category: 'transport',
      title: 'Public transport for short trips',
      description: 'Using metro or bus for trips under 10km can significantly reduce your carbon footprint.',
      impact: 'medium',
      savingsKg: 20,
      savingsMoney: 500,
    });
  }
  
  // Food recommendations
  if (inputs.nonVegMealsPerWeek > 7) {
    recommendations.push({
      id: 'food-1',
      category: 'food',
      title: 'Try Meatless Mondays',
      description: 'Going vegetarian just one day a week reduces your food carbon footprint by 14%. Delicious and sustainable!',
      impact: 'medium',
      savingsKg: emissions.monthly.food * 0.14,
    });
  }
  
  if (inputs.dietType === 'nonVeg') {
    recommendations.push({
      id: 'food-2',
      category: 'food',
      title: 'Swap beef for chicken',
      description: 'Chicken produces 5x less CO2 than beef. A simple swap for a big impact.',
      impact: 'high',
      savingsKg: 25,
    });
  }
  
  // Always add a general tip
  recommendations.push({
    id: 'general-1',
    category: 'energy',
    title: 'Unplug idle electronics',
    description: 'Electronics on standby can account for 10% of home energy use. Unplug when not in use.',
    impact: 'low',
    savingsKg: 8,
    savingsMoney: 100,
  });
  
  return recommendations.slice(0, 5); // Return top 5
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number; // 0-100
}

export interface UserProgress {
  level: 'beginner' | 'aware' | 'conscious' | 'hero';
  levelProgress: number;
  streak: number;
  totalSaved: number;
  badges: Badge[];
}

export function calculateProgress(
  emissions: CalculatedEmissions,
  historicalData?: any[]
): UserProgress {
  const badges: Badge[] = [
    {
      id: 'energy-saver',
      name: 'Energy Saver',
      description: 'Keep energy emissions below 50kg/month',
      icon: '⚡',
      earned: emissions.monthly.energy < 50,
      progress: Math.min(100, (50 / emissions.monthly.energy) * 100),
    },
    {
      id: 'eco-commuter',
      name: 'Eco Commuter',
      description: 'Use sustainable transport for a week',
      icon: '🚲',
      earned: emissions.monthly.transport < 20,
      progress: Math.min(100, (20 / emissions.monthly.transport) * 100),
    },
    {
      id: 'green-eater',
      name: 'Green Eater',
      description: 'Maintain low-carbon diet for 2 weeks',
      icon: '🥗',
      earned: emissions.monthly.food < 40,
      progress: Math.min(100, (40 / emissions.monthly.food) * 100),
    },
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first carbon assessment',
      icon: '👣',
      earned: true,
      progress: 100,
    },
    {
      id: 'week-streak',
      name: 'Week Warrior',
      description: 'Log data for 7 consecutive days',
      icon: '🔥',
      earned: false,
      progress: 30,
    },
  ];
  
  // Calculate level based on score
  let level: 'beginner' | 'aware' | 'conscious' | 'hero';
  let levelProgress: number;
  
  if (emissions.score < 30) {
    level = 'beginner';
    levelProgress = (emissions.score / 30) * 100;
  } else if (emissions.score < 55) {
    level = 'aware';
    levelProgress = ((emissions.score - 30) / 25) * 100;
  } else if (emissions.score < 80) {
    level = 'conscious';
    levelProgress = ((emissions.score - 55) / 25) * 100;
  } else {
    level = 'hero';
    levelProgress = ((emissions.score - 80) / 20) * 100;
  }
  
  return {
    level,
    levelProgress,
    streak: 3, // Mock data
    totalSaved: 45, // kg CO2 saved
    badges,
  };
}

export const LEVEL_INFO = {
  beginner: {
    name: 'Climate Beginner',
    description: 'Just starting your sustainability journey',
    color: 'text-muted-foreground',
  },
  aware: {
    name: 'Climate Aware',
    description: 'Understanding your impact',
    color: 'text-eco-transport',
  },
  conscious: {
    name: 'Climate Conscious',
    description: 'Making meaningful changes',
    color: 'text-primary',
  },
  hero: {
    name: 'Climate Hero',
    description: 'Leading by example',
    color: 'text-accent',
  },
};
