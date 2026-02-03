import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  label?: string;
  sublabel?: string;
  color?: 'primary' | 'energy' | 'transport' | 'food' | 'accent';
}

const sizeMap = {
  sm: 80,
  md: 120,
  lg: 180,
  xl: 240,
};

const strokeMap = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
};

const colorMap = {
  primary: 'stroke-primary',
  energy: 'stroke-eco-energy',
  transport: 'stroke-eco-transport',
  food: 'stroke-eco-food',
  accent: 'stroke-accent',
};

export function ProgressRing({
  value,
  max = 100,
  size = 'lg',
  strokeWidth,
  className,
  showValue = true,
  label,
  sublabel,
  color = 'primary',
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const dimension = sizeMap[size];
  const stroke = strokeWidth ?? strokeMap[size];
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (animatedValue / max) * 100));
  const offset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn(colorMap[color], 'transition-all duration-1000 ease-out')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn(
            'font-bold',
            size === 'xl' && 'text-5xl',
            size === 'lg' && 'text-4xl',
            size === 'md' && 'text-2xl',
            size === 'sm' && 'text-lg',
          )}>
            {Math.round(animatedValue)}
          </span>
          {label && (
            <span className={cn(
              'text-muted-foreground font-medium',
              size === 'xl' && 'text-base mt-1',
              size === 'lg' && 'text-sm',
              size === 'md' && 'text-xs',
              size === 'sm' && 'text-[10px]',
            )}>
              {label}
            </span>
          )}
          {sublabel && (
            <span className={cn(
              'text-muted-foreground/70',
              size === 'xl' && 'text-sm',
              size === 'lg' && 'text-xs',
              size === 'md' && 'text-[10px]',
              size === 'sm' && 'text-[8px]',
            )}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
