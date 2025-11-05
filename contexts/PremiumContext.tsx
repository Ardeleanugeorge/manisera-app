import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPremiumStatus, savePremiumStatus, getUserId } from '@/utils/premiumSync';

interface PremiumContextType {
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeToPremium: (plan?: 'monthly' | 'yearly') => void;
  userId: string;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userId] = useState(() => getUserId());

  // Check if user is premium (loads from localStorage, can sync with backend)
  useEffect(() => {
    const checkPremiumStatus = () => {
      const premiumStatus = getPremiumStatus();
      
      // Check if premium has expired (works offline)
      if (premiumStatus.isPremium && premiumStatus.expiresAt) {
        const now = Date.now();
        if (premiumStatus.expiresAt < now) {
          // Premium expired - downgrade to free
          setIsPremium(false);
          savePremiumStatus({
            ...premiumStatus,
            isPremium: false
          });
          return;
        }
      }
      
      setIsPremium(premiumStatus.isPremium);
      
      // TODO: Sync with backend on app start (only if online)
      // This would check if user has premium subscription on server
      // For now, it works offline with localStorage
    };
    
    checkPremiumStatus();
    
    // Check premium status every hour (in case it expires while app is open)
    const interval = setInterval(checkPremiumStatus, 60 * 60 * 1000); // 1 hour
    
    return () => clearInterval(interval);
  }, []);

  const upgradeToPremium = (plan: 'monthly' | 'yearly' = 'monthly') => {
    // Calculate expiration (30 days for monthly, 365 for yearly)
    const expiresAt = plan === 'monthly' 
      ? Date.now() + (30 * 24 * 60 * 60 * 1000)
      : Date.now() + (365 * 24 * 60 * 60 * 1000);
    
    const premiumStatus = {
      isPremium: true,
      userId,
      plan,
      expiresAt,
      // In production, this would come from payment processor (Stripe, Google Play, etc.)
      subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
    
    setIsPremium(true);
    savePremiumStatus(premiumStatus);
    setShowUpgradeModal(false);
    
    // TODO: In production, this would:
    // 1. Process payment with Stripe/Google Play/Apple Pay
    // 2. Verify payment on backend
    // 3. Sync premium status to backend
    // 4. Update all user's devices via push notification
  };

  return (
    <PremiumContext.Provider value={{
      isPremium,
      setIsPremium,
      showUpgradeModal,
      setShowUpgradeModal,
      upgradeToPremium,
      userId
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

