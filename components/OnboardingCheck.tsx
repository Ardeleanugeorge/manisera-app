import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserProfile } from '@/utils/personalization';

export default function OnboardingCheck() {
  const router = useRouter();

  useEffect(() => {
    const userProfile = getUserProfile();
    
    // Check if user has completed onboarding
    if (userProfile && userProfile.name && userProfile.birthDate) {
      // User has completed onboarding, go to main app
      router.replace('/(tabs)');
    } else {
      // User hasn't completed onboarding, stay on onboarding
      router.replace('/onboarding');
    }
  }, []);

  return null; // This component doesn't render anything
}