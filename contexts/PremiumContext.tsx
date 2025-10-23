import React, { createContext, useContext, useState, useEffect } from 'react';

interface PremiumContextType {
  isPremium: boolean;
  setIsPremium: (premium: boolean) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  upgradeToPremium: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Check if user is premium (in real app, this would check with backend)
  useEffect(() => {
    const savedPremium = localStorage.getItem('manisera_premium');
    if (savedPremium === 'true') {
      setIsPremium(true);
    }
  }, []);

  const upgradeToPremium = () => {
    // In real app, this would integrate with payment system
    setIsPremium(true);
    localStorage.setItem('manisera_premium', 'true');
    setShowUpgradeModal(false);
  };

  return (
    <PremiumContext.Provider value={{
      isPremium,
      setIsPremium,
      showUpgradeModal,
      setShowUpgradeModal,
      upgradeToPremium
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

