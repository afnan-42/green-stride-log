import { motion } from 'framer-motion';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { LEVEL_INFO } from '@/lib/emissions';
import { User, Settings, LogOut, ChevronRight, Moon, Bell, Shield, HelpCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { emissions, progress, resetData, user, logout } = useUserData();
  const navigate = useNavigate();

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

  const menuItems = [
    { icon: Bell, label: 'Notifications', description: 'Reminders & updates' },
    { icon: Moon, label: 'Appearance', description: 'Dark mode & themes' },
    { icon: Shield, label: 'Privacy', description: 'Data & permissions' },
    { icon: HelpCircle, label: 'Help & Support', description: 'FAQ & contact' },
    { icon: Heart, label: 'About', description: 'Our mission' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-3xl p-8 mb-8 relative overflow-hidden"
        >
          {/* Background orbs */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl"
          />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center"
            >
              <User className="w-12 h-12 text-white" />
            </motion.div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{user?.name || 'Eco Warrior'}</h1>
              <p className="text-white/70">{user?.email}</p>
              <p className="text-white/80 mt-1">{levelInfo.name}</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="relative z-10 grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{emissions.score}</p>
              <p className="text-sm text-white/70">EcoScore</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{progress.streak}</p>
              <p className="text-sm text-white/70">Day Streak</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-bold text-white">{progress.badges.filter(b => b.earned).length}</p>
              <p className="text-sm text-white/70">Badges</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Menu Items */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {menuItems.map((menuItem, index) => {
              const Icon = menuItem.icon;
              return (
                <motion.button
                  key={menuItem.label}
                  variants={item}
                  whileHover={{ x: 4 }}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors',
                    index !== menuItems.length - 1 && 'border-b border-border'
                  )}
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{menuItem.label}</p>
                    <p className="text-sm text-muted-foreground">{menuItem.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              );
            })}
          </motion.div>

          <div className="space-y-6">
            {/* Carbon Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <h3 className="font-bold mb-4">Your Impact Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Total CO₂ saved</span>
                  <span className="font-semibold text-lg">{progress.totalSaved} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Equivalent trees</span>
                  <span className="font-semibold text-lg">{(progress.totalSaved / 20).toFixed(1)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Monthly footprint</span>
                  <span className="font-semibold text-lg">{emissions.monthly.total.toFixed(0)} kg</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                  <span className="text-muted-foreground">Potential savings</span>
                  <span className="font-semibold text-lg text-primary">₹{emissions.costEstimate.potential_savings.toFixed(0)}/mo</span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Button
                variant="outline"
                className="w-full justify-start text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => {
                  if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
                    resetData();
                    window.location.reload();
                  }
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Reset All Data
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Version */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">EcoBalance v1.0.0</p>
          <p className="text-sm text-muted-foreground">Made with 💚 for the planet</p>
        </motion.div>
      </div>
    </div>
  );
}
