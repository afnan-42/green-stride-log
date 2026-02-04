// CO2e Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  // Energy
  electricity: 0.82, // kg CO2e per kWh (India average)
  lpg: 2.98, // kg CO2e per kg of LPG
  lpgCylinderKg: 14.2, // kg of LPG per cylinder
  lpgCylinderCost: 900, // Average cost per cylinder (INR)
  
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
  
  // Appliances (kg CO2e per hour of use)
  appliances: {
    ac: 1.5, // 1.5 ton AC
    refrigerator: 0.15, // 24/7 running
    washingMachine: 0.5, // per wash cycle
    waterHeater: 1.2, // geyser
    tv: 0.08,
    microwave: 0.9,
    dishwasher: 0.6,
  },
  
  // Shopping (kg CO2e per item)
  shopping: {
    clothing: 10, // per garment
    electronics: 50, // per device
    onlineOrders: 2.5, // per package (includes shipping)
  },
  
  // Waste (kg CO2e per kg)
  waste: {
    landfill: 0.5,
    recycled: 0.1,
    composted: 0.05,
  },
};

// Average benchmarks for comparison
export const BENCHMARKS = {
  excellent: 150, // kg CO2e per month
  good: 300,
  average: 500,
  high: 800,
};

export interface ApplianceUsage {
  ac: number; // hours per day
  refrigerator: boolean; // has refrigerator
  washingMachine: number; // cycles per week
  waterHeater: number; // minutes per day
  tv: number; // hours per day
  microwave: number; // uses per week
  dishwasher: number; // cycles per week
}

export interface ShoppingHabits {
  clothingPerMonth: number; // items
  electronicsPerYear: number; // devices
  onlineOrdersPerMonth: number; // packages
}

export interface WasteHabits {
  wastePerWeek: number; // kg
  recyclingPercent: number; // 0-100
  composting: boolean;
}

export interface UserInputs {
  // Energy
  electricity: number; // kWh per month
  electricityCost: number; // cost per month
  lpgCylinders: number; // cylinders per month
  
  // Transport
  transportMode: keyof typeof EMISSION_FACTORS.transport;
  weeklyDistance: number; // km per week
  
  // Food
  dietType: 'veg' | 'mixed' | 'nonVeg';
  nonVegMealsPerWeek: number;
  
  // Appliances
  appliances: ApplianceUsage;
  
  // Shopping
  shopping: ShoppingHabits;
  
  // Waste
  waste: WasteHabits;
}

export interface EmissionsBreakdown {
  energy: number;
  transport: number;
  food: number;
  appliances: number;
  shopping: number;
  waste: number;
  total: number;
}

export interface CalculatedEmissions {
  daily: EmissionsBreakdown;
  weekly: EmissionsBreakdown;
  monthly: EmissionsBreakdown;
  score: number; // 0-100, higher is better
  trend: 'up' | 'down' | 'stable';
  level: 'excellent' | 'good' | 'average' | 'high';
  costEstimate: {
    monthly: number;
    potential_savings: number;
  };
}

