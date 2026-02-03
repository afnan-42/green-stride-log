import { useUserData } from '@/hooks/useUserData';
import { Onboarding } from '@/components/Onboarding';
import { Dashboard } from '@/pages/Dashboard';

const Index = () => {
  const { isOnboarded, isLoading, completeOnboarding } = useUserData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-nature flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-3xl">🌱</span>
          </div>
          <p className="text-muted-foreground">Loading EcoBalance...</p>
        </div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return <Dashboard />;
};

export default Index;
