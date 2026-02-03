import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Leaf, Zap, Car, Utensils, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import type { UserInputs } from '@/lib/emissions';
import { EMISSION_FACTORS } from '@/lib/emissions';
import { useUserData } from '@/hooks/useUserData';

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

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<UserInputs>({
    electricity: 250,
    lpgCylinders: 1,
    transportMode: 'car',
    weeklyDistance: 100,
    dietType: 'mixed',
    nonVegMealsPerWeek: 7,
  });

  const steps = [
    { icon: Leaf, title: 'Welcome', subtitle: 'Let\'s understand your lifestyle' },
    { icon: Zap, title: 'Energy', subtitle: 'Your home energy usage' },
    { icon: Car, title: 'Transport', subtitle: 'How you get around' },
    { icon: Utensils, title: 'Food', subtitle: 'Your dietary habits' },
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full transition-all duration-300',
                i <= step ? 'bg-primary' : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
            <div className="w-24 h-24 rounded-3xl gradient-nature flex items-center justify-center mb-6 shadow-glow-primary">
              <Leaf className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">EcoBalance</h1>
            <p className="text-muted-foreground text-lg mb-2">
              Your personal sustainability companion
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              In the next few steps, we'll understand your lifestyle to help you make 
              small, meaningful changes for the planet.
            </p>
          </div>
        )}

        {/* Step 1: Energy */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-energy flex items-center justify-center mb-4">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Energy Usage</h2>
              <p className="text-muted-foreground">
                Tell us about your monthly energy consumption
              </p>
            </div>

            <div className="space-y-8 flex-1">
              <div>
                <div className="flex justify-between mb-3">
                  <label className="font-medium">Monthly Electricity</label>
                  <span className="text-primary font-semibold">{inputs.electricity} kWh</span>
                </div>
                <Slider
                  value={[inputs.electricity]}
                  onValueChange={([v]) => setInputs({ ...inputs, electricity: v })}
                  min={50}
                  max={600}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Low (50)</span>
                  <span>Average (250)</span>
                  <span>High (600)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="font-medium">LPG Cylinders per Month</label>
                  <span className="text-primary font-semibold">{inputs.lpgCylinders}</span>
                </div>
                <Slider
                  value={[inputs.lpgCylinders]}
                  onValueChange={([v]) => setInputs({ ...inputs, lpgCylinders: v })}
                  min={0}
                  max={4}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>None</span>
                  <span>1 cylinder</span>
                  <span>4 cylinders</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Transport */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-transport flex items-center justify-center mb-4">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Transportation</h2>
              <p className="text-muted-foreground">
                How do you usually get around?
              </p>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="font-medium block mb-3">Primary mode of transport</label>
                <div className="grid grid-cols-3 gap-3">
                  {transportOptions.map((option) => (
                    <button
                      key={option.value}
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
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <label className="font-medium">Weekly travel distance</label>
                  <span className="text-primary font-semibold">{inputs.weeklyDistance} km</span>
                </div>
                <Slider
                  value={[inputs.weeklyDistance]}
                  onValueChange={([v]) => setInputs({ ...inputs, weeklyDistance: v })}
                  min={0}
                  max={500}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Minimal</span>
                  <span>Moderate (100km)</span>
                  <span>Extensive (500km)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Food */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-food flex items-center justify-center mb-4">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Food Habits</h2>
              <p className="text-muted-foreground">
                Your dietary choices matter too
              </p>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="font-medium block mb-3">Your diet type</label>
                <div className="space-y-3">
                  {dietOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setInputs({ ...inputs, dietType: option.value })}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4',
                        inputs.dietType === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className="text-3xl">{option.icon}</span>
                      <div className="text-left">
                        <span className="font-medium block">{option.label}</span>
                        <span className="text-sm text-muted-foreground">{option.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {inputs.dietType !== 'veg' && (
                <div className="animate-fade-up">
                  <div className="flex justify-between mb-3">
                    <label className="font-medium">Non-veg meals per week</label>
                    <span className="text-primary font-semibold">{inputs.nonVegMealsPerWeek}</span>
                  </div>
                  <Slider
                    value={[inputs.nonVegMealsPerWeek]}
                    onValueChange={([v]) => setInputs({ ...inputs, nonVegMealsPerWeek: v })}
                    min={1}
                    max={21}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Few (1-3)</span>
                    <span>Moderate (7-10)</span>
                    <span>Daily (21)</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-6 pb-8 flex gap-3">
        {step > 0 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="w-14"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleNext}
          className="flex-1 gradient-nature text-primary-foreground font-semibold"
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
      </div>
    </div>
  );
}
