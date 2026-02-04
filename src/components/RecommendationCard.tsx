import { cn } from '@/lib/utils';
import { Zap, Car, Utensils, Leaf, ChevronRight, Home, ShoppingBag, Trash2 } from 'lucide-react';
import type { Recommendation } from '@/lib/emissions';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick?: () => void;
  compact?: boolean;
}

const categoryIcons = {
  energy: Zap,
  transport: Car,
  food: Utensils,
  appliances: Home,
  shopping: ShoppingBag,
  waste: Trash2,
};

const categoryColors = {
  energy: 'bg-amber-500/10 text-amber-600',
  transport: 'bg-blue-500/10 text-blue-600',
  food: 'bg-green-500/10 text-green-600',
  appliances: 'bg-purple-500/10 text-purple-600',
  shopping: 'bg-pink-500/10 text-pink-600',
  waste: 'bg-teal-500/10 text-teal-600',
};

const impactColors = {
  high: 'bg-green-500/10 text-green-600 border-green-500/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export function RecommendationCard({ recommendation, onClick, compact }: RecommendationCardProps) {
  const Icon = categoryIcons[recommendation.category];

  if (compact) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
          'w-full p-3 rounded-xl bg-card border border-border',
          'transition-all duration-200 hover:shadow-md',
          'text-left group'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            categoryColors[recommendation.category]
          )}>
            <Icon className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-1">
              {recommendation.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                Save {recommendation.savingsKg.toFixed(0)} kg
              </span>
              {recommendation.savingsMoney && (
                <span className="text-xs text-primary font-medium">
                  ₹{recommendation.savingsMoney}
                </span>
              )}
            </div>
          </div>
          
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-2xl bg-card border border-border',
        'transition-all duration-300 hover:shadow-lg',
        'text-left group'
      )}
    >
      <div className="flex gap-4">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
          categoryColors[recommendation.category]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-foreground leading-tight">
              {recommendation.title}
            </h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {recommendation.description}
          </p>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border',
              impactColors[recommendation.impact]
            )}>
              <Leaf className="w-3 h-3" />
              Save {recommendation.savingsKg.toFixed(0)} kg/mo
            </span>
            
            {recommendation.savingsMoney && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                ₹{recommendation.savingsMoney}/mo
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
