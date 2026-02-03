import { BottomNav } from '@/components/BottomNav';
import { useUserData } from '@/hooks/useUserData';
import { Button } from '@/components/ui/button';
import { LEVEL_INFO } from '@/lib/emissions';
import { User, Settings, LogOut, ChevronRight, Moon, Bell, Shield, HelpCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProfilePage() {
  const { emissions, progress, resetData } = useUserData();

  if (!emissions || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header */}
      <div className="gradient-hero px-6 pt-12 pb-8 rounded-b-[2.5rem]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Eco Warrior</h1>
            <p className="text-primary-foreground/70">{levelInfo.name}</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold text-primary-foreground">{emissions.score}</p>
            <p className="text-xs text-primary-foreground/70">EcoScore</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold text-primary-foreground">{progress.streak}</p>
            <p className="text-xs text-primary-foreground/70">Day Streak</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-bold text-primary-foreground">{progress.badges.filter(b => b.earned).length}</p>
            <p className="text-xs text-primary-foreground/70">Badges</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 mt-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={cn(
                  'w-full flex items-center gap-4 p-4 text-left hover:bg-secondary/50 transition-colors',
                  index !== menuItems.length - 1 && 'border-b border-border'
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Carbon Summary */}
      <div className="px-6 mt-6">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="font-bold mb-4">Your Impact Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total CO₂ saved</span>
              <span className="font-semibold">{progress.totalSaved} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equivalent trees planted</span>
              <span className="font-semibold">{(progress.totalSaved / 20).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-semibold">Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="px-6 mt-6">
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
              resetData();
              window.location.reload();
            }
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Reset All Data
        </Button>
      </div>

      {/* Version */}
      <div className="px-6 mt-8 text-center">
        <p className="text-xs text-muted-foreground">EcoBalance v1.0.0</p>
        <p className="text-xs text-muted-foreground">Made with 💚 for the planet</p>
      </div>

      <BottomNav />
    </div>
  );
}
