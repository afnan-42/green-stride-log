import { motion } from 'framer-motion';
import { BadgeCard } from '@/components/BadgeCard';
import { useUserData } from '@/hooks/useUserData';
import { LEVEL_INFO } from '@/lib/emissions';
import { Trophy, Target, Flame, TreePine } from 'lucide-react';

export function AchievementsPage() {
  const { progress, emissions } = useUserData();

  if (!progress || !emissions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
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
          className="flex items-center gap-4 mb-8"
        >
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-14 h-14 rounded-2xl gradient-nature flex items-center justify-center"
          >
            <Trophy className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">Achievements</h1>
            <p className="text-muted-foreground">Your progress & rewards</p>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Level Card */}
          <motion.div 
            variants={item}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-7xl"
              >
                {levelIcons[progress.level]}
              </motion.span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{levelInfo.name}</h2>
                <p className="text-muted-foreground mb-4">{levelInfo.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to next level</span>
                    <span className="font-medium">{progress.levelProgress.toFixed(0)}%</span>
                  </div>
                  <div className="h-4 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress.levelProgress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full gradient-nature rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={item} className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.streak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{progress.totalSaved}</p>
                <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
              </div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <TreePine className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(progress.totalSaved / 20).toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Trees Equivalent</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Badges */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 grid lg:grid-cols-2 gap-8"
        >
          {/* Earned Badges */}
          <motion.div variants={item}>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span>🏆</span> Earned Badges ({earnedBadges.length})
            </h3>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {earnedBadges.map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <BadgeCard badge={badge} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">Keep going to earn your first badge!</p>
              </div>
            )}
          </motion.div>

          {/* In Progress */}
          <motion.div variants={item}>
            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
              <span>🎯</span> In Progress ({inProgressBadges.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {inProgressBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <BadgeCard badge={badge} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Monthly Challenge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl border border-accent/30 p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl"
              >
                🎯
              </motion.span>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2">Monthly Challenge</h3>
                <p className="text-foreground font-medium mb-1">Reduce electricity by 5%</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Save 12.5 kWh this month compared to last month. You're making great progress!
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '40%' }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="font-semibold text-accent">40%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">12 days remaining</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
