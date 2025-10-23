import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserProfile } from '@/utils/personalization';
import { View, Text } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Use requestAnimationFrame to ensure the component is mounted
    const checkAndNavigate = () => {
      const userProfile = getUserProfile();
      
      // Check if user has completed onboarding
      if (userProfile && userProfile.name && userProfile.birthDate) {
        // User has completed onboarding, go to main app
        router.replace('/(tabs)');
      } else {
        // User hasn't completed onboarding, go to onboarding
        router.replace('/onboarding');
      }
    };

    // Use requestAnimationFrame to ensure the router is ready
    requestAnimationFrame(checkAndNavigate);
  }, []);

  // Show loading while checking
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text>Loading...</Text>
      <Text style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        Pentru a testa onboarding-ul: localStorage.clear() în console
      </Text>
    </View>
  );
}
