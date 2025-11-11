import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Logo from '@/components/Logo';
import { setItemSync } from '@/utils/storage';
import { usePWA } from '@/utils/usePWA';

export default function DownloadScreen() {
  const router = useRouter();
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { isInstallable, isInstalled, installApp } = usePWA();

  useEffect(() => {
    // Detect device type
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isAndroidDevice = /android/i.test(userAgent);
      const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent);
      
      setIsAndroid(isAndroidDevice);
      setIsIOS(isIOSDevice);
    }
  }, []);

  const handleInstallPWA = async () => {
    setItemSync('manisera_seen_download', 'true');
    const installed = await installApp();
    if (installed) {
      // Aplicația a fost instalată, redirecționează
      router.replace('/(tabs)');
    }
  };


  const handleOpenWebApp = () => {
    // Mark that user has seen download page
    setItemSync('manisera_seen_download', 'true');
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Logo width={200} height={120} style={styles.logo} />
        
        <Text style={styles.title}>Bine ai venit la Manisera!</Text>
        <Text style={styles.subtitle}>
          Aplicația ta de afirmații personalizate pentru prosperitate și bunăstare
        </Text>

        {isAndroid && (
          <View style={styles.androidContainer}>
            <Text style={styles.androidTitle}>📱 Instalează aplicația pe Android</Text>
            <Text style={styles.androidDescription}>
              Instalează Manisera direct din browser! Aplicația se instalează instant și funcționează ca o aplicație nativă, fără erori de instalare.
            </Text>
            <Text style={styles.infoText}>
              💡 <Text style={styles.bold}>Instalare PWA:</Text> Aplicația se instalează direct din browser și funcționează offline, exact ca o aplicație normală instalată din Google Play.
            </Text>
            
            {/* Buton PWA - recomandat */}
            {isInstallable && !isInstalled && (
              <>
                <Pressable style={styles.installPWAButton} onPress={handleInstallPWA}>
                  <Text style={styles.installPWAButtonText}>✨ Instalează aplicația</Text>
                  <Text style={styles.installPWASubtext}>Recomandat - Instalare rapidă și sigură</Text>
                </Pressable>
                <View style={styles.divider} />
              </>
            )}

            {isInstalled && (
              <View style={styles.installedBadge}>
                <Text style={styles.installedText}>✅ Aplicația este instalată!</Text>
              </View>
            )}

            {/* Mesaj dacă PWA nu este disponibil */}
            {!isInstallable && !isInstalled && (
              <View style={styles.infoBox}>
                <Text style={styles.infoBoxText}>
                  💡 Pentru a instala aplicația, folosește butonul "Adaugă la ecranul principal" din meniul browserului (⋮ sau ⋯).
                </Text>
              </View>
            )}
          </View>
        )}

        {isIOS && (
          <View style={styles.iosContainer}>
            <Text style={styles.iosTitle}>🍎 Instalează pe iOS</Text>
            <Text style={styles.iosDescription}>
              Adaugă aplicația la ecranul principal pentru o experiență mai bună.
            </Text>
            <Text style={styles.iosInstructions}>
              1. Apasă butonul Share (partajare) în Safari{'\n'}
              2. Selectează "Adaugă la ecranul principal"{'\n'}
              3. Apasă "Adaugă"
            </Text>
          </View>
        )}

        {!isAndroid && !isIOS && (
          <View style={styles.desktopContainer}>
            <Text style={styles.desktopTitle}>💻 Accesează aplicația</Text>
            <Text style={styles.desktopDescription}>
              Poți accesa Manisera direct în browser. Pe telefon, poți instala aplicația direct din browser (PWA).
            </Text>
            
            <Pressable style={styles.webButton} onPress={handleOpenWebApp}>
              <Text style={styles.webButtonText}>🌐 Deschide aplicația</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>✨ Caracteristici:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✅ 6 categorii de focus</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✅ 600 de afirmații per categorie</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✅ Recunoaștere vocală</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✅ Progres secvențial</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>✅ Personalizare avansată</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  androidContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  androidTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 12,
    textAlign: 'center',
  },
  androidDescription: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  iosContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  iosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0C4A6E',
    marginBottom: 12,
    textAlign: 'center',
  },
  iosDescription: {
    fontSize: 14,
    color: '#075985',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  iosInstructions: {
    fontSize: 13,
    color: '#075985',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 8,
  },
  desktopContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  desktopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  desktopDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  installPWAButton: {
    backgroundColor: '#6ECEDA',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  installPWAButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  installPWASubtext: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  infoBoxText: {
    fontSize: 13,
    color: '#075985',
    lineHeight: 20,
    textAlign: 'center',
  },
  installedBadge: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  installedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webButton: {
    backgroundColor: '#6ECEDA',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  webButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  note: {
    fontSize: 12,
    color: '#92400E',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#047857',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 18,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    width: '100%',
    marginVertical: 20,
  },
  orText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  featureItem: {
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
});

