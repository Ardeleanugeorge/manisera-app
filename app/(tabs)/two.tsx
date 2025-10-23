import { StyleSheet, Pressable, Animated, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { useEffect, useMemo, useRef, useState } from 'react';
import { generateThirtyDayPlan } from '@/constants/plan';
import { usePremium } from '@/contexts/PremiumContext';
import PremiumModal from '@/components/PremiumModal';
import { getUserProfile } from '@/utils/personalization';
import { getSessionContextMessage } from '@/constants/sessionContext';

export default function SessionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ day?: string }>();
  const requestedDay = Math.max(1, Math.min(30, Number(params.day ?? 1)));
  
  const targetReps = 3;
  const userProfile = getUserProfile();
  const plan = useMemo(() => generateThirtyDayPlan(userProfile.preferences?.focusArea || 'bani', userProfile), [userProfile]);
  
  // Check which days are completed
  const completedDays = JSON.parse(localStorage.getItem('manisera_completed_days') || '[]');
  const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  
  // Check if user can access this day (only one day per day)
  const currentDate = new Date();
  const todayString = currentDate.toDateString();
  const lastAccessDate = localStorage.getItem('manisera_last_access_date');
  const lastCompletedDayDate = localStorage.getItem('manisera_last_completed_day_date');
  
  // If it's a new day, reset access
  if (lastAccessDate !== todayString) {
    localStorage.setItem('manisera_last_access_date', todayString);
    localStorage.setItem('manisera_last_completed_day_date', '');
  }
  
  // Check if user already completed a day today
  const hasCompletedToday = lastCompletedDayDate === todayString;
  
  // Check if user already completed a day today (prevent multiple days in one day)
  const isDayBlockedToday = hasCompletedToday && requestedDay > lastCompletedDay;
  
  // If user tries to access a day that's blocked today, redirect to the allowed day
  const finalRequestedDay = isDayBlockedToday ? lastCompletedDay : requestedDay;
  
  // Show warning if user tries to access a locked day
  const isDayLocked = finalRequestedDay > lastCompletedDay + 1;

  // Only allow access to the next day or completed days
  const allowedDay = isDayLocked ? lastCompletedDay + 1 : finalRequestedDay;
  const today = plan.find(p => p.day === allowedDay) || plan[0];
  const dayNumber = allowedDay;
  
  // Check if current day is completed
  const isCurrentDayCompleted = completedDays.includes(dayNumber);
  
  const { isPremium, setShowUpgradeModal } = usePremium();
  
  // Detect Safari iPhone
  const isSafariiPhone = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
  
  // Streak and achievements tracking
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  
  // Get only morning session (first session) for free users
  const morningAffirmations = today.sessions.morning;
  
  // Load progress from localStorage (only if day is not completed)
  const getStoredProgress = () => {
    if (isCurrentDayCompleted) {
      // If day is completed, start from beginning
      return { affirmationIndex: 0, reps: 0 };
    }

    const stored = localStorage.getItem(`manisera_free_progress_${allowedDay}`);
    if (stored) {
      const progress = JSON.parse(stored);
      return {
        affirmationIndex: progress.affirmationIndex || 0,
        reps: progress.reps || 0
      };
    }
    return { affirmationIndex: 0, reps: 0 };
  };
  
  const storedProgress = getStoredProgress();
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(storedProgress.affirmationIndex);
  const [reps, setReps] = useState(storedProgress.reps);
  const currentAffirmation = morningAffirmations[currentAffirmationIndex];
  
  // Inspirational quotes
  const inspirationalQuotes = [
    { emoji: '🧘', quote: 'Imaginația este cheia. Nu repeta mecanic — simte că ești deja acolo.', author: 'Neville Goddard' },
    { emoji: '🧠', quote: 'Nu e despre cuvinte, ci despre cum îți schimbi starea interioară.', author: 'Joe Dispenza' },
    { emoji: '💬', quote: 'Afirmațiile funcționează atunci când devin credințe. Repetă-le până devin naturale.', author: 'Louise Hay' },
    { emoji: '🌊', quote: 'Focalizează-te pe senzația din spatele afirmației, nu pe lipsa a ceea ce îți dorești.', author: 'Abraham Hicks' }
  ];
  
  const [randomQuote] = useState(() => {
    return inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
  });
  
  // Speech recognition state
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const repLockRef = useRef(false);
  
  // Speech recognition functions
  const startListening = () => {
    if (listeningRef.current) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported');
      alert('Recunoașterea vocală nu este suportată pe acest dispozitiv');
      return;
    }

    const instance = new SpeechRecognition();
    
    // Configure differently for Safari iPhone
    if (isSafariiPhone) {
      instance.continuous = false; // Safari iPhone doesn't support continuous
      instance.interimResults = false; // Safari iPhone doesn't support interim results
      instance.lang = 'ro-RO';
      instance.maxAlternatives = 1;
    } else {
      instance.continuous = true;
      instance.interimResults = true;
      instance.lang = 'ro-RO';
      instance.maxAlternatives = 1;
    }
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      if (listeningRef.current) {
        console.log('Speech recognition timeout');
        stopListening();
      }
    }, 30000); // 30 seconds timeout

    instance.onstart = () => {
      console.log('Speech recognition started');
      setListening(true);
      listeningRef.current = true;
    };

      instance.onresult = (e: any) => {
      const results = Array.from(e.results);
      let interimText = '';
      
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.isFinal) {
          const finalText = result[0].transcript.toLowerCase();
          console.log('Final text:', finalText);
          
          if (repLockRef.current) {
            console.log('SKIPPING - rep lock is active');
            continue;
          }

          // Ultra lenient matching for Safari iPhone
          const affirmationWords = currentAffirmation.toLowerCase().split(' ');
          const spokenWords = finalText.split(' ');
          
          // Very permissive matching for Safari iPhone
          const matchedWords = affirmationWords.filter(word => 
            spokenWords.some(spoken => {
              // Exact match
              if (spoken === word) return true;
              // Contains match
              if (spoken.includes(word) || word.includes(spoken)) return true;
              // Partial match for longer words
              if (word.length > 4 && spoken.length > 4) {
                return spoken.includes(word.substring(0, 4)) || word.includes(spoken.substring(0, 4));
              }
              // Very loose match for short words
              if (word.length <= 4 && spoken.length <= 4) {
                return spoken.includes(word.substring(0, 2)) || word.includes(spoken.substring(0, 2));
              }
              return false;
            })
          );
          
          // Very low threshold for Safari iPhone
          const minMatches = isSafariiPhone ? 1 : 2;
          if (matchedWords.length >= minMatches) {
            console.log('🎯 MATCH FOUND! Incrementing reps');
            repLockRef.current = true;
            setReps(prev => {
              const next = Math.min(targetReps, prev + 1);
              
                    // Save progress to localStorage
                    const progress = {
                      affirmationIndex: currentAffirmationIndex,
                      reps: next
                    };
                    localStorage.setItem(`manisera_free_progress_${allowedDay}`, JSON.stringify(progress));
              
              // If we completed all reps for current affirmation
              if (next >= targetReps) {
                // Move to next affirmation or complete session
                if (currentAffirmationIndex < morningAffirmations.length - 1) {
                  // Move to next affirmation
                  setTimeout(() => {
                    const newIndex = currentAffirmationIndex + 1;
                    setCurrentAffirmationIndex(newIndex);
                    setReps(0);
                    
                  // Save new progress
                  const newProgress = {
                    affirmationIndex: newIndex,
                    reps: 0
                  };
                  localStorage.setItem(`manisera_free_progress_${allowedDay}`, JSON.stringify(newProgress));
                    
                    repLockRef.current = false;
                    setListening(false);
                listeningRef.current = false;
                  }, 1000);
                } else {
                  // Session completed
                  setTimeout(() => {
                    repLockRef.current = false;
                setListening(false);
                    listeningRef.current = false;
                    
          // Clear progress and mark day as completed
          localStorage.removeItem(`manisera_free_progress_${allowedDay}`);
          const completedDays = JSON.parse(localStorage.getItem('manisera_completed_days') || '[]');
          if (!completedDays.includes(allowedDay)) {
            completedDays.push(allowedDay);
            localStorage.setItem('manisera_completed_days', JSON.stringify(completedDays));

            // Mark that user completed a day today
            localStorage.setItem('manisera_last_completed_day_date', todayString);

            console.log('Day', allowedDay, 'marked as completed');

            // Force page reload to update day status
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
                  }, 1000);
                }
              } else {
                // Continue with same affirmation
                setTimeout(() => {
                  repLockRef.current = false;
                  setListening(false);
                  listeningRef.current = false;
                }, 2000);
              }
              
              return next;
            });
          }
        } else {
          interimText += result[0].transcript;
        }
      }
      
      if (interimText) {
        setRecognizedText(interimText);
      }
    };

    instance.onerror = (e: any) => {
      console.log('Speech recognition error:', e);
      clearTimeout(timeout);
      setListening(false);
      listeningRef.current = false;
      
      // Handle specific errors
      if (e.error === 'not-allowed') {
        alert('Microfonul a fost blocat. Te rugăm să permiți accesul la microfon în setările browserului.');
      } else if (e.error === 'no-speech') {
        if (isSafariiPhone) {
          console.log('Safari iPhone: No speech detected, trying again...');
          // Auto-retry for Safari iPhone
          setTimeout(() => {
            if (!listeningRef.current) {
              startListening();
            }
          }, 1000);
        } else {
          alert('Nu s-a detectat vorbire. Te rugăm să încerci din nou.');
        }
      } else if (e.error === 'network') {
        alert('Eroare de rețea. Verifică conexiunea la internet.');
      } else if (e.error === 'aborted') {
        console.log('Speech recognition aborted, this is normal for Safari iPhone');
      }
    };

    instance.onend = () => {
      console.log('Speech recognition ended');
      clearTimeout(timeout);
      setListening(false);
      listeningRef.current = false;
    };

      recognitionRef.current = instance;
    instance.start();
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      listeningRef.current = false;
    }
  }


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Sesiune - Ziua {dayNumber}</Text>
      
      {isDayLocked ? (
        <View style={styles.lockedDayWarning}>
          <Text style={styles.lockedDayTitle}>🔒 Ziua blocată</Text>
          <Text style={styles.lockedDayText}>
            Trebuie să completezi ziua {lastCompletedDay + 1} înainte să accesezi ziua {requestedDay}.
          </Text>
        </View>
      ) : isDayBlockedToday ? (
        <View style={styles.blockedTodayWarning}>
          <Text style={styles.blockedTodayTitle}>⏰ O zi pe zi</Text>
          <Text style={styles.blockedTodayText}>
            Ai completat deja o zi astăzi. Revino mâine pentru următoarea zi!
          </Text>
        </View>
      ) : isCurrentDayCompleted ? (
        <View style={styles.completedDayContainer}>
          <Text style={styles.completedDayTitle}>✅ Ziua completată!</Text>
          <Text style={styles.completedDayText}>
            Ai completat cu succes toate sesiunile pentru ziua {dayNumber}.
          </Text>
          <Text style={styles.nextDayText}>
            {dayNumber < 30 ? `Următoarea zi disponibilă: ${dayNumber + 1}` : 'Felicitări! Ai completat toate zilele!'}
          </Text>
        </View>
      ) : (
        <>
          {/* Session info */}
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>
              {isPremium ? '🌅 Sesiunea de Dimineață' : '🌅 Sesiunea Gratuită'}
            </Text>
            {!isPremium && (
              <Text style={styles.sessionSubtitle}>
                Upgrade pentru a accesa toate cele 3 sesiuni pe zi
              </Text>
            )}
          </View>

          {/* Session context message */}
          <View style={styles.contextContainer}>
            <Text style={styles.contextText}>
              {getSessionContextMessage('morning', dayNumber, userProfile.preferences?.focusArea)}
            </Text>
          </View>

          {/* Affirmation display */}
          <View style={styles.readingContainer}>
            <Text style={styles.aff}>{currentAffirmation}</Text>
          </View>
          <Text style={styles.reps}>
            Afirmația {currentAffirmationIndex + 1} din {morningAffirmations.length}
          </Text>
          <Text style={styles.reps}>{reps} / {targetReps}</Text>
          
          {/* Start button for free users */}
          {!listening && reps < targetReps && (
            <Pressable 
              style={styles.startButton}
              onPress={startListening}
            >
              <Text style={styles.startButtonText}>🎤 ROSTEȘTE</Text>
            </Pressable>
          )}
          
          
          {/* Listening state */}
          {listening && (
            <View style={styles.listeningContainer}>
              <Text style={styles.listeningText}>🎤 Ascultă...</Text>
              {recognizedText && (
                <Text style={styles.recognizedText}>{recognizedText}</Text>
              )}
            </View>
          )}
          
          {currentAffirmationIndex === morningAffirmations.length - 1 && reps >= targetReps && (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Felicitări!</Text>
              <Text style={styles.successSubtitle}>
                Ai completat prima sesiune!
              </Text>
              <Text style={styles.nextStepText}>
                Următorul pas: Încearcă Premium pentru 3 sesiuni pe zi sau așteaptă următoarea zi pentru o nouă sesiune
              </Text>
            </View>
          )}
          
          {/* Inspirational quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteEmoji}>{randomQuote.emoji}</Text>
            <Text style={styles.quoteText}>"{randomQuote.quote}"</Text>
            <Text style={styles.quoteAuthor}>— {randomQuote.author}</Text>
          </View>
        </>
      )}
      
      {/* Premium features */}
      {!isPremium && (
        <Pressable 
          style={styles.premiumBanner} 
          onPress={() => setShowUpgradeModal(true)}
        >
          <Text style={styles.premiumText}>🚀 Upgrade la Premium pentru toate cele 3 sesiuni pe zi</Text>
        </Pressable>
      )}

      {isPremium && (
        <View style={styles.premiumFeatures}>
          <Text style={styles.premiumLabel}>✨ Premium Active</Text>
          <Text style={styles.premiumFeature}>Acces la toate cele 3 sesiuni pe zi</Text>
          
          {/* Reminder for next session */}
          <View style={styles.reminderContainer}>
            <Text style={styles.reminderText}>
              ⏰ E timpul pentru sesiunea de după-amiaza!
            </Text>
            <Pressable 
              style={styles.reminderButton}
              onPress={() => router.push('/(tabs)/sessions')}
            >
              <Text style={styles.reminderButtonText}>Începe sesiunea</Text>
            </Pressable>
          </View>
    </View>
      )}
      
      <PremiumModal />
    </ScrollView>
  );
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9ăâîșşțţ ]/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractKeyWords(text: string): string[] {
  // Cuvinte cheie comune în afirmații
  const commonWords = [
    'bani', 'banii', 'abundenta', 'prosperitate', 'bogatii', 'recunoscator', 
    'natural', 'magnet', 'oportunitati', 'merit', 'vin', 'primesc', 
    'deschidere', 'energie', 'sanatate', 'vitalitate', 'iubire', 'relatii', 
    'autentic', 'incredere', 'succes', 'realizari', 'calm', 'liniste', 
    'echilibru', 'focus', 'concentrare', 'productiv', 'curge', 'liber',
    'investesc', 'viitorul', 'alegeri', 'intelepte'
  ];
  
  // Extrage cuvintele din text care sunt în lista de cuvinte cheie
  const words = text.split(' ');
  const keyWords = words.filter(word => 
    commonWords.includes(word) && word.length > 3
  );
  
  // Dacă nu găsim cuvinte cheie, folosim primele 2 cuvinte importante
  if (keyWords.length === 0) {
    const importantWords = words.filter(word => 
      word.length > 4 && 
      !['sunt', 'pentru', 'din', 'mea', 'meu', 'mei', 'mele', 'toate', 'care'].includes(word)
    );
    return importantWords.slice(0, 2);
  }
  
  return keyWords.slice(0, 2); // Maxim 2 cuvinte cheie pentru verificare strictă
}

