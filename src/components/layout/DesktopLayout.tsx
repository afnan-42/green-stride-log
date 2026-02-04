import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Edit3, 
  Lightbulb, 
  Trophy, 
  User,
  Leaf,
  LogOut
} from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/input', icon: Edit3, label: 'My Lifestyle' },
  { path: '/recommendations', icon: Lightbulb, label: 'Tips' },
  { path: '/achievements', icon: Trophy, label: 'Achievements' },
  { path: '/profile', icon: User, label: 'Profile' },
];

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const location = useLocation();
  const { user, logout, emissions } = useUserData();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:flex w-64 lg:w-72 border-r border-border flex-col bg-card/50 backdrop-blur-sm"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl gradient-nature flex items-center justify-center"
            >
              <Leaf className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg">EcoBalance</h1>
              <p className="text-xs text-muted-foreground">Sustainability Tracker</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5 transition-transform duration-200',
                    !isActive && 'group-hover:scale-110'
                  )} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 rounded-full bg-primary-foreground"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          {user && (
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              
              {emissions && (
                <div className="text-sm mb-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>EcoScore</span>
                    <span className="font-semibold text-primary">{emissions.score}/100</span>
                  </div>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-full px-2 py-2 shadow-lg"
        >
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
        </motion.div>
      </nav>
    </div>
  );
}
