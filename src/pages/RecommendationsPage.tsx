import { RecommendationCard } from '@/components/RecommendationCard';
import { BottomNav } from '@/components/BottomNav';
import { useUserData } from '@/hooks/useUserData';
import { cn } from '@/lib/utils';
import { Lightbulb, Zap, Car, Utensils, Sparkles } from 'lucide-react';
import { useState } from 'react';

type FilterType = 'all' | 'energy' | 'transport' | 'food';

export function RecommendationsPage() {
  const { recommendations } = useUserData();
  const [filter, setFilter] = useState<FilterType>('all');

  const filters = [
    { id: 'all' as const, label: 'All', icon: Sparkles },
    { id: 'energy' as const, label: 'Energy', icon: Zap },
    { id: 'transport' as const, label: 'Transport', icon: Car },
    { id: 'food' as const, label: 'Food', icon: Utensils },
  ];

  const filteredRecommendations = filter === 'all'
    ? recommendations
    : recommendations.filter(r => r.category === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl gradient-nature flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Smart Tips</h1>
            <p className="text-muted-foreground">Personalized for you</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200',
                  filter === f.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{f.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="px-6">
        <div className="space-y-4 stagger-children">
          {filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
          
          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No recommendations in this category</p>
            </div>
          )}
        </div>

        {/* Why this matters */}
        <div className="mt-8 p-6 rounded-2xl bg-secondary/50 border border-border">
          <h3 className="font-semibold mb-2">Why small changes matter</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every small action adds up. If everyone reduced their carbon footprint by just 10%, 
            we could prevent millions of tons of CO₂ from entering the atmosphere each year. 
            Your choices today shape the world of tomorrow.
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
