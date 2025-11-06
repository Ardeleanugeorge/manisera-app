import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, ScrollView, Linking, Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import Logo from '@/components/Logo';
import { setItemSync } from '@/utils/storage';

export default function DownloadScreen() {
  const router = useRouter();
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

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

  const handleDownloadAPK = () => {
    // Mark that user has seen download page
    setItemSync('manisera_seen_download', 'true');
    
    // Link to APK file (will be hosted on Vercel or CDN)
    // APK-ul trebuie construit cu: eas build --platform android --profile preview
    // Apoi plasat în public/manisera.apk
    const apkUrl = 'https://manisera-app.vercel.app/manisera.apk';
    Linking.openURL(apkUrl).catch(err => {
      console.error('Error opening APK link:', err);
      alert('Nu s-a putut descărca aplicația. Te rugăm să încerci din nou sau continuă pe web.');
    });
  };

  const handleOpenWebApp = () => {
    // Mark that user has seen download page
    setItemSync('manisera_seen_download', 'true');
    router.replace('/');
  };

  const handleInstallPWA = () => {
    // For PWA installation (if supported)
    if ('serviceWorker' in navigator && 'getInstalledRelatedApps' in navigator) {
      // PWA installation prompt
      alert('Pentru a instala aplicația, apasă butonul "Adaugă la ecranul principal" în meniul browserului.');
    }
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
            <Text style={styles.androidTitle}>📱 Descarcă aplicația pentru Android</Text>
            <Text style={styles.androidDescription}>
              Instalează aplicația Manisera pe telefonul tău Android pentru cea mai bună experiență.
            </Text>
            
            <Pressable style={styles.downloadButton} onPress={handleDownloadAPK}>
              <Text style={styles.downloadButtonText}>📥 Descarcă APK</Text>
            </Pressable>

            <Text style={styles.note}>
              ⚠️ După descărcare, permite instalarea din surse necunoscute în setările telefonului.
            </Text>

            <View style={styles.divider} />
            
            <Text style={styles.orText}>sau</Text>
            
            <Pressable style={styles.webButton} onPress={handleOpenWebApp}>
              <Text style={styles.webButtonText}>🌐 Continuă pe web</Text>
            </Pressable>
          </View>
        )}

        {isIOS && (
          <View style={styles.iosContainer}>
            <Text style={styles.iosTitle}>🍎 Pentru iOS</Text>
            <Text style={styles.iosDescription}>
              Adaugă aplicația la ecranul principal pentru o experiență mai bună.
            </Text>
            
            <Pressable style={styles.webButton} onPress={handleOpenWebApp}>
              <Text style={styles.webButtonText}>🌐 Deschide aplicația web</Text>
            </Pressable>
          </View>
        )}

        {!isAndroid && !isIOS && (
          <View style={styles.desktopContainer}>
            <Text style={styles.desktopTitle}>💻 Accesează aplicația</Text>
            <Text style={styles.desktopDescription}>
              Poți accesa Manisera direct în browser sau descărca aplicația pentru Android.
            </Text>
            
            <Pressable style={styles.webButton} onPress={handleOpenWebApp}>
              <Text style={styles.webButtonText}>🌐 Deschide aplicația</Text>
            </Pressable>

            <View style={styles.divider} />
            
            <Pressable style={styles.downloadButton} onPress={handleDownloadAPK}>
              <Text style={styles.downloadButtonText}>📥 Descarcă pentru Android</Text>
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
    marginBottom: 24,
    lineHeight: 20,
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
  downloadButton: {
    backgroundColor: '#059669',
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
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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

