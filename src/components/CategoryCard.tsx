import { cn } from '@/lib/utils';
import { LucideIcon, Zap, Car, Utensils, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface CategoryCardProps {
  category: 'energy' | 'transport' | 'food';
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  onClick?: () => void;
}

const categoryConfig = {
  energy: {
    icon: Zap,
    label: 'Energy',
    gradientClass: 'gradient-energy',
    bgClass: 'bg-eco-energy/10',
    textClass: 'text-eco-energy',
    borderClass: 'border-eco-energy/20',
  },
  transport: {
    icon: Car,
    label: 'Transport',
    gradientClass: 'gradient-transport',
    bgClass: 'bg-eco-transport/10',
    textClass: 'text-eco-transport',
    borderClass: 'border-eco-transport/20',
  },
  food: {
    icon: Utensils,
    label: 'Food',
    gradientClass: 'gradient-food',
    bgClass: 'bg-eco-food/10',
    textClass: 'text-eco-food',
    borderClass: 'border-eco-food/20',
  },
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
  if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
  return <Minus className="w-3 h-3" />;
};

export function CategoryCard({
  category,
  value,
  unit = 'kg',
  trend = 'stable',
  trendValue,
  onClick,
}: CategoryCardProps) {
  const config = categoryConfig[category];
  const Icon = config.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative w-full p-4 rounded-2xl border transition-all duration-300',
        'bg-card hover:shadow-card active:scale-[0.98]',
        config.borderClass,
        'text-left group'
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          config.bgClass
        )}>
          <Icon className={cn('w-5 h-5', config.textClass)} />
        </div>
        
        {trend && trendValue !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
            trend === 'down' && 'bg-eco-success/10 text-eco-success',
            trend === 'up' && 'bg-destructive/10 text-destructive',
            trend === 'stable' && 'bg-muted text-muted-foreground'
          )}>
            <TrendIcon trend={trend} />
            <span>{Math.abs(trendValue)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground font-medium mb-1">
          {config.label}
        </p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">{value.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">{unit} CO₂</span>
        </div>
      </div>
      
      {/* Subtle gradient accent */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-60',
        config.gradientClass
      )} />
    </button>
  );
}
