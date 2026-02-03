import { BadgeCard } from '@/components/BadgeCard';
import { BottomNav } from '@/components/BottomNav';
import { useUserData } from '@/hooks/useUserData';
import { LEVEL_INFO } from '@/lib/emissions';
import { Trophy, Target, Flame, TreePine } from 'lucide-react';

export function AchievementsPage() {
  const { progress, emissions } = useUserData();

  if (!progress || !emissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const levelInfo = LEVEL_INFO[progress.level];
  const earnedBadges = progress.badges.filter(b => b.earned);
  const inProgressBadges = progress.badges.filter(b => !b.earned);

  const levelIcons = {
    beginner: '🌱',
    aware: '🌿',
    conscious: '🌳',
    hero: '🌍',
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl gradient-nature flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">Your progress & rewards</p>
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{levelIcons[progress.level]}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{levelInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress to next level</span>
              <span className="font-medium">{progress.levelProgress.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full gradient-nature rounded-full transition-all duration-700"
                style={{ width: `${progress.levelProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold">{progress.streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-eco-success/10 flex items-center justify-center mx-auto mb-2">
              <Target className="w-5 h-5 text-eco-success" />
            </div>
            <p className="text-2xl font-bold">{progress.totalSaved}</p>
            <p className="text-xs text-muted-foreground">kg CO₂ Saved</p>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <div className="w-10 h-10 rounded-full bg-eco-transport/10 flex items-center justify-center mx-auto mb-2">
              <TreePine className="w-5 h-5 text-eco-transport" />
            </div>
            <p className="text-2xl font-bold">{(progress.totalSaved / 20).toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Trees Equivalent</p>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="px-6 mb-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🏆</span> Earned Badges ({earnedBadges.length})
        </h3>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/50 rounded-2xl">
            <p className="text-muted-foreground">Keep going to earn your first badge!</p>
          </div>
        )}
      </div>

      {/* In Progress */}
      <div className="px-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <span>🎯</span> In Progress ({inProgressBadges.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {inProgressBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </div>

      {/* Monthly Challenge */}
      <div className="px-6 mt-8">
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border border-accent/30 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <h3 className="font-bold">Monthly Challenge</h3>
          </div>
          <p className="text-foreground font-medium mb-2">Reduce electricity by 5%</p>
          <p className="text-sm text-muted-foreground mb-4">
            Save 12.5 kWh this month compared to last month. You're already 40% there!
          </p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-[40%]" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">12 days remaining</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
