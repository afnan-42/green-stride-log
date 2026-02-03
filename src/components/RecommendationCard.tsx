import { cn } from '@/lib/utils';
import { Zap, Car, Utensils, Leaf, ChevronRight } from 'lucide-react';
import type { Recommendation } from '@/lib/emissions';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onClick?: () => void;
}

const categoryIcons = {
  energy: Zap,
  transport: Car,
  food: Utensils,
};

const categoryColors = {
  energy: 'bg-eco-energy/10 text-eco-energy',
  transport: 'bg-eco-transport/10 text-eco-transport',
  food: 'bg-eco-food/10 text-eco-food',
};

const impactColors = {
  high: 'bg-eco-success/10 text-eco-success border-eco-success/20',
  medium: 'bg-accent/10 text-accent border-accent/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export function RecommendationCard({ recommendation, onClick }: RecommendationCardProps) {
  const Icon = categoryIcons[recommendation.category];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-2xl bg-card border border-border',
        'transition-all duration-300 hover:shadow-card active:scale-[0.98]',
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
    </button>
  );
}
