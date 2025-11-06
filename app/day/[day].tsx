import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { generateThirtyDayPlan } from '@/constants/plan';
import { getUserProfile } from '@/utils/personalization';
import { usePremium } from '@/contexts/PremiumContext';
import { getItemSync } from '@/utils/storage';

export default function DayDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string }>();
  const dayNumber = Math.max(1, Math.min(30, Number(params.day ?? 1)));
  const { isPremium } = usePremium();
  
  const userProfile = getUserProfile();
  const plan = generateThirtyDayPlan(userProfile.preferences?.focusArea || 'bani', userProfile);
  
  // Check which days are completed
  const completedDays = JSON.parse(getItemSync('manisera_completed_days') || '[]');
  const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  
  // Check if this day is locked - only allow access to the next day in sequence
  const isDayLocked = dayNumber > lastCompletedDay + 1;
  
  const item = plan.find((p) => p.day === dayNumber)!;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ziua {dayNumber}</Text>
      
      {isDayLocked ? (
        <View style={styles.lockedDayWarning}>
          <Text style={styles.lockedDayTitle}>🔒 Ziua blocată</Text>
          <Text style={styles.lockedDayText}>
            Trebuie să completezi ziua anterioară înainte să accesezi ziua {dayNumber}.
            {'\n'}Completează zilele în ordine secvențială: 1 → 2 → 3 → 4...
          </Text>
        </View>
      ) : isPremium ? (
        <>
          <Text style={styles.sub}>Toate sesiunile pentru azi</Text>
          
          {/* Morning Session */}
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>🌅 Dimineața</Text>
            {item.sessions.morning.map((affirmation, idx) => (
              <Text key={idx} style={styles.aff}>
                {affirmation}
              </Text>
            ))}
          </View>
          
          {/* Afternoon Session */}
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>☀️ După-amiaza</Text>
            {item.sessions.afternoon.map((affirmation, idx) => (
              <Text key={idx} style={styles.aff}>
                {affirmation}
              </Text>
            ))}
          </View>
          
          {/* Evening Session */}
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>🌙 Seara</Text>
            {item.sessions.evening.map((affirmation, idx) => (
              <Text key={idx} style={styles.aff}>
                {affirmation}
              </Text>
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.sub}>Sesiunea gratuită - Dimineața</Text>
          <View style={styles.sessionCard}>
            <Text style={styles.sessionTitle}>🌅 Dimineața</Text>
            {item.sessions.morning.map((affirmation, idx) => (
              <Text key={idx} style={styles.aff}>
                {affirmation}
              </Text>
            ))}
          </View>
          
          <View style={styles.premiumBanner}>
            <Text style={styles.premiumText}>
              🚀 Upgrade pentru a accesa toate cele 3 sesiuni pe zi
            </Text>
          </View>
        </>
      )}

      {!isDayLocked && (
        <Pressable style={styles.cta} onPress={() => router.push({ pathname: '/(tabs)/two', params: { day: String(dayNumber) } })}>
          <Text style={styles.ctaText}>Deschide sesiunea</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // gap: 16, // Not supported in React Native Web
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  sub: {
    opacity: 0.8,
  },
  card: {
    // gap: 12, // Not supported in React Native Web
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  aff: {
    fontSize: 16,
    lineHeight: 22,
  },
  cta: {
    marginTop: 12,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
  lockedDayWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  lockedDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  lockedDayText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  sessionCard: {
    // gap: 12, // Not supported in React Native Web
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  premiumBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  premiumText: {
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
  },
});





