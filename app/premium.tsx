import React, { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { usePremium } from '@/contexts/PremiumContext';

export default function PremiumScreen() {
  const router = useRouter();
  const { upgradeToPremium } = usePremium();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: ''
  });
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'monthly',
      title: 'Lunar',
      price: '€9.99',
      period: '/lună',
      description: 'Perfect pentru început',
      popular: false
    },
    {
      id: 'yearly',
      title: 'Anual',
      price: '€99.99',
      period: '/an',
      description: 'Economie 17%',
      popular: true,
      savings: 'Economisești €20'
    }
  ];

  const features = [
    '🌅 3 sesiuni personalizate pe zi',
    '🎯 Afirmații adaptate la vârsta ta',
    '📊 Tracking progres detaliat',
    '🔔 Reminder-uri inteligente',
    '🏆 Sistem de achievements',
    '📱 Sincronizare pe toate dispozitivele',
    '🎨 Tematici exclusive',
    '💬 Suport prioritar'
  ];

  const testCards = [
    {
      number: '4242 4242 4242 4242',
      name: 'Test Card Visa',
      description: 'Card de test Visa - funcționează întotdeauna'
    },
    {
      number: '5555 5555 5555 4444',
      name: 'Test Card Mastercard',
      description: 'Card de test Mastercard - funcționează întotdeauna'
    },
    {
      number: '3782 822463 10005',
      name: 'Test Card American Express',
      description: 'Card de test Amex - funcționează întotdeauna'
    }
  ];

  const handleCardNumberChange = (text: string) => {
    // Format card number with spaces
    const formatted = text.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    setPaymentData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpiryChange = (text: string) => {
    // Format expiry date MM/YY
    const formatted = text.replace(/\D/g, '').replace(/(.{2})/, '$1/');
    setPaymentData(prev => ({ ...prev, expiryDate: formatted }));
  };

  const handleCVVChange = (text: string) => {
    // Limit CVV to 3-4 digits
    const formatted = text.replace(/\D/g, '').slice(0, 4);
    setPaymentData(prev => ({ ...prev, cvv: formatted }));
  };

  const handlePayment = async () => {
    // Check if online (required for payment)
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      Alert.alert(
        'Conexiune necesară',
        'Conexiune la internet este necesară pentru upgrade la Premium. Te rugăm să te conectezi la internet și să încerci din nou.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    // In production, this would call Stripe/Google Play/Apple Pay API
    setTimeout(() => {
      setIsProcessing(false);
      upgradeToPremium(selectedPlan);
      Alert.alert(
        'Succes! 🎉',
        'Felicitări! Ai devenit membru Premium. Acum ai acces la toate funcționalitățile avansate!',
        [
          {
            text: 'Începe să explorezi',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    }, 2000);
  };

  const fillTestCard = (card: typeof testCards[0]) => {
    setPaymentData(prev => ({
      ...prev,
      cardNumber: card.number,
      cardholderName: 'Test User',
      expiryDate: '12/25',
      cvv: '123',
      email: 'test@example.com'
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🚀 Upgrade la Premium</Text>
        <Text style={styles.subtitle}>
          Deblochează toate funcționalitățile și transformă-ți viața cu afirmații personalizate
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Ce primești cu Premium:</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Pricing Plans */}
      <View style={styles.pricingContainer}>
        <Text style={styles.sectionTitle}>Alege planul tău:</Text>
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlanCard,
              plan.popular && styles.popularPlanCard
            ]}
            onPress={() => setSelectedPlan(plan.id as 'monthly' | 'yearly')}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Mai popular</Text>
              </View>
            )}
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>{plan.period}</Text>
              </View>
            </View>
            <Text style={styles.planDescription}>{plan.description}</Text>
            {plan.savings && (
              <Text style={styles.savingsText}>{plan.savings}</Text>
            )}
          </Pressable>
        ))}
      </View>

      {/* Test Cards */}
      <View style={styles.testCardsContainer}>
        <Text style={styles.sectionTitle}>Carduri de test (pentru demonstrație):</Text>
        {testCards.map((card, index) => (
          <Pressable
            key={index}
            style={styles.testCard}
            onPress={() => fillTestCard(card)}
          >
            <Text style={styles.testCardName}>{card.name}</Text>
            <Text style={styles.testCardNumber}>{card.number}</Text>
            <Text style={styles.testCardDescription}>{card.description}</Text>
          </Pressable>
        ))}
      </View>

      {/* Payment Form */}
      <View style={styles.paymentContainer}>
        <Text style={styles.sectionTitle}>Informații de plată:</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Numărul cardului</Text>
          <TextInput
            style={styles.textInput}
            value={paymentData.cardNumber}
            onChangeText={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={19}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Data expirării</Text>
            <TextInput
              style={styles.textInput}
              value={paymentData.expiryDate}
              onChangeText={handleExpiryChange}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.textInput}
              value={paymentData.cvv}
              onChangeText={handleCVVChange}
              placeholder="123"
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Numele de pe card</Text>
          <TextInput
            style={styles.textInput}
            value={paymentData.cardholderName}
            onChangeText={(text) => setPaymentData(prev => ({ ...prev, cardholderName: text }))}
            placeholder="Ion Popescu"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.textInput}
            value={paymentData.email}
            onChangeText={(text) => setPaymentData(prev => ({ ...prev, email: text }))}
            placeholder="ion@example.com"
            keyboardType="email-address"
          />
        </View>
      </View>

      {/* Payment Button */}
      <Pressable
        style={[
          styles.paymentButton,
          isProcessing && styles.processingButton
        ]}
        onPress={handlePayment}
        disabled={isProcessing}
      >
        <Text style={styles.paymentButtonText}>
          {isProcessing ? 'Se procesează...' : `Plătește ${selectedPlan === 'monthly' ? '€9.99/lună' : '€99.99/an'}`}
        </Text>
      </Pressable>

      {/* Security Notice */}
      <View style={styles.securityNotice}>
        <Text style={styles.securityText}>
          🔒 Plățile sunt procesate în siguranță. Nu stocăm informațiile cardului.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  featureItem: {
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
  },
  pricingContainer: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    position: 'relative',
  },
  selectedPlanCard: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  popularPlanCard: {
    borderColor: '#F59E0B',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  period: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  savingsText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
  testCardsContainer: {
    padding: 20,
  },
  testCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  testCardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  testCardNumber: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#059669',
    marginVertical: 4,
  },
  testCardDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentContainer: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    // gap: 12, // Not supported in React Native Web
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  paymentButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    margin: 20,
  },
  processingButton: {
    backgroundColor: '#6B7280',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  securityNotice: {
    padding: 20,
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
