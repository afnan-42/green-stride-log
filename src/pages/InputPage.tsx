import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserData } from '@/hooks/useUserData';
import { Zap, Car, Utensils, Home, ShoppingBag, Trash2, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const transportOptions = [
  { value: 'car', label: 'Car', icon: '🚗' },
  { value: 'bike', label: 'Motorbike', icon: '🏍️' },
  { value: 'publicTransport', label: 'Transit', icon: '🚇' },
  { value: 'ev', label: 'EV', icon: '🔋' },
  { value: 'cycling', label: 'Bicycle', icon: '🚲' },
  { value: 'walking', label: 'Walking', icon: '🚶' },
] as const;

const dietOptions = [
  { value: 'veg', label: 'Veg', icon: '🥗' },
  { value: 'mixed', label: 'Mixed', icon: '🍽️' },
  { value: 'nonVeg', label: 'Non-Veg', icon: '🍖' },
] as const;

export function InputPage() {
  const { inputs, updateInputs, resetData } = useUserData();
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: 'Saved!', description: 'Your lifestyle data updated.' });
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">My Lifestyle</h1>
            <p className="text-muted-foreground mt-1">Update your habits for accurate data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetData}><RotateCcw className="w-4 h-4 mr-2" />Reset</Button>
            <Button onClick={handleSave} className="gradient-nature text-white"><Save className="w-4 h-4 mr-2" />Save</Button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Energy */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Zap className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Energy</h2><p className="text-sm text-muted-foreground">Home energy</p></div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-sm">Electricity</span><span className="text-sm text-primary font-semibold">{inputs.electricity} kWh</span></div>
              <Slider value={[inputs.electricity]} onValueChange={([v]) => updateInputs({ electricity: v })} min={50} max={600} step={10} />
              <Input type="number" value={inputs.electricityCost} onChange={(e) => updateInputs({ electricityCost: Number(e.target.value) })} placeholder="Monthly cost ₹" />
              <div className="flex justify-between"><span className="text-sm">LPG Cylinders</span><span className="text-sm text-primary font-semibold">{inputs.lpgCylinders}</span></div>
              <Slider value={[inputs.lpgCylinders]} onValueChange={([v]) => updateInputs({ lpgCylinders: v })} min={0} max={4} step={0.5} />
            </div>
          </div>

          {/* Appliances */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center"><Home className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Appliances</h2><p className="text-sm text-muted-foreground">Heavy usage</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">❄️ AC</span><span className="text-sm text-primary">{inputs.appliances.ac}h</span></div><Slider value={[inputs.appliances.ac]} onValueChange={([v]) => updateInputs({ appliances: { ...inputs.appliances, ac: v } })} min={0} max={12} /></div>
              <div className="p-3 rounded-xl bg-muted/30 flex justify-between items-center"><span className="text-sm">🧊 Fridge</span><Switch checked={inputs.appliances.refrigerator} onCheckedChange={(v) => updateInputs({ appliances: { ...inputs.appliances, refrigerator: v } })} /></div>
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">🌡️ Heater</span><span className="text-sm text-primary">{inputs.appliances.waterHeater}m</span></div><Slider value={[inputs.appliances.waterHeater]} onValueChange={([v]) => updateInputs({ appliances: { ...inputs.appliances, waterHeater: v } })} min={0} max={60} step={5} /></div>
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">📺 TV</span><span className="text-sm text-primary">{inputs.appliances.tv}h</span></div><Slider value={[inputs.appliances.tv]} onValueChange={([v]) => updateInputs({ appliances: { ...inputs.appliances, tv: v } })} min={0} max={10} /></div>
            </div>
          </div>

          {/* Transport */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Transport</h2><p className="text-sm text-muted-foreground">Commute habits</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {transportOptions.map((o) => (<button key={o.value} onClick={() => updateInputs({ transportMode: o.value })} className={cn('p-3 rounded-xl border-2 text-center', inputs.transportMode === o.value ? 'border-primary bg-primary/5' : 'border-border')}><span className="text-xl block">{o.icon}</span><span className="text-xs">{o.label}</span></button>))}
            </div>
            <div className="flex justify-between"><span className="text-sm">Weekly km</span><span className="text-sm text-primary font-semibold">{inputs.weeklyDistance}</span></div>
            <Slider value={[inputs.weeklyDistance]} onValueChange={([v]) => updateInputs({ weeklyDistance: v })} min={0} max={500} step={10} className="mt-2" />
          </div>

          {/* Food */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"><Utensils className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Food</h2><p className="text-sm text-muted-foreground">Dietary habits</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {dietOptions.map((o) => (<button key={o.value} onClick={() => updateInputs({ dietType: o.value })} className={cn('p-4 rounded-xl border-2 text-center', inputs.dietType === o.value ? 'border-primary bg-primary/5' : 'border-border')}><span className="text-2xl block">{o.icon}</span><span className="text-sm">{o.label}</span></button>))}
            </div>
            {inputs.dietType !== 'veg' && (<><div className="flex justify-between"><span className="text-sm">Non-veg/week</span><span className="text-sm text-primary">{inputs.nonVegMealsPerWeek}</span></div><Slider value={[inputs.nonVegMealsPerWeek]} onValueChange={([v]) => updateInputs({ nonVegMealsPerWeek: v })} min={1} max={21} className="mt-2" /></>)}
          </div>

          {/* Shopping */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Shopping</h2><p className="text-sm text-muted-foreground">Consumption</p></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">👕 Clothing</span><span className="text-sm text-primary">{inputs.shopping.clothingPerMonth}/mo</span></div><Slider value={[inputs.shopping.clothingPerMonth]} onValueChange={([v]) => updateInputs({ shopping: { ...inputs.shopping, clothingPerMonth: v } })} min={0} max={10} /></div>
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">📦 Online Orders</span><span className="text-sm text-primary">{inputs.shopping.onlineOrdersPerMonth}/mo</span></div><Slider value={[inputs.shopping.onlineOrdersPerMonth]} onValueChange={([v]) => updateInputs({ shopping: { ...inputs.shopping, onlineOrdersPerMonth: v } })} min={0} max={20} /></div>
            </div>
          </div>

          {/* Waste */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center"><Trash2 className="w-6 h-6 text-white" /></div>
              <div><h2 className="text-xl font-bold">Waste</h2><p className="text-sm text-muted-foreground">Management</p></div>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">🗑️ Weekly</span><span className="text-sm text-primary">{inputs.waste.wastePerWeek} kg</span></div><Slider value={[inputs.waste.wastePerWeek]} onValueChange={([v]) => updateInputs({ waste: { ...inputs.waste, wastePerWeek: v } })} min={1} max={15} step={0.5} /></div>
              <div className="p-3 rounded-xl bg-muted/30 space-y-2"><div className="flex justify-between"><span className="text-sm">♻️ Recycling</span><span className="text-sm text-primary">{inputs.waste.recyclingPercent}%</span></div><Slider value={[inputs.waste.recyclingPercent]} onValueChange={([v]) => updateInputs({ waste: { ...inputs.waste, recyclingPercent: v } })} min={0} max={100} step={5} /></div>
              <div className="p-3 rounded-xl bg-muted/30 flex justify-between items-center"><span className="text-sm">🌱 Composting</span><Switch checked={inputs.waste.composting} onCheckedChange={(v) => updateInputs({ waste: { ...inputs.waste, composting: v } })} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
