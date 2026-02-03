import { ProgressRing } from '@/components/ProgressRing';
import { CategoryCard } from '@/components/CategoryCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { BottomNav } from '@/components/BottomNav';
import { useUserData } from '@/hooks/useUserData';
import { LEVEL_INFO } from '@/lib/emissions';
import { Leaf, TrendingDown, ChevronRight, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { emissions, recommendations, progress } = useUserData();

  if (!emissions || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const levelInfo = LEVEL_INFO[progress.level];
  const topRecommendations = recommendations.slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Header */}
      <div className="gradient-hero px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">EcoBalance</h1>
              <p className="text-sm text-primary-foreground/70">{levelInfo.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5">
            <Flame className="w-4 h-4 text-orange-300" />
            <span className="text-sm font-semibold text-primary-foreground">{progress.streak} day streak</span>
          </div>
        </div>

        {/* Main Score */}
        <div className="flex flex-col items-center">
          <ProgressRing
            value={emissions.score}
            size="xl"
            color="accent"
            label="EcoScore"
            sublabel="out of 100"
            className="text-primary-foreground"
          />
          
          <div className="flex items-center gap-2 mt-4 bg-white/20 rounded-full px-4 py-2">
            <TrendingDown className="w-4 h-4 text-green-300" />
            <span className="text-sm font-medium text-primary-foreground">
              {emissions.monthly.total.toFixed(0)} kg CO₂/month
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 -mt-6">
        <div className="grid grid-cols-3 gap-3 stagger-children">
          <CategoryCard
            category="energy"
            value={emissions.monthly.energy}
            trend="down"
            trendValue={8}
          />
          <CategoryCard
            category="transport"
            value={emissions.monthly.transport}
            trend="stable"
            trendValue={0}
          />
          <CategoryCard
            category="food"
            value={emissions.monthly.food}
            trend="down"
            trendValue={12}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mt-6">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{progress.totalSaved}</p>
              <p className="text-xs text-muted-foreground">kg CO₂ saved</p>
            </div>
            <div className="border-x border-border">
              <p className="text-2xl font-bold text-eco-transport">{(progress.totalSaved / 20).toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">trees equivalent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{progress.badges.filter(b => b.earned).length}</p>
              <p className="text-xs text-muted-foreground">badges earned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Preview */}
      <div className="px-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Personalized Tips</h2>
          <Link 
            to="/recommendations"
            className="flex items-center gap-1 text-sm text-primary font-medium"
          >
            See all
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="space-y-3 stagger-children">
          {topRecommendations.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
        </div>
      </div>

      {/* Level Progress */}
      <div className="px-6 mt-8">
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">{levelInfo.name}</h3>
              <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
            </div>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress.levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {progress.levelProgress.toFixed(0)}% to next level
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
