import React, { useState, useMemo, useEffect, useRef } from 'react';
import { StyleSheet, Pressable, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { generateThirtyDayPlan } from '@/constants/plan';
import { usePremium } from '@/contexts/PremiumContext';
import PremiumModal from '@/components/PremiumModal';
import { getUserProfile } from '@/utils/personalization';
import { getSessionContextMessage } from '@/constants/sessionContext';
import { getItemSync, setItemSync } from '@/utils/storage';

type SessionType = 'morning' | 'afternoon' | 'evening';

export default function SessionsScreen() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSession, setSelectedSession] = useState<SessionType>('morning');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [reps, setReps] = useState(0);
  const targetReps = 3;
  
  // Speech recognition
  const [listening, setListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const recognitionRef = useRef<any>(null);
  const listeningRef = useRef(false);
  const repLockRef = useRef(false);
  
  const userProfile = getUserProfile();
  const plan = useMemo(() => generateThirtyDayPlan(userProfile.preferences?.focusArea || 'bani', userProfile), [userProfile]);
  
  // Check which days are completed for premium users
  const completedDays = JSON.parse(getItemSync('manisera_completed_days') || '[]');
  const lastCompletedDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
  
  // Check if user can access this day (only one day per day for premium users too)
  const currentDate = new Date();
  const todayString = currentDate.toDateString();
  const lastAccessDate = getItemSync('manisera_last_access_date');
  const lastCompletedDayDate = getItemSync('manisera_last_completed_day_date');
  
  // If it's a new day, reset access
  if (lastAccessDate !== todayString) {
    setItemSync('manisera_last_access_date', todayString);
    setItemSync('manisera_last_completed_day_date', '');
  }
  
  // Check if user already completed a day today
  const hasCompletedToday = lastCompletedDayDate === todayString;
  const isDayBlockedToday = hasCompletedToday && selectedDay > lastCompletedDay;
  
  // If user tries to access a day that's blocked today, redirect to the allowed day
  const finalSelectedDay = isDayBlockedToday ? lastCompletedDay : selectedDay;
  
  // Show warning if user tries to access a locked day
  const isDayLocked = finalSelectedDay > lastCompletedDay + 1;
  
  // Only allow access to the next day or completed days
  const allowedDay = isDayLocked ? lastCompletedDay + 1 : finalSelectedDay;
  const dayPlan = plan.find(p => p.day === allowedDay)!;
  const sessionAffirmations = dayPlan.sessions[selectedSession];
  
  // Check if previous sessions are completed
  const getCompletedSessions = () => {
    const completed = getItemSync(`manisera_completed_sessions_${allowedDay}`) || '{}';
    return JSON.parse(completed);
  };
  
  const isSessionLocked = (session: SessionType) => {
    const completedSessions = getCompletedSessions();
    const sessionOrder = ['morning', 'afternoon', 'evening'];
    const currentIndex = sessionOrder.indexOf(session);
    
    console.log(`🔍 Checking session ${session}:`, {
      currentIndex,
      completedSessions,
      sessionOrder,
      selectedDay
    });
    
    if (currentIndex === 0) {
      console.log(`✅ Morning is always available`);
      return false; // Morning is always available
    }
    
    // Check if previous session is completed
    const previousSession = sessionOrder[currentIndex - 1];
    const isPreviousCompleted = completedSessions[previousSession] === true;
    
    console.log(`🔍 Session ${session}: previous=${previousSession}, completed=${isPreviousCompleted}`);
    console.log(`🔍 All completed sessions for day ${selectedDay}:`, completedSessions);
    
    // Force lock if previous session is not completed
    if (!isPreviousCompleted) {
      console.log(`🔒 LOCKING ${session} because ${previousSession} is not completed`);
      return true;
    }
    
    console.log(`✅ UNLOCKING ${session} because ${previousSession} is completed`);
    return false;
  };

  const isSessionCompleted = (session: SessionType) => {
    const completedSessions = getCompletedSessions();
    return completedSessions[session] === true;
  };
  const currentAffirmationText = sessionAffirmations[currentAffirmation];
  
  const { isPremium, setShowUpgradeModal } = usePremium();

  const handleRepComplete = () => {
    // Stop listening and reset state
    setListening(false);
    listeningRef.current = false;
    setRecognizedText('');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    if (currentAffirmation < sessionAffirmations.length - 1) {
      // Move to next affirmation
      setCurrentAffirmation(prev => prev + 1);
      setReps(0);
      // Reset listening state for next affirmation
      setListening(false);
      listeningRef.current = false;
      setRecognizedText('');
    } else {
      // Session completed - mark as completed
      console.log(`🎯 Marking session ${selectedSession} as completed!`);
      console.log(`🎯 Current affirmation: ${currentAffirmation}, Total affirmations: ${sessionAffirmations.length}`);
      const completedSessions = getCompletedSessions();
      completedSessions[selectedSession] = true;
      setItemSync(`manisera_completed_sessions_${allowedDay}`, JSON.stringify(completedSessions));
      
      console.log(`🎉 Session ${selectedSession} completed! Updated storage:`, completedSessions);
      console.log(`🎉 New storage value:`, getItemSync(`manisera_completed_sessions_${selectedDay}`));
      
      // Check if all sessions are completed for this day
      const allSessionsCompleted = completedSessions.morning && completedSessions.afternoon && completedSessions.evening;
      
      if (allSessionsCompleted) {
        // Mark the entire day as completed
        const completedDays = JSON.parse(getItemSync('manisera_completed_days') || '[]');
        if (!completedDays.includes(allowedDay)) {
          completedDays.push(allowedDay);
          setItemSync('manisera_completed_days', JSON.stringify(completedDays));
          
          // Mark that user completed a day today
          setItemSync('manisera_last_completed_day_date', todayString);
          
          console.log('Day', allowedDay, 'marked as completed');
          
          // Force page reload to update day status
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
      
      setCurrentAffirmation(0);
      setReps(0);
    }
  };

  // Detect Safari iPhone
  const isSafariiPhone = /iPhone|iPad|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);

  // Speech recognition functions
  const startListening = () => {
    if (listeningRef.current) return;
    
    // Don't start listening if session is already completed
    if (isSessionCompleted(selectedSession)) {
      console.log('Session already completed, not starting listening');
      return;
    }
    
    // Request microphone permission first (iOS Safari requirement)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted');
          startRecognition();
        })
        .catch((err) => {
          console.error('Microphone permission denied:', err);
          alert('Microfonul este necesar pentru a funcționa. Te rugăm să permiți accesul la microfon.');
        });
    } else {
      startRecognition();
    }
  };

  const startRecognition = () => {
    if (listeningRef.current) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.log('Speech recognition not supported');
      return;
    }

    const instance = new SpeechRecognition();
    
    // Configure differently for Safari iPhone
    if (isSafariiPhone) {
      instance.continuous = false;
      instance.interimResults = false;
      instance.lang = 'ro-RO';
      instance.maxAlternatives = 1;
    } else {
      instance.continuous = true;
      instance.interimResults = true;
      instance.lang = 'ro-RO';
    }

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

          // Check if the spoken text matches the affirmation
          const affirmationWords = currentAffirmationText.toLowerCase().split(' ');
          const spokenWords = finalText.split(' ');
          
          const matchedWords = affirmationWords.filter(word => 
            spokenWords.some(spoken => spoken.includes(word) || word.includes(spoken))
          );
          
          if (matchedWords.length >= 2) {
            console.log('🎯 MATCH FOUND! Incrementing reps');
            repLockRef.current = true;
            setReps(prev => {
              const next = Math.min(targetReps, prev + 1);
              
              // If we completed all reps for current affirmation
              if (next >= targetReps) {
                // Move to next affirmation or complete session
                if (currentAffirmation < sessionAffirmations.length - 1) {
                  // Move to next affirmation
                  setTimeout(() => {
                    setCurrentAffirmation(prev => prev + 1);
                    setReps(0);
                    repLockRef.current = false;
                    setListening(false);
                    listeningRef.current = false;
                    setRecognizedText('');
                  }, 1000);
                } else {
                  // Session completed - mark as completed
                  console.log(`🎯 Marking session ${selectedSession} as completed!`);
                  console.log(`🎯 Current session: ${selectedSession}, Day: ${selectedDay}`);
                  const completedSessions = getCompletedSessions();
                  console.log(`🎯 Before update - completedSessions:`, completedSessions);
                  completedSessions[selectedSession] = true;
                  setItemSync(`manisera_completed_sessions_${allowedDay}`, JSON.stringify(completedSessions));
                  
                  console.log(`🎉 Session ${selectedSession} completed! Updated storage:`, completedSessions);
                  console.log(`🎉 storage key: manisera_completed_sessions_${allowedDay}`);
                  console.log(`🎉 storage value:`, getItemSync(`manisera_completed_sessions_${allowedDay}`));
                  
                  // Check if all sessions are completed for this day
                  const allSessionsCompleted = completedSessions.morning && completedSessions.afternoon && completedSessions.evening;
                  
                  if (allSessionsCompleted) {
                    // Mark the entire day as completed
                    const completedDays = JSON.parse(getItemSync('manisera_completed_days') || '[]');
                    if (!completedDays.includes(allowedDay)) {
                      completedDays.push(allowedDay);
                      setItemSync('manisera_completed_days', JSON.stringify(completedDays));
                      
                      // Mark that user completed a day today
                      setItemSync('manisera_last_completed_day_date', todayString);
                      
                      console.log('Day', allowedDay, 'marked as completed');
                      
                      // Force page reload to update day status
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    }
                  }
                  
                  setTimeout(() => {
                    setCurrentAffirmation(0);
                    setReps(0);
                    repLockRef.current = false;
                    setListening(false);
                    listeningRef.current = false;
                    setRecognizedText('');
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
      setListening(false);
      listeningRef.current = false;
      
      // Handle specific errors for Safari iPhone
      if (e.error === 'no-speech' && isSafariiPhone) {
        console.log('Safari iPhone: No speech detected, trying again...');
        setTimeout(() => {
          if (!listeningRef.current && !isSessionCompleted(selectedSession)) {
            startListening();
          }
        }, 1000);
      } else if (e.error === 'not-allowed') {
        alert('Microfonul a fost blocat. Te rugăm să permiți accesul la microfon în setările browserului.');
      }
    };

    instance.onend = () => {
      console.log('Speech recognition ended');
      setListening(false);
      listeningRef.current = false;
      
      // Auto-restart for Safari iPhone if session not completed
      if (isSafariiPhone && reps < targetReps && !repLockRef.current && !isSessionCompleted(selectedSession)) {
        console.log('Safari iPhone: Auto-restarting after onend');
        setTimeout(() => {
          if (!listeningRef.current && reps < targetReps && !repLockRef.current) {
            startListening();
          }
        }, 1000);
      }
    };

    recognitionRef.current = instance;
    
    // Small delay before starting for Safari iPhone
    if (isSafariiPhone) {
      setTimeout(() => {
        try {
          instance.start();
        } catch (err) {
          console.error('Error starting recognition:', err);
          setTimeout(() => {
            if (!listeningRef.current) {
              startListening();
            }
          }, 2000);
        }
      }, 100);
    } else {
      instance.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
      listeningRef.current = false;
    }
  };

  const getSessionTitle = (session: SessionType) => {
    switch (session) {
      case 'morning': return '🌅 Dimineața';
      case 'afternoon': return '☀️ După-amiaza';
      case 'evening': return '🌙 Seara';
    }
  };

  const getSessionColor = (session: SessionType) => {
    switch (session) {
      case 'morning': return '#FEF3C7';
      case 'afternoon': return '#F3E8FF';
      case 'evening': return '#E0F2FE';
    }
  };

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sesiuni Premium</Text>
        <View style={styles.premiumRequired}>
          <Text style={styles.premiumTitle}>🚀 Funcționalitate Premium</Text>
          <Text style={styles.premiumDescription}>
            Accesează 3 sesiuni pe zi cu afirmații personalizate pentru fiecare moment al zilei.
          </Text>
          <Pressable 
            style={styles.upgradeButton}
            onPress={() => setShowUpgradeModal(true)}
          >
            <Text style={styles.upgradeButtonText}>Upgrade la Premium</Text>
          </Pressable>
        </View>
        <PremiumModal />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sesiuni - Ziua {selectedDay}</Text>
      
      {/* Day access warnings */}
      {isDayLocked && (
        <View style={styles.lockedDayWarning}>
          <Text style={styles.lockedDayTitle}>🔒 Ziua blocată</Text>
          <Text style={styles.lockedDayText}>
            Trebuie să completezi ziua {lastCompletedDay + 1} înainte să accesezi ziua {selectedDay}.
          </Text>
        </View>
      )}
      
      {isDayBlockedToday && (
        <View style={styles.blockedTodayWarning}>
          <Text style={styles.blockedTodayTitle}>⏰ O zi pe zi</Text>
          <Text style={styles.blockedTodayText}>
            Ai completat deja o zi astăzi. Revino mâine pentru următoarea zi!
          </Text>
        </View>
      )}
      
      {/* Day selector */}
      <View style={styles.daySelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
            <Pressable
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.selectedDayButton
              ]}
              onPress={() => {
                setSelectedDay(day);
                setCurrentAffirmation(0);
                setReps(0);
              }}
            >
              <Text style={[
                styles.dayButtonText,
                selectedDay === day && styles.selectedDayButtonText
              ]}>
                {day}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>


      {/* Session selector */}
      <View style={styles.sessionSelector}>
        {(['morning', 'afternoon', 'evening'] as SessionType[]).map(session => {
          const isLocked = isSessionLocked(session);
          const completedSessions = getCompletedSessions();
          const isCompleted = completedSessions[session];
          
          console.log(`🎯 Session ${session}: isLocked=${isLocked}, isCompleted=${isCompleted}`);
          console.log(`🎯 CompletedSessions for ${session}:`, completedSessions[session]);
          
          return (
            <Pressable
              key={session}
              style={[
                styles.sessionButton,
                { backgroundColor: getSessionColor(session) },
                selectedSession === session && styles.selectedSessionButton,
                isLocked && styles.lockedSessionButton,
                isCompleted && styles.completedSessionButton
              ]}
              onPress={() => {
                if (!isLocked) {
                  setSelectedSession(session);
                  setCurrentAffirmation(0);
                  setReps(0);
                  setListening(false);
                  listeningRef.current = false;
                  setRecognizedText('');
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                }
              }}
              disabled={isLocked}
            >
              <Text style={[
                styles.sessionButtonText,
                isLocked && styles.lockedSessionButtonText,
                isCompleted && styles.completedSessionButtonText
              ]}>
                {isLocked ? '🔒 ' : isCompleted ? '✅ ' : ''}{getSessionTitle(session)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Session context message */}
      <View style={styles.contextContainer}>
        <Text style={styles.contextText}>
          {getSessionContextMessage(selectedSession, selectedDay, userProfile.preferences?.focusArea)}
        </Text>
      </View>

      {/* Check if session is completed */}
      {isSessionCompleted(selectedSession) ? (
        <View style={styles.completedSessionContainer}>
          <Text style={styles.completedSessionTitle}>✅ Sesiunea completată!</Text>
          <Text style={styles.completedSessionText}>
            Ai completat cu succes sesiunea {getSessionTitle(selectedSession)} pentru ziua {selectedDay}.
          </Text>
          <Text style={styles.nextSessionText}>
            {selectedSession === 'morning' && 'Treci la sesiunea de după-amiaza!'}
            {selectedSession === 'afternoon' && 'Treci la sesiunea de seară!'}
            {selectedSession === 'evening' && 'Felicitări! Ai completat toate sesiunile pentru azi!'}
          </Text>
        </View>
      ) : (
        <>
          {/* Current session progress */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Afirmația {Math.min(currentAffirmation + 1, sessionAffirmations.length)} din {sessionAffirmations.length}
            </Text>
            <Text style={styles.repsText}>
              {reps} / {targetReps} repetări
            </Text>
          </View>

          {/* Current affirmation */}
          <View style={styles.affirmationContainer}>
            <Text style={styles.affirmationText}>{currentAffirmationText}</Text>
          </View>
        </>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {!listening && reps < targetReps ? (
          <Pressable 
            style={styles.startButton}
            onPress={startListening}
          >
            <Text style={styles.startButtonText}>START</Text>
          </Pressable>
        ) : listening ? (
          <View style={styles.listeningContainer}>
            <Text style={styles.listeningText}>🎤 Ascultă...</Text>
            {recognizedText && (
              <Text style={styles.recognizedText}>{recognizedText}</Text>
            )}
          </View>
        ) : null}
        
      {reps >= targetReps && currentAffirmation < sessionAffirmations.length - 1 && (
        <Pressable
          style={styles.nextAffirmationButton}
          onPress={() => {
            setCurrentAffirmation(prev => prev + 1);
            setReps(0);
            setListening(false);
            listeningRef.current = false;
            setRecognizedText('');
          }}
        >
          <Text style={styles.nextAffirmationButtonText}>
            Următoarea afirmație →
          </Text>
        </Pressable>
      )}
      </View>

      {/* Session completion */}
      {currentAffirmation === sessionAffirmations.length - 1 && reps >= targetReps && (
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>
            🎉 Sesiunea {getSessionTitle(selectedSession)} completă!
          </Text>
          <Text style={styles.nextSessionText}>
            {selectedSession === 'morning' && 'Treci la sesiunea de după-amiaza!'}
            {selectedSession === 'afternoon' && 'Treci la sesiunea de seară!'}
            {selectedSession === 'evening' && 'Felicitări! Ai completat toate sesiunile pentru azi!'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  premiumRequired: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 12,
  },
  premiumDescription: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
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
    backgroundColor: '#059669',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listeningContainer: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
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
  repsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  nextAffirmationButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  nextAffirmationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
  lockedDayWarning: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  lockedDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
  },
  lockedDayText: {
    fontSize: 14,
    color: '#DC2626',
    textAlign: 'center',
    lineHeight: 20,
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
  completedSessionContainer: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
  },
  completedSessionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 8,
  },
  completedSessionText: {
    fontSize: 16,
    color: '#047857',
    textAlign: 'center',
    marginBottom: 12,
  },
  nextSessionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
