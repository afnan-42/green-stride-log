import { motion } from 'framer-motion';
import { ProgressRing } from '@/components/ProgressRing';
import { RecommendationCard } from '@/components/RecommendationCard';
import { useUserData } from '@/hooks/useUserData';
import { LEVEL_INFO, CATEGORY_INFO } from '@/lib/emissions';
import { Leaf, TrendingDown, ChevronRight, Flame, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { emissions, recommendations, progress, user } = useUserData();

  if (!emissions || !progress) {
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
  const topRecommendations = recommendations.slice(0, 3);

  const categories = [
    { key: 'energy', value: emissions.monthly.energy },
    { key: 'transport', value: emissions.monthly.transport },
    { key: 'food', value: emissions.monthly.food },
    { key: 'appliances', value: emissions.monthly.appliances },
    { key: 'shopping', value: emissions.monthly.shopping },
    { key: 'waste', value: emissions.monthly.waste },
  ] as const;

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
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your sustainability overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-orange-500/10 text-orange-600 rounded-full px-4 py-2"
            >
              <Flame className="w-5 h-5" />
              <span className="font-semibold">{progress.streak} day streak</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Score & Categories */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <motion.div 
              variants={item}
              className="gradient-hero rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden"
            >
              {/* Floating orbs */}
              <motion.div 
                animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"
              />
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, delay: 1 }}
                className="absolute bottom-10 left-20 w-24 h-24 rounded-full bg-white/10 blur-xl"
              />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                <ProgressRing
                  value={emissions.score}
                  size="xl"
                  color="accent"
                  label="EcoScore"
                  sublabel="out of 100"
                  className="text-white"
                />
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <Leaf className="w-5 h-5" />
                    <span className="font-medium">{levelInfo.name}</span>
                  </div>
                  <p className="text-white/80 text-sm mb-4">{levelInfo.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-green-300" />
                        <span className="text-sm text-white/70">Monthly</span>
                      </div>
                      <p className="text-2xl font-bold">{emissions.monthly.total.toFixed(0)} <span className="text-sm font-normal">kg CO₂</span></p>
                    </div>
                    
                    <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm text-white/70">Potential Savings</span>
                      </div>
                      <p className="text-2xl font-bold">₹{emissions.costEstimate.potential_savings.toFixed(0)}<span className="text-sm font-normal">/mo</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Category Cards */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Emissions Breakdown</h2>
                <Link 
                  to="/input"
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  Update data
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat, index) => {
                  const info = CATEGORY_INFO[cat.key];
                  const percentage = (cat.value / emissions.monthly.total) * 100;
                  
                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="bg-card rounded-2xl border border-border p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
                          info.gradient
                        )}>
                          <span className="text-lg">{info.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium">{info.label}</p>
                          <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% of total</p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold">{cat.value.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">kg</span></p>
                      <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage * 2, 100)}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          className={cn('h-full rounded-full bg-gradient-to-r', info.gradient)}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Stats & Tips */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <motion.div 
              variants={item}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-bold mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🌳</span>
                    <span className="text-sm">Trees equivalent</span>
                  </div>
                  <span className="font-bold text-lg text-primary">{(progress.totalSaved / 20).toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💨</span>
                    <span className="text-sm">CO₂ saved</span>
                  </div>
                  <span className="font-bold text-lg text-accent">{progress.totalSaved} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏆</span>
                    <span className="text-sm">Badges earned</span>
                  </div>
                  <span className="font-bold text-lg text-amber-600">{progress.badges.filter(b => b.earned).length}/{progress.badges.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Level Progress */}
            <motion.div 
              variants={item}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold">{levelInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
                </div>
                <span className="text-3xl">🌱</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.levelProgress}%` }}
                  transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {progress.levelProgress.toFixed(0)}% to next level
              </p>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Top Tips</h3>
                <Link 
                  to="/recommendations"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  See all →
                </Link>
              </div>
              <div className="space-y-3">
                {topRecommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <RecommendationCard recommendation={rec} compact />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
