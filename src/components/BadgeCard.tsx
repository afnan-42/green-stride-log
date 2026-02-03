import { cn } from '@/lib/utils';
import type { Badge } from '@/lib/emissions';

interface BadgeCardProps {
  badge: Badge;
  size?: 'sm' | 'md';
}

export function BadgeCard({ badge, size = 'md' }: BadgeCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border transition-all duration-300',
        size === 'md' && 'p-4',
        size === 'sm' && 'p-3',
        badge.earned
          ? 'bg-card border-primary/30 shadow-glow-primary'
          : 'bg-muted/50 border-border opacity-60'
      )}
    >
      <div className="flex flex-col items-center text-center">
        <span className={cn(
          'mb-2',
          size === 'md' && 'text-4xl',
          size === 'sm' && 'text-2xl',
          !badge.earned && 'grayscale'
        )}>
          {badge.icon}
        </span>
        
        <h4 className={cn(
          'font-semibold',
          size === 'md' && 'text-sm',
          size === 'sm' && 'text-xs',
          badge.earned ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {badge.name}
        </h4>
        
        {size === 'md' && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {badge.description}
          </p>
        )}
        
        {!badge.earned && (
          <div className="w-full mt-2">
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/50 rounded-full transition-all duration-500"
                style={{ width: `${badge.progress}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">
              {badge.progress.toFixed(0)}%
            </span>
          </div>
        )}
        
        {badge.earned && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-eco-success rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
