import { cn } from '@/lib/utils';
import { Home, Target, Lightbulb, Trophy, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/input', icon: Target, label: 'Track' },
  { path: '/recommendations', icon: Lightbulb, label: 'Tips' },
  { path: '/achievements', icon: Trophy, label: 'Badges' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom">
      <div className="max-w-md mx-auto px-2">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <div className={cn(
                  'relative p-1.5 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}>
                  <Icon className={cn(
                    'w-5 h-5 transition-all duration-200',
                    isActive && 'scale-110'
                  )} />
                </div>
                <span className={cn(
                  'text-[10px] font-medium transition-all duration-200',
                  isActive && 'font-semibold'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
