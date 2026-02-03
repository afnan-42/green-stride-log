import { useState } from 'react';
import { useUserData } from '@/hooks/useUserData';
import { BottomNav } from '@/components/BottomNav';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Zap, Car, Utensils, Check, RefreshCw } from 'lucide-react';

const transportOptions = [
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bike', label: 'Motorbike', icon: '🏍️' },
  { value: 'publicTransport', label: 'Public Transit', icon: '🚇' },
  { value: 'ev', label: 'Electric Vehicle', icon: '🔋' },
  { value: 'cycling', label: 'Bicycle', icon: '🚲' },
  { value: 'walking', label: 'Walking', icon: '🚶' },
] as const;

const dietOptions = [
  { value: 'veg', label: 'Vegetarian', icon: '🥗' },
  { value: 'mixed', label: 'Mixed', icon: '🍽️' },
  { value: 'nonVeg', label: 'Non-Vegetarian', icon: '🍖' },
] as const;

type TabType = 'energy' | 'transport' | 'food';

export function InputPage() {
  const { inputs, updateInputs, emissions } = useUserData();
  const [activeTab, setActiveTab] = useState<TabType>('energy');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'energy' as const, label: 'Energy', icon: Zap, gradient: 'gradient-energy' },
    { id: 'transport' as const, label: 'Transport', icon: Car, gradient: 'gradient-transport' },
    { id: 'food' as const, label: 'Food', icon: Utensils, gradient: 'gradient-food' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-bold mb-2">Track Your Impact</h1>
        <p className="text-muted-foreground">Update your lifestyle data</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 p-1 bg-secondary rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-card shadow-soft text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {/* Energy Tab */}
        {activeTab === 'energy' && (
          <div className="space-y-8 animate-fade-up">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-energy flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Energy Consumption</h3>
                  <p className="text-sm text-muted-foreground">Monthly usage</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="font-medium">Electricity (kWh/month)</label>
                    <span className="text-primary font-semibold">{inputs.electricity} kWh</span>
                  </div>
                  <Slider
                    value={[inputs.electricity]}
                    onValueChange={([v]) => updateInputs({ electricity: v })}
                    min={50}
                    max={600}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>50</span>
                    <span>325</span>
                    <span>600</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="font-medium">LPG Cylinders</label>
                    <span className="text-primary font-semibold">{inputs.lpgCylinders}</span>
                  </div>
                  <Slider
                    value={[inputs.lpgCylinders]}
                    onValueChange={([v]) => updateInputs({ lpgCylinders: v })}
                    min={0}
                    max={4}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0</span>
                    <span>2</span>
                    <span>4</span>
                  </div>
                </div>
              </div>

              {emissions && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Energy Emissions</span>
                    <span className="font-bold text-eco-energy">{emissions.monthly.energy.toFixed(1)} kg CO₂</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transport Tab */}
        {activeTab === 'transport' && (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-transport flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Transportation</h3>
                  <p className="text-sm text-muted-foreground">How you travel</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-medium block mb-3">Primary Transport Mode</label>
                  <div className="grid grid-cols-3 gap-2">
                    {transportOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateInputs({ transportMode: option.value })}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all duration-200 text-center',
                          inputs.transportMode === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className="text-xl block mb-1">{option.icon}</span>
                        <span className="text-xs font-medium">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <label className="font-medium">Weekly Distance</label>
                    <span className="text-primary font-semibold">{inputs.weeklyDistance} km</span>
                  </div>
                  <Slider
                    value={[inputs.weeklyDistance]}
                    onValueChange={([v]) => updateInputs({ weeklyDistance: v })}
                    min={0}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                </div>
              </div>

              {emissions && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Transport Emissions</span>
                    <span className="font-bold text-eco-transport">{emissions.monthly.transport.toFixed(1)} kg CO₂</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Food Tab */}
        {activeTab === 'food' && (
          <div className="space-y-6 animate-fade-up">
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-food flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Food Habits</h3>
                  <p className="text-sm text-muted-foreground">Your diet</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-medium block mb-3">Diet Type</label>
                  <div className="space-y-2">
                    {dietOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateInputs({ dietType: option.value })}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4',
                          inputs.dietType === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                        {inputs.dietType === option.value && (
                          <Check className="w-5 h-5 text-primary ml-auto" />
                        )}
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
                      onValueChange={([v]) => updateInputs({ nonVegMealsPerWeek: v })}
                      min={1}
                      max={21}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {emissions && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Monthly Food Emissions</span>
                    <span className="font-bold text-eco-food">{emissions.monthly.food.toFixed(1)} kg CO₂</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button 
          size="lg" 
          className="w-full mt-6 gradient-nature text-primary-foreground font-semibold"
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check className="w-5 h-5 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5 mr-2" />
              Update Data
            </>
          )}
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