export function calculateEmissions(inputs: UserInputs): CalculatedEmissions {
  // Monthly Energy calculations
  const monthlyEnergy = 
    (inputs.electricity * EMISSION_FACTORS.electricity) +
    (inputs.lpgCylinders * EMISSION_FACTORS.lpgCylinderKg * EMISSION_FACTORS.lpg);
  
  // Monthly Transport
  const monthlyTransport = 
    inputs.weeklyDistance * 4 * EMISSION_FACTORS.transport[inputs.transportMode];
  
  // Food calculation
  const mealsPerWeek = 21;
  const nonVegMeals = inputs.dietType === 'veg' ? 0 : inputs.nonVegMealsPerWeek;
  const vegMeals = mealsPerWeek - nonVegMeals;
  
  const weeklyFood = 
    (vegMeals * EMISSION_FACTORS.food.veg) +
    (nonVegMeals * EMISSION_FACTORS.food.nonVeg);
  const monthlyFood = weeklyFood * 4;
  
  // Appliances calculation
  const dailyAppliances = 
    (inputs.appliances.ac * EMISSION_FACTORS.appliances.ac) +
    (inputs.appliances.refrigerator ? EMISSION_FACTORS.appliances.refrigerator * 24 : 0) +
    (inputs.appliances.tv * EMISSION_FACTORS.appliances.tv) +
    ((inputs.appliances.waterHeater / 60) * EMISSION_FACTORS.appliances.waterHeater);
  
  const weeklyAppliances = 
    dailyAppliances * 7 +
    (inputs.appliances.washingMachine * EMISSION_FACTORS.appliances.washingMachine) +
    (inputs.appliances.microwave * EMISSION_FACTORS.appliances.microwave) +
    (inputs.appliances.dishwasher * EMISSION_FACTORS.appliances.dishwasher);
  
  const monthlyAppliances = weeklyAppliances * 4;
  
  // Shopping calculation
  const monthlyShopping = 
    (inputs.shopping.clothingPerMonth * EMISSION_FACTORS.shopping.clothing) +
    ((inputs.shopping.electronicsPerYear / 12) * EMISSION_FACTORS.shopping.electronics) +
    (inputs.shopping.onlineOrdersPerMonth * EMISSION_FACTORS.shopping.onlineOrders);
  
  // Waste calculation
  const weeklyWaste = inputs.waste.wastePerWeek;
  const recycledWaste = weeklyWaste * (inputs.waste.recyclingPercent / 100);
  const compostedWaste = inputs.waste.composting ? weeklyWaste * 0.2 : 0;
  const landfillWaste = weeklyWaste - recycledWaste - compostedWaste;
  
  const weeklyWasteEmissions = 
    (landfillWaste * EMISSION_FACTORS.waste.landfill) +
    (recycledWaste * EMISSION_FACTORS.waste.recycled) +
    (compostedWaste * EMISSION_FACTORS.waste.composted);
  
  const monthlyWaste = weeklyWasteEmissions * 4;
  
  // Totals
  const monthlyTotal = monthlyEnergy + monthlyTransport + monthlyFood + monthlyAppliances + monthlyShopping + monthlyWaste;
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
  
  // Cost estimation
  const electricityCostPerKwh = inputs.electricityCost > 0 ? inputs.electricityCost / inputs.electricity : 8;
  const monthlyCost = inputs.electricityCost + (inputs.lpgCylinders * EMISSION_FACTORS.lpgCylinderCost);
  const potentialSavings = monthlyCost * 0.2; // 20% potential savings
  
  return {
    daily: {
      energy: monthlyEnergy / 30,
      transport: monthlyTransport / 30,
      food: monthlyFood / 30,
      appliances: monthlyAppliances / 30,
      shopping: monthlyShopping / 30,
      waste: monthlyWaste / 30,
      total: dailyTotal,
    },
    weekly: {
      energy: monthlyEnergy / 4,
      transport: monthlyTransport / 4,
      food: weeklyFood,
      appliances: weeklyAppliances,
      shopping: monthlyShopping / 4,
      waste: weeklyWasteEmissions,
      total: weeklyTotal,
    },
    monthly: {
      energy: monthlyEnergy,
      transport: monthlyTransport,
      food: monthlyFood,
      appliances: monthlyAppliances,
      shopping: monthlyShopping,
      waste: monthlyWaste,
      total: monthlyTotal,
    },
    score,
    trend: 'stable',
    level,
    costEstimate: {
      monthly: monthlyCost,
      potential_savings: potentialSavings,
    },
  };
}

export interface Recommendation {
  id: string;
  category: 'energy' | 'transport' | 'food' | 'appliances' | 'shopping' | 'waste';
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
  
  // Appliance recommendations
  if (inputs.appliances.ac > 4) {
    recommendations.push({
      id: 'appliance-1',
      category: 'appliances',
      title: 'Reduce AC runtime',
      description: 'Using AC for 6 hours instead of 8+ can save significant energy. Use fans to circulate cool air.',
      impact: 'high',
      savingsKg: emissions.monthly.appliances * 0.3,
      savingsMoney: 400,
    });
  }
  
