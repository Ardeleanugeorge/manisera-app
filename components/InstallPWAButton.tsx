import React from 'react';
import { Platform, StyleSheet, Pressable, Text, View } from 'react-native';
import { usePWA } from '@/utils/usePWA';

export default function InstallPWAButton() {
  const { isInstallable, isInstalled, installApp } = usePWA();

  // Nu afișa butonul dacă nu suntem pe web sau dacă aplicația este deja instalată
  if (Platform.OS !== 'web' || isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    const installed = await installApp();
    if (installed) {
      console.log('Aplicația a fost instalată cu succes!');
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handleInstall}>
        <Text style={styles.buttonText}>📱 Instalează aplicația</Text>
        <Text style={styles.buttonSubtext}>Adaugă pe ecranul principal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6ECEDA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
});

