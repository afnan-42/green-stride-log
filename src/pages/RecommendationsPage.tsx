import { motion } from 'framer-motion';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useUserData } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';
import { Lightbulb, Zap, Car, Utensils, Sparkles, Home, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'all' | 'energy' | 'transport' | 'food' | 'appliances' | 'shopping' | 'waste';

export function RecommendationsPage() {
  const { recommendations, emissions } = useUserData();
  const [filter, setFilter] = useState<FilterType>('all');

  const filters = [
    { id: 'all' as const, label: 'All', icon: Sparkles },
    { id: 'energy' as const, label: 'Energy', icon: Zap },
    { id: 'appliances' as const, label: 'Appliances', icon: Home },
    { id: 'transport' as const, label: 'Transport', icon: Car },
    { id: 'food' as const, label: 'Food', icon: Utensils },
    { id: 'shopping' as const, label: 'Shopping', icon: ShoppingBag },
    { id: 'waste' as const, label: 'Waste', icon: Trash2 },
  ];

  const filteredRecommendations = filter === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === filter);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-14 h-14 rounded-2xl gradient-nature flex items-center justify-center"
            >
              <Lightbulb className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">Smart Tips</h1>
              <p className="text-muted-foreground">Personalized recommendations for you</p>
            </div>
          </div>
          
          {emissions && (
            <div className="flex items-center gap-4 bg-card rounded-2xl border border-border px-6 py-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{recommendations.reduce((acc, r) => acc + r.savingsKg, 0).toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">kg CO₂ potential savings</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  ₹{recommendations.reduce((acc, r) => acc + (r.savingsMoney || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">monthly savings</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((f) => {
              const Icon = f.icon;
              return (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200',
                    filter === f.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{f.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Recommendations Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-4"
        >
          {filteredRecommendations.map((rec, index) => (
            <motion.div key={rec.id} variants={item}>
              <RecommendationCard recommendation={rec} />
            </motion.div>
          ))}
          
          {filteredRecommendations.length === 0 && (
            <motion.div 
              variants={item}
              className="col-span-2 text-center py-16"
            >
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4"
              >
                <Sparkles className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <p className="text-lg text-muted-foreground">No recommendations in this category</p>
              <p className="text-sm text-muted-foreground mt-1">Try selecting a different filter</p>
            </motion.div>
          )}
        </motion.div>

        {/* Why this matters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
        >
          <div className="flex items-start gap-4">
            <span className="text-4xl">🌍</span>
            <div>
              <h3 className="font-bold text-xl mb-2">Why small changes matter</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every small action adds up. If everyone reduced their carbon footprint by just 10%, 
                we could prevent millions of tons of CO₂ from entering the atmosphere each year. 
                Your choices today shape the world of tomorrow. Start with one tip and build from there!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