  if (inputs.appliances.waterHeater > 15) {
    recommendations.push({
      id: 'appliance-2',
      category: 'appliances',
      title: 'Install a solar water heater',
      description: 'Solar geysers can reduce water heating costs by 70%. Great long-term investment.',
      impact: 'high',
      savingsKg: 25,
      savingsMoney: 300,
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
  
  // Shopping recommendations
  if (inputs.shopping.onlineOrdersPerMonth > 5) {
    recommendations.push({
      id: 'shopping-1',
      category: 'shopping',
      title: 'Consolidate online orders',
      description: 'Fewer deliveries mean less shipping emissions. Try to batch your orders together.',
      impact: 'medium',
      savingsKg: inputs.shopping.onlineOrdersPerMonth * 0.5,
      savingsMoney: 100,
    });
  }
  
  if (inputs.shopping.clothingPerMonth > 2) {
    recommendations.push({
      id: 'shopping-2',
      category: 'shopping',
      title: 'Choose quality over quantity',
      description: 'Buying fewer, better-made clothes reduces textile waste and emissions significantly.',
      impact: 'medium',
      savingsKg: 15,
      savingsMoney: 500,
    });
  }
  
  // Waste recommendations
  if (inputs.waste.recyclingPercent < 30) {
    recommendations.push({
      id: 'waste-1',
      category: 'waste',
      title: 'Start recycling',
      description: 'Recycling reduces landfill emissions by up to 80%. Separate paper, plastic, and metal.',
      impact: 'high',
      savingsKg: inputs.waste.wastePerWeek * 4 * 0.4,
    });
  }
  
  if (!inputs.waste.composting) {
    recommendations.push({
      id: 'waste-2',
      category: 'waste',
      title: 'Try composting',
      description: 'Kitchen waste composting can divert 30% of your garbage from landfills. Great for plants too!',
      impact: 'medium',
      savingsKg: 8,
    });
  }
  
  // General tip
  recommendations.push({
    id: 'general-1',
    category: 'energy',
    title: 'Unplug idle electronics',
    description: 'Electronics on standby can account for 10% of home energy use. Unplug when not in use.',
    impact: 'low',
    savingsKg: 8,
    savingsMoney: 100,
  });
  
  return recommendations.slice(0, 6);
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress: number;
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
      progress: Math.min(100, (50 / Math.max(emissions.monthly.energy, 1)) * 100),
    },
    {
      id: 'eco-commuter',
      name: 'Eco Commuter',
      description: 'Use sustainable transport for a week',
      icon: '🚲',
      earned: emissions.monthly.transport < 20,
      progress: Math.min(100, (20 / Math.max(emissions.monthly.transport, 1)) * 100),
    },
    {
      id: 'green-eater',
      name: 'Green Eater',
      description: 'Maintain low-carbon diet for 2 weeks',
      icon: '🥗',
      earned: emissions.monthly.food < 40,
      progress: Math.min(100, (40 / Math.max(emissions.monthly.food, 1)) * 100),
    },
    {
      id: 'smart-home',
      name: 'Smart Home',
      description: 'Optimize appliance usage',
      icon: '🏠',
      earned: emissions.monthly.appliances < 30,
      progress: Math.min(100, (30 / Math.max(emissions.monthly.appliances, 1)) * 100),
    },
    {
      id: 'conscious-consumer',
      name: 'Conscious Consumer',
      description: 'Reduce shopping emissions by 50%',
      icon: '🛍️',
      earned: emissions.monthly.shopping < 15,
      progress: Math.min(100, (15 / Math.max(emissions.monthly.shopping, 1)) * 100),
    },
    {
      id: 'zero-waste',
      name: 'Zero Waste Warrior',
      description: 'Recycle 80% of waste',
      icon: '♻️',
      earned: emissions.monthly.waste < 5,
      progress: Math.min(100, (5 / Math.max(emissions.monthly.waste, 1)) * 100),
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
    streak: 3,
    totalSaved: 45,
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

export const CATEGORY_INFO = {
  energy: {
    label: 'Energy',
    icon: '⚡',
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-orange-500',
  },
  transport: {
    label: 'Transport',
    icon: '🚗',
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-cyan-500',
  },
  food: {
    label: 'Food',
    icon: '🍽️',
    color: 'bg-green-500',
    gradient: 'from-green-400 to-emerald-500',
  },
  appliances: {
    label: 'Appliances',
    icon: '🏠',
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-violet-500',
  },
  shopping: {
    label: 'Shopping',
    icon: '🛍️',
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-rose-500',
  },
  waste: {
    label: 'Waste',
    icon: '♻️',
    color: 'bg-teal-500',
    gradient: 'from-teal-400 to-cyan-500',
  },
};
