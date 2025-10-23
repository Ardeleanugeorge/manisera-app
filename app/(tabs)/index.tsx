import { StyleSheet, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { generateThirtyDayPlan } from '@/constants/plan';
import { getUserProfile } from '@/utils/personalization';
import Logo from '@/components/Logo';

export default function ProgramScreen() {
  const userProfile = getUserProfile();
  const plan = generateThirtyDayPlan(userProfile.preferences?.focusArea || 'bani', userProfile);
  
  // Check which days are completed
  const completedDays = JSON.parse(localStorage.getItem('manisera_completed_days') || '[]');
  const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;

  return (
    <View style={styles.container}>
      <Logo width={160} height={96} style={styles.logo} />
      <Text style={styles.title}>Program 30 zile</Text>
      <FlatList
        contentContainerStyle={styles.grid}
        numColumns={5}
        data={plan}
        keyExtractor={(item) => String(item.day)}
        renderItem={({ item }) => {
          const isCompleted = completedDays.includes(item.day);
          const isLocked = item.day > lastCompletedDay + 1;
          
          return (
            <Link href={{ pathname: '/day/[day]', params: { day: String(item.day) } }} asChild>
              <Pressable style={styles.dayCell}>
                <Text style={styles.dayText}>
                  {item.day}
                </Text>
                {isCompleted && <Text style={styles.icon}>✓</Text>}
                {isLocked && <Text style={styles.lockIcon}>🔒</Text>}
              </Pressable>
            </Link>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#FAFAFA', // Alb perlat
  },
  logo: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E2A38', // Albastru intens
    marginBottom: 8,
  },
  grid: {
    marginTop: 16,
  },
  dayCell: {
    width: '18%',
    aspectRatio: 1,
    margin: '1%',
    borderWidth: 1,
    borderColor: '#6ECEDA', // Turcoaz
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 50,
    backgroundColor: '#FFFFFF', // Alb pentru carduri
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dayText: {
    fontWeight: '600',
    color: '#1E2A38', // Albastru intens
    fontSize: 14,
  },
  icon: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 20,
    color: '#A3C4A7', // Verde salvie pentru succes
    fontWeight: 'bold',
  },
  lockIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 20,
    color: '#6B7280',
    fontWeight: 'bold',
  },
});
