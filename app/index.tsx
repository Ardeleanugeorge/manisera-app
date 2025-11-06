import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { getUserProfile } from '@/utils/personalization';
import { View, Text } from 'react-native';
import { getItemSync } from '@/utils/storage';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Use requestAnimationFrame to ensure the component is mounted
    const checkAndNavigate = () => {
      // Check if user is on Android and hasn't seen download page
      if (typeof window !== 'undefined') {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isAndroid = /android/i.test(userAgent);
        const hasSeenDownload = getItemSync('manisera_seen_download');
        
        // If Android and hasn't seen download page, show download option
        if (isAndroid && !hasSeenDownload) {
          // Check if user wants to skip download (they can go to /download directly)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('skip') !== 'true') {
            router.replace('/download');
            return;
          }
        }
      }

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
        Se încarcă...
      </Text>
    </View>
  );
}
