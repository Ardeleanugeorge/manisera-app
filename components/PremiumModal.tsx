import React from 'react';
import { StyleSheet, Pressable, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import { usePremium } from '@/contexts/PremiumContext';
import { useRouter } from 'expo-router';

export default function PremiumModal() {
  const { showUpgradeModal, setShowUpgradeModal } = usePremium();
  const router = useRouter();

  return (
    <Modal
      visible={showUpgradeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowUpgradeModal(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>🚀 Upgrade la Premium</Text>
          
          <View style={styles.features}>
            <Text style={styles.feature}>✨ Afirmații personalizate</Text>
            <Text style={styles.feature}>🎯 Tracking avansat</Text>
            <Text style={styles.feature}>📊 Statistici detaliate</Text>
            <Text style={styles.feature}>🔔 Reminder-uri custom</Text>
            <Text style={styles.feature}>🎨 Tematici exclusive</Text>
          </View>

          <View style={styles.pricing}>
            <Text style={styles.price}>€9.99/lună</Text>
            <Text style={styles.subtitle}>sau €99.99/an (economie 17%)</Text>
          </View>

          <View style={styles.buttons}>
            <Pressable 
              style={styles.cancelButton} 
              onPress={() => setShowUpgradeModal(false)}
            >
              <Text style={styles.cancelText}>Mai târziu</Text>
            </Pressable>
            
            <Pressable 
              style={styles.upgradeButton} 
              onPress={() => {
                setShowUpgradeModal(false);
                router.push('/premium');
              }}
            >
              <Text style={styles.upgradeText}>Upgrade Acum</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: 400,
    maxWidth: 400,
    // Shadow properties removed for web compatibility
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1F2937',
  },
  features: {
    marginBottom: 24,
  },
  feature: {
    fontSize: 16,
    marginBottom: 12,
    color: '#374151',
    paddingLeft: 8,
  },
  pricing: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#059669',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    // gap: 12, // Not supported in React Native Web
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  upgradeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#059669',
    display: 'flex',
    alignItems: 'center',
  },
  upgradeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
