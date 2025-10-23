import React, { useState } from 'react';
import { StyleSheet, Pressable, ScrollView, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { updateUserPreferences, getUserProfile } from '@/utils/personalization';

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '' as 'masculin' | 'feminin' | 'altul' | '',
    focusArea: 'bani' as 'bani' | 'sanatate' | 'iubire' | 'incredere' | 'calm' | 'focus',
    intensity: 'moderate' as 'gentle' | 'moderate' | 'intense',
    style: 'classic' as 'classic' | 'modern' | 'spiritual',
    goals: [] as string[],
    experience: 'incepator' as 'incepator' | 'mediu' | 'avansat',
    motivation: '',
    timePreference: 'dimineata' as 'dimineata' | 'dupa-amiaza' | 'seara' | 'flexibil'
  });

  const focusAreas = [
    { id: 'bani', title: '💰 Abundență Financiară', description: 'Prosperitate și succes financiar' },
    { id: 'sanatate', title: '💪 Sănătate și Vitalitate', description: 'Energie și bunăstare fizică' },
    { id: 'iubire', title: '❤️ Iubire și Relații', description: 'Conexiuni profunde și autentice' },
    { id: 'incredere', title: '🎯 Încredere și Succes', description: 'Autoconfidență și realizări' },
    { id: 'calm', title: '🧘 Liniște și Echilibru', description: 'Pace interioară și armonie' },
    { id: 'focus', title: '⚡ Focus și Productivitate', description: 'Concentrare și eficiență' }
  ];

  const intensityLevels = [
    { id: 'gentle', title: '🌱 Blând', description: 'Afirmații delicate și încurajatoare' },
    { id: 'moderate', title: '⚡ Moderat', description: 'Echilibru între blândețe și putere' },
    { id: 'intense', title: '🔥 Intens', description: 'Afirmații puternice și transformatoare' }
  ];

  const styleOptions = [
    { id: 'classic', title: '📚 Clasic', description: 'Afirmații tradiționale și timpurii' },
    { id: 'modern', title: '✨ Modern', description: 'Limbaj contemporan și direct' },
    { id: 'spiritual', title: '🕊️ Spiritual', description: 'Conectare cu divinul și universul' }
  ];

  const genderOptions = [
    { id: 'masculin', title: 'Masculin' },
    { id: 'feminin', title: 'Feminin' },
    { id: 'altul', title: 'Altul' }
  ];

  const experienceLevels = [
    { id: 'incepator', title: '🌱 Începător', description: 'Prima dată când încerc afirmații' },
    { id: 'mediu', title: '⚡ Mediu', description: 'Am mai folosit afirmații ocazional' },
    { id: 'avansat', title: '🔥 Avansat', description: 'Practic afirmații regulat' }
  ];

  const timePreferences = [
    { id: 'dimineata', title: '🌅 Dimineața', description: 'Prima sesiune între 6-10' },
    { id: 'dupa-amiaza', title: '☀️ După-amiaza', description: 'Prima sesiune între 12-16' },
    { id: 'seara', title: '🌙 Seara', description: 'Prima sesiune între 18-22' },
    { id: 'flexibil', title: '🔄 Flexibil', description: 'Orice oră pentru prima sesiune' }
  ];

  const goalOptions = [
    'Îmi îmbunătățesc încrederea în mine',
    'Vreau să fiu mai productiv',
    'Doresc să-mi găsesc iubirea adevărată',
    'Vreau să-mi îmbunătățesc sănătatea',
    'Doresc să-mi dezvolt cariera',
    'Vreau să-mi găsesc liniștea interioară',
    'Doresc să-mi îmbunătățesc relațiile',
    'Vreau să-mi dezvolt creativitatea',
    'Vreau să-mi schimb mentalitatea',
    'Doresc să-mi găsesc scopul în viață',
    'Vreau să-mi îmbunătățesc concentrarea',
    'Doresc să-mi dezvolt abilitățile sociale'
  ];

  const handleNext = () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      updateUserPreferences({
        focusArea: formData.focusArea,
        intensity: formData.intensity,
        style: formData.style
      });
      
      // Store additional user data
      const userProfile = getUserProfile();
      const updatedProfile = {
        ...userProfile,
        name: formData.name,
        birthDate: formData.birthDate,
        gender: formData.gender,
        goals: formData.goals,
        experience: formData.experience,
        motivation: formData.motivation,
        timePreference: formData.timePreference
      };
      localStorage.setItem('manisera_user_profile', JSON.stringify(updatedProfile));
      
      router.replace('/(tabs)');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const isValidDate = (dateString: string) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1]);
    const month = parseInt(match[2]);
    const year = parseInt(match[3]);
    
    // Check if date is reasonable
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // Check if date actually exists
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Să ne cunoaștem</Text>
            <Text style={styles.stepDescription}>
              Cum te numești? Voi crea afirmații personalizate bazate pe informațiile tale.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Numele tău</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Scrie numele tău aici..."
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Când te-ai născut?</Text>
            <Text style={styles.stepDescription}>
              Vârsta te ajută să primești afirmații potrivite pentru etapa de viață în care te afli.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Data nașterii</Text>
              <TextInput
                style={styles.textInput}
                value={formData.birthDate}
                onChangeText={(text) => {
                  // Format input as DD/MM/YYYY
                  let formatted = text.replace(/\D/g, ''); // Remove non-digits
                  
                  if (formatted.length >= 2) {
                    formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
                  }
                  if (formatted.length >= 5) {
                    formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
                  }
                  
                  setFormData(prev => ({ ...prev, birthDate: formatted }));
                }}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
              />
              {formData.birthDate && formData.birthDate.length === 10 && (
                <Text style={styles.validationText}>
                  {isValidDate(formData.birthDate) ? '✓ Data validă' : '✗ Data invalidă'}
                </Text>
              )}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Câteva detalii despre tine</Text>
            <Text style={styles.stepDescription}>
              Aceste informații îmi ajută să îți creez afirmații mai relevante pentru tine.
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gen</Text>
              <View style={styles.optionsContainer}>
                {genderOptions.map((option) => (
                  <Pressable
                    key={option.id}
                    style={[
                      styles.optionCard,
                      formData.gender === option.id && styles.selectedOptionCard
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, gender: option.id as any }))}
                  >
                    <Text style={[
                      styles.optionTitle,
                      formData.gender === option.id && styles.selectedOptionTitle
                    ]}>
                      {option.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ce experiență ai cu afirmațiile?</Text>
            <Text style={styles.stepDescription}>
              Vreau să știu de unde începem, ca să îți dau conținutul potrivit.
            </Text>
            <View style={styles.optionsContainer}>
              {experienceLevels.map((level) => (
                <Pressable
                  key={level.id}
                  style={[
                    styles.optionCard,
                    formData.experience === level.id && styles.selectedOptionCard
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, experience: level.id as any }))}
                >
                  <Text style={[
                    styles.optionTitle,
                    formData.experience === level.id && styles.selectedOptionTitle
                  ]}>
                    {level.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    formData.experience === level.id && styles.selectedOptionDescription
                  ]}>
                    {level.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Când preferi să începi prima sesiune?</Text>
            <Text style={styles.stepDescription}>
              Cu Premium ai acces la toate cele 3 sesiuni pe zi. Când preferi să începi prima sesiune?
            </Text>
            <View style={styles.optionsContainer}>
              {timePreferences.map((pref) => (
                <Pressable
                  key={pref.id}
                  style={[
                    styles.optionCard,
                    formData.timePreference === pref.id && styles.selectedOptionCard
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, timePreference: pref.id as any }))}
                >
                  <Text style={[
                    styles.optionTitle,
                    formData.timePreference === pref.id && styles.selectedOptionTitle
                  ]}>
                    {pref.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    formData.timePreference === pref.id && styles.selectedOptionDescription
                  ]}>
                    {pref.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ce te motivează?</Text>
            <Text style={styles.stepDescription}>
              Spune-mi ce te determină să îți îmbunătățești viața. Voi folosi această informație pentru afirmații mai relevante.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Motivația ta</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={formData.motivation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, motivation: text }))}
                placeholder="De exemplu: Vreau să devin cea mai bună versiune a mea..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ce vrei să îți îmbunătățești?</Text>
            <Text style={styles.stepDescription}>
              Alege toate domeniile care te interesează. Pentru fiecare voi crea afirmații specifice.
            </Text>
            <View style={styles.goalsContainer}>
              {goalOptions.map((goal, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.goalOption,
                    formData.goals.includes(goal) && styles.selectedGoalOption
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text style={[
                    styles.goalText,
                    formData.goals.includes(goal) && styles.selectedGoalText
                  ]}>
                    {goal}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ce vrei să îmbunătățești?</Text>
            <Text style={styles.stepDescription}>
              Alege domeniul principal pe care vrei să te concentrezi.
            </Text>
            <View style={styles.optionsContainer}>
              {focusAreas.map((area) => (
                <Pressable
                  key={area.id}
                  style={[
                    styles.optionCard,
                    formData.focusArea === area.id && styles.selectedOptionCard
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, focusArea: area.id as any }))}
                >
                  <Text style={[
                    styles.optionTitle,
                    formData.focusArea === area.id && styles.selectedOptionTitle
                  ]}>
                    {area.title}
                  </Text>
                  <Text style={[
                    styles.optionDescription,
                    formData.focusArea === area.id && styles.selectedOptionDescription
                  ]}>
                    {area.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manisera</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 8) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>Pasul {step} din 8</Text>
      </View>

      {renderStep()}

      <View style={styles.navigation}>
        {step > 1 && (
          <Pressable style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>Înapoi</Text>
          </Pressable>
        )}
        
        <Pressable 
          style={[
            styles.nextButton,
            (!formData.name || (step === 7 && formData.goals.length === 0)) && styles.disabledButton
          ]} 
          onPress={handleNext}
          disabled={!formData.name || (step === 7 && formData.goals.length === 0)}
        >
          <Text style={styles.nextButtonText}>
            {step === 8 ? 'Finalizează' : 'Continuă'}
          </Text>
        </Pressable>
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
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
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
  optionsContainer: {
    // gap: 12, // Not supported in React Native Web
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  selectedOptionCard: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  selectedOptionTitle: {
    color: '#059669',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedOptionDescription: {
    color: '#047857',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  goalsContainer: {
    // gap: 8, // Not supported in React Native Web
  },
  goalOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  selectedGoalOption: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  goalText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedGoalText: {
    color: '#059669',
    fontWeight: '600',
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
