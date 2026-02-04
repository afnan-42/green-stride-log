import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Leaf, Zap, Car, Utensils, ChevronRight, ChevronLeft, Sparkles,
  Home, ShoppingBag, Trash2
} from 'lucide-react';
import type { UserInputs } from '@/lib/emissions';

const transportOptions = [
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bike', label: 'Motorbike', icon: '🏍️' },
  { value: 'publicTransport', label: 'Public Transit', icon: '🚇' },
  { value: 'ev', label: 'Electric Vehicle', icon: '🔋' },
  { value: 'cycling', label: 'Bicycle', icon: '🚲' },
  { value: 'walking', label: 'Walking', icon: '🚶' },
] as const;

const dietOptions = [
  { value: 'veg', label: 'Vegetarian', icon: '🥗', description: 'Plant-based meals' },
  { value: 'mixed', label: 'Mixed', icon: '🍽️', description: 'Balanced diet' },
  { value: 'nonVeg', label: 'Non-Vegetarian', icon: '🍖', description: 'Includes meat regularly' },
] as const;

interface OnboardingProps {
  onComplete: (inputs: UserInputs) => void;
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

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs);

  const steps = [
    { icon: Leaf, title: 'Welcome', subtitle: "Let's understand your lifestyle" },
    { icon: Zap, title: 'Energy', subtitle: 'Your home energy usage' },
    { icon: Home, title: 'Appliances', subtitle: 'Heavy appliances at home' },
    { icon: Car, title: 'Transport', subtitle: 'How you get around' },
    { icon: Utensils, title: 'Food', subtitle: 'Your dietary habits' },
    { icon: ShoppingBag, title: 'Shopping', subtitle: 'Consumption patterns' },
    { icon: Trash2, title: 'Waste', subtitle: 'Waste management' },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(inputs);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Desktop Only */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 gradient-hero relative overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-xl"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-32 right-10 w-48 h-48 rounded-full bg-white/10 blur-xl"
        />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6"
          >
            <Leaf className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-white mb-3 text-center">EcoBalance</h1>
          <p className="text-lg text-white/80 text-center max-w-xs">
            Your personal sustainability companion
          </p>

          {/* Step indicators */}
          <div className="mt-12 space-y-3 w-full max-w-xs">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300',
                    i === step ? 'bg-white/20' : 'bg-transparent',
                    i < step && 'opacity-60'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    i <= step ? 'bg-white/30' : 'bg-white/10'
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-white/90">{s.title}</span>
                  {i < step && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-white"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Form Content */}
      <div className="flex-1 flex flex-col">
        {/* Progress bar - Mobile */}
        <div className="lg:hidden px-6 pt-6">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'h-1 flex-1 rounded-full transition-all duration-300',
                  i <= step ? 'bg-primary' : 'bg-secondary'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 lg:px-12 xl:px-20 py-8 flex flex-col overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-3xl gradient-nature flex items-center justify-center mb-6 shadow-glow-primary"
                  >
                    <Leaf className="w-12 h-12 text-primary-foreground" />
                  </motion.div>
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold mb-3"
                  >
                    Welcome to EcoBalance
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground text-lg mb-2"
                  >
                    Your personal sustainability companion
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground max-w-sm"
                  >
                    In the next few steps, we'll understand your lifestyle to help you make 
                    small, meaningful changes for the planet.
                  </motion.p>
                </div>
              )}

              {/* Step 1: Energy */}
              {step === 1 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl gradient-energy flex items-center justify-center mb-4"
                    >
                      <Zap className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Energy Usage</h2>
                    <p className="text-muted-foreground">
                      Tell us about your monthly energy consumption
                    </p>
                  </div>

                  <div className="space-y-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <label className="font-medium">Monthly Electricity</label>
                          <span className="text-primary font-semibold">{inputs.electricity} kWh</span>
                        </div>
                        <Slider
                          value={[inputs.electricity]}
                          onValueChange={([v]) => setInputs({ ...inputs, electricity: v })}
                          min={50}
                          max={600}
                          step={10}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low (50)</span>
                          <span>Average (250)</span>
                          <span>High (600)</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="font-medium">Monthly Electricity Cost (₹)</label>
                        <Input
                          type="number"
                          value={inputs.electricityCost}
                          onChange={(e) => setInputs({ ...inputs, electricityCost: Number(e.target.value) })}
                          className="h-12"
                          placeholder="Enter monthly cost"
                        />
                        <p className="text-xs text-muted-foreground">
                          This helps us calculate your savings potential
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="font-medium">LPG Cylinders per Month</label>
                        <span className="text-primary font-semibold">{inputs.lpgCylinders} (~₹{(inputs.lpgCylinders * 900).toFixed(0)})</span>
                      </div>
                      <Slider
                        value={[inputs.lpgCylinders]}
                        onValueChange={([v]) => setInputs({ ...inputs, lpgCylinders: v })}
                        min={0}
                        max={4}
                        step={0.5}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>None</span>
                        <span>1 cylinder</span>
                        <span>4 cylinders</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Appliances */}
              {step === 2 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-4"
                    >
                      <Home className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Home Appliances</h2>
                    <p className="text-muted-foreground">
                      Heavy appliances contribute significantly to energy use
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❄️</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">AC Usage</label>
                            <span className="text-primary font-semibold">{inputs.appliances.ac} hrs/day</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.appliances.ac]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          appliances: { ...inputs.appliances, ac: v } 
                        })}
                        min={0}
                        max={12}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🧊</span>
                          <label className="font-medium">Refrigerator</label>
                        </div>
                        <Switch
                          checked={inputs.appliances.refrigerator}
                          onCheckedChange={(v) => setInputs({
                            ...inputs,
                            appliances: { ...inputs.appliances, refrigerator: v }
                          })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Running 24/7</p>
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌡️</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Water Heater</label>
                            <span className="text-primary font-semibold">{inputs.appliances.waterHeater} min/day</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.appliances.waterHeater]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          appliances: { ...inputs.appliances, waterHeater: v } 
                        })}
                        min={0}
                        max={60}
                        step={5}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📺</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">TV Usage</label>
                            <span className="text-primary font-semibold">{inputs.appliances.tv} hrs/day</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.appliances.tv]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          appliances: { ...inputs.appliances, tv: v } 
                        })}
                        min={0}
                        max={10}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👕</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Washing Machine</label>
                            <span className="text-primary font-semibold">{inputs.appliances.washingMachine} cycles/week</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.appliances.washingMachine]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          appliances: { ...inputs.appliances, washingMachine: v } 
                        })}
                        min={0}
                        max={14}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍳</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Microwave</label>
                            <span className="text-primary font-semibold">{inputs.appliances.microwave} uses/week</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.appliances.microwave]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          appliances: { ...inputs.appliances, microwave: v } 
                        })}
                        min={0}
                        max={21}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Transport */}
              {step === 3 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl gradient-transport flex items-center justify-center mb-4"
                    >
                      <Car className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Transportation</h2>
                    <p className="text-muted-foreground">
                      How do you usually get around?
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="font-medium block mb-3">Primary mode of transport</label>
                      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                        {transportOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setInputs({ ...inputs, transportMode: option.value })}
                            className={cn(
                              'p-4 rounded-xl border-2 transition-all duration-200 text-center',
                              inputs.transportMode === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <span className="text-2xl block mb-1">{option.icon}</span>
                            <span className="text-xs font-medium">{option.label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="font-medium">Weekly travel distance</label>
                        <span className="text-primary font-semibold">{inputs.weeklyDistance} km</span>
                      </div>
                      <Slider
                        value={[inputs.weeklyDistance]}
                        onValueChange={([v]) => setInputs({ ...inputs, weeklyDistance: v })}
                        min={0}
                        max={500}
                        step={10}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Minimal</span>
                        <span>Moderate (100km)</span>
                        <span>Extensive (500km)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Food */}
              {step === 4 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl gradient-food flex items-center justify-center mb-4"
                    >
                      <Utensils className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Food Habits</h2>
                    <p className="text-muted-foreground">
                      Your dietary choices matter too
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="font-medium block mb-3">Your diet type</label>
                      <div className="grid md:grid-cols-3 gap-4">
                        {dietOptions.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setInputs({ ...inputs, dietType: option.value })}
                            className={cn(
                              'p-6 rounded-xl border-2 transition-all duration-200 text-center',
                              inputs.dietType === option.value
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            <span className="text-4xl block mb-2">{option.icon}</span>
                            <span className="font-medium block">{option.label}</span>
                            <span className="text-sm text-muted-foreground">{option.description}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {inputs.dietType !== 'veg' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="flex justify-between">
                          <label className="font-medium">Non-veg meals per week</label>
                          <span className="text-primary font-semibold">{inputs.nonVegMealsPerWeek}</span>
                        </div>
                        <Slider
                          value={[inputs.nonVegMealsPerWeek]}
                          onValueChange={([v]) => setInputs({ ...inputs, nonVegMealsPerWeek: v })}
                          min={1}
                          max={21}
                          step={1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Few (1-3)</span>
                          <span>Moderate (7-10)</span>
                          <span>Daily (21)</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Shopping */}
              {step === 5 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center mb-4"
                    >
                      <ShoppingBag className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Shopping Habits</h2>
                    <p className="text-muted-foreground">
                      Your consumption patterns affect your footprint
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👕</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Clothing Purchases</label>
                            <span className="text-primary font-semibold">{inputs.shopping.clothingPerMonth} items/month</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.shopping.clothingPerMonth]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          shopping: { ...inputs.shopping, clothingPerMonth: v } 
                        })}
                        min={0}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📱</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Electronics Purchases</label>
                            <span className="text-primary font-semibold">{inputs.shopping.electronicsPerYear} devices/year</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.shopping.electronicsPerYear]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          shopping: { ...inputs.shopping, electronicsPerYear: v } 
                        })}
                        min={0}
                        max={12}
                        step={1}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Online Orders</label>
                            <span className="text-primary font-semibold">{inputs.shopping.onlineOrdersPerMonth} packages/month</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.shopping.onlineOrdersPerMonth]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          shopping: { ...inputs.shopping, onlineOrdersPerMonth: v } 
                        })}
                        min={0}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Waste */}
              {step === 6 && (
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                  <div className="mb-8">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center mb-4"
                    >
                      <Trash2 className="w-7 h-7 text-white" />
                    </motion.div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-2">Waste Management</h2>
                    <p className="text-muted-foreground">
                      How you handle waste makes a difference
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🗑️</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Weekly Waste Generation</label>
                            <span className="text-primary font-semibold">{inputs.waste.wastePerWeek} kg/week</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.waste.wastePerWeek]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          waste: { ...inputs.waste, wastePerWeek: v } 
                        })}
                        min={1}
                        max={15}
                        step={0.5}
                      />
                    </div>

                    <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">♻️</span>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <label className="font-medium">Recycling Rate</label>
                            <span className="text-primary font-semibold">{inputs.waste.recyclingPercent}%</span>
                          </div>
                        </div>
                      </div>
                      <Slider
                        value={[inputs.waste.recyclingPercent]}
                        onValueChange={([v]) => setInputs({ 
                          ...inputs, 
                          waste: { ...inputs.waste, recyclingPercent: v } 
                        })}
                        min={0}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-card/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">🌱</span>
                          <div>
                            <label className="font-medium">Composting</label>
                            <p className="text-xs text-muted-foreground">Kitchen waste composting</p>
                          </div>
                        </div>
                        <Switch
                          checked={inputs.waste.composting}
                          onCheckedChange={(v) => setInputs({
                            ...inputs,
                            waste: { ...inputs.waste, composting: v }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="p-6 lg:px-12 xl:px-20 pb-8 flex gap-3 border-t border-border bg-background">
          {step > 0 && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="w-14"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button
              size="lg"
              onClick={handleNext}
              className="w-full gradient-nature text-primary-foreground font-semibold"
            >
              {step === steps.length - 1 ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Calculate My Impact
                </>
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
