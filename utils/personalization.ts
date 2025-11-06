// Personalization utilities for unique user experiences

import { getItemSync, setItemSync } from './storage';

export interface UserProfile {
  id: string;
  name?: string;
  preferences?: {
    focusArea: 'bani' | 'sanatate' | 'iubire' | 'incredere' | 'calm' | 'focus';
    intensity: 'gentle' | 'moderate' | 'intense';
    style: 'classic' | 'modern' | 'spiritual';
  };
}

// Generate unique user ID based on device and time
export function generateUserId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const deviceInfo = typeof navigator !== 'undefined' ? 
    (navigator.userAgent || 'web').substring(0, 10) : 'mobile';
  
  return `user_${timestamp}_${random}_${deviceInfo}`;
}

// Get or create user profile
export function getUserProfile(): UserProfile {
  const stored = getItemSync('manisera_user_profile');
  if (stored) {
    return JSON.parse(stored);
  }
  
  const newProfile: UserProfile = {
    id: generateUserId(),
    preferences: {
      focusArea: 'bani',
      intensity: 'moderate',
      style: 'classic'
    }
  };
  
  setItemSync('manisera_user_profile', JSON.stringify(newProfile));
  return newProfile;
}

// Update user preferences
export function updateUserPreferences(preferences: Partial<UserProfile['preferences']>) {
  const profile = getUserProfile();
  profile.preferences = { ...profile.preferences, ...preferences };
  setItemSync('manisera_user_profile', JSON.stringify(profile));
  return profile;
}

// Generate personalized affirmations based on user and date
export function generatePersonalizedAffirmations(
  baseAffirmations: string[],
  userProfile: UserProfile,
  day: number,
  session: 'morning' | 'afternoon' | 'evening'
): string[] {
  // Create a seed based on user ID, day, and session
  const seed = `${userProfile.id}_${day}_${session}`;
  const seedNumber = hashString(seed);
  
  // Shuffle affirmations based on seed
  const shuffled = shuffleArray([...baseAffirmations], seedNumber);
  
  // Take first 3 for the session
  return shuffled.slice(0, 3);
}

// Hash function to convert string to number
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Shuffle array with seed for consistent randomization
function shuffleArray<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomIndex: number;
  
  // Use seed for pseudo-random generation
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  while (currentIndex !== 0) {
    randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  
  return shuffled;
}

// Generate AI-inspired personalized affirmations
export function generateAIPersonalizedAffirmations(
  userProfile: UserProfile,
  day: number,
  session: 'morning' | 'afternoon' | 'evening'
): string[] {
  const focusArea = userProfile.preferences?.focusArea || 'bani';
  const intensity = userProfile.preferences?.intensity || 'moderate';
  const style = userProfile.preferences?.style || 'classic';
  
  // Base templates for different combinations
  const templates = {
    bani: {
      gentle: [
        "Abundența vine natural în viața mea.",
        "Sunt recunoscător pentru toate bogățiile din viața mea.",
        "Prosperitatea este starea mea naturală."
      ],
      moderate: [
        "Banii vin spre mine cu ușurință și abundență.",
        "Sunt un magnet pentru oportunități financiare.",
        "Investesc în viitorul meu cu înțelepciune."
      ],
      intense: [
        "Sunt un magnet puternic pentru abundență și prosperitate.",
        "Banii curg liber și constant în viața mea.",
        "Sunt lider în domeniul meu și merit toate recompensele."
      ]
    },
    sanatate: {
      gentle: [
        "Corpul meu este plin de energie și vitalitate.",
        "Sănătatea mea se îmbunătățește în fiecare zi.",
        "Sunt în armonie cu ritmurile naturale ale corpului."
      ],
      moderate: [
        "Fiecare celulă din corpul meu vibrează cu sănătate.",
        "Sistemul meu imunitar este puternic și activ.",
        "Energia curge liber prin tot corpul meu."
      ],
      intense: [
        "Sunt un exemplu viu de sănătate și vitalitate.",
        "Corpul meu se vindecă și se regenerează constant.",
        "Sunt în perfectă armonie cu toate sistemele corpului meu."
      ]
    },
    iubire: {
      gentle: [
        "Iubirea curge liber prin inima mea.",
        "Sunt deschis la conexiuni profunde și autentice.",
        "Relațiile mele sunt pline de respect și înțelegere."
      ],
      moderate: [
        "Sunt demn de iubire autentică și reciprocă.",
        "Dau și primesc iubire cu ușurință și naturalitate.",
        "Relațiile mele cresc în armonie și înțelegere."
      ],
      intense: [
        "Sunt un magnet pentru iubire profundă și autentică.",
        "Iubirea mea se reflectă în toate interacțiunile mele.",
        "Sunt atractiv pentru oamenii potriviți și merituoși."
      ]
    },
    incredere: {
      gentle: [
        "Încrederea mea crește în fiecare zi.",
        "Sunt sigur în abilitățile și talentele mele.",
        "Merit succesul și recunoașterea."
      ],
      moderate: [
        "Îmi susțin deciziile cu forță și claritate.",
        "Am încredere în pașii mei și în direcția pe care o urmez.",
        "Sunt lider în domeniul meu de expertiză."
      ],
      intense: [
        "Sunt un exemplu viu de încredere și autoritate.",
        "Încrederea mea inspiră și influențează pe alții.",
        "Sunt sigur în toate deciziile și acțiunile mele."
      ]
    },
    calm: {
      gentle: [
        "Liniștea este starea mea naturală.",
        "Sunt centrat și echilibrat în toate momentele.",
        "Respir calm și profund în orice situație."
      ],
      moderate: [
        "Sunt prezent și mintea mea este liniștită.",
        "Eliberez tensiunea cu fiecare expirație.",
        "Aleg pacea în fiecare clipă a zilei."
      ],
      intense: [
        "Sunt un exemplu viu de liniște și echilibru.",
        "Liniștea mea se răspândește și influențează pe alții.",
        "Sunt în perfect control al emoțiilor și gândurilor mele."
      ]
    },
    focus: {
      gentle: [
        "Concentrarea mea este puternică și susținută.",
        "Sunt productiv și eficient în toate activitățile.",
        "Obiectivele mele sunt clare și realizabile."
      ],
      moderate: [
        "Aleg ce e important acum și mă concentrez pe asta.",
        "Finalizez o acțiune înainte de alta cu eficiență.",
        "Progresul meu este constant și vizibil."
      ],
      intense: [
        "Sunt un exemplu viu de concentrare și disciplină.",
        "Distracțiile nu mă afectează concentrarea și focusul.",
        "Sunt un maestru al concentrării și al realizărilor."
      ]
    }
  };
  
  const baseAffirmations = templates[focusArea][intensity];
  
  // Add style variations
  const styleVariations = {
    classic: (aff: string) => aff,
    modern: (aff: string) => aff.replace(/Sunt/g, 'Eu sunt').replace(/Merit/g, 'Eu merit'),
    spiritual: (aff: string) => aff.replace(/Sunt/g, 'Divinul din mine este').replace(/Merit/g, 'Universul îmi oferă')
  };
  
  const personalizedAffirmations = baseAffirmations.map(aff => styleVariations[style](aff));
  
  // Generate unique selection based on user, day, and session
  return generatePersonalizedAffirmations(personalizedAffirmations, userProfile, day, session);
}