function computePrefixMatchPercent(target: string, transcript: string): number {
  const t = normalize(target);
  const s = normalize(transcript);
  if (!t || !s) return 0;
  let i = 0;
  while (i < t.length && i < s.length && t[i] === s[i]) i++;
  return i / t.length;
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Alb perlat
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100, // Extra space for navigation bar
    // gap: 16, // Not supported in React Native Web
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  readingContainer: {
    backgroundColor: '#FFFFFF', // Alb pentru carduri
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#6ECEDA', // Turcoaz
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aff: {
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 12,
    textAlign: 'center',
    color: '#1E2A38', // Albastru intens
    fontWeight: '500',
  },
  reps: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  cta: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700',
  },
  sessionInfo: {
    backgroundColor: '#F5E8C7', // Bej pal
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD56B', // Auriu cald
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E2A38', // Albastru intens
    marginBottom: 8,
  },
  sessionSubtitle: {
    fontSize: 16,
    color: '#6ECEDA', // Turcoaz
    fontWeight: '500',
  },
  premiumBanner: {
    backgroundColor: '#C7B9FF', // Lavandă pală
    borderColor: '#A3C4A7', // Verde salvie
    borderWidth: 2,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumText: {
    color: '#1E2A38', // Albastru intens
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  premiumFeatures: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  premiumLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  premiumFeature: {
    fontSize: 14,
    color: '#047857',
    marginBottom: 20,
    lineHeight: 24,
  },
  upgradeButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  daySelector: {
    marginBottom: 20,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedDayButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  dayButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  sessionSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    // gap: 8, // Not supported in React Native Web
  },
  sessionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSessionButton: {
    borderColor: '#059669',
    borderWidth: 2,
  },
  sessionButtonText: {
    fontWeight: '600',
    color: '#374151',
  },
  lockedSessionButton: {
    opacity: 0.5,
    backgroundColor: '#F3F4F6',
  },
  completedSessionButton: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  lockedSessionButtonText: {
    color: '#9CA3AF',
  },
  completedSessionButtonText: {
    color: '#10B981',
    fontWeight: '700',
  },
  progressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  repsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  affirmationContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  affirmationText: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    color: '#1F2937',
  },
  controls: {
    marginBottom: 20,
  },
  repButton: {
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  repButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#FFD56B', // Auriu cald
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#1E2A38',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#1E2A38', // Albastru intens pentru text
    fontWeight: 'bold',
    fontSize: 16,
  },
  listeningContainer: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  listeningText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 16,
  },
  recognizedText: {
    color: '#10B981',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  completionContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  completionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
  },
  nextSessionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  successContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: '#047857',
    marginBottom: 12,
    textAlign: 'center',
  },
  nextStepText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  quoteContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quoteEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  reminderContainer: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#0EA5E9',
  },
  reminderText: {
    fontSize: 14,
    color: '#0C4A6E',
    marginBottom: 8,
    textAlign: 'center',
  },
  reminderButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  reminderButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  completedDayContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  completedDayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  completedDayText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 12,
  },
  nextDayText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  blockedTodayWarning: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  blockedTodayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  blockedTodayText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 20,
  },
  contextContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  contextText: {
    fontSize: 16,
    color: '#0C4A6E',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});