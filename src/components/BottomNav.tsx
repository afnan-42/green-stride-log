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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-full px-2 py-2 shadow-lg">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-all duration-200',
                  isActive && 'scale-105'
                )} />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
