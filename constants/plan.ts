import { abundenta_600 } from './abundenta_600';
import { sanatate_600 } from './sanatate_600';
import { iubire_600 } from './iubire_600';
import { incredere_600 } from './incredere_600';
import { calm_600 } from './calm_600';
import { focus_600 } from './focus_600';

export type FocusCategory = 'bani' | 'sanatate' | 'iubire' | 'incredere' | 'calm' | 'focus';

export type DayPlan = {
  day: number;
  affirmations: string[];
  sessions: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
};

export function generateThirtyDayPlan(category: FocusCategory, userProfile?: any): DayPlan[] {
  // Afirmații cu variații subtile pentru fiecare sesiune - 600 per categorie
  const sessionVariations: Record<FocusCategory, {
    morning: string[];
    afternoon: string[];
    evening: string[];
  }> = {
    bani: abundenta_600,
    sanatate: sanatate_600,
    iubire: iubire_600,
    incredere: incredere_600,
    calm: calm_600,
    focus: focus_600,
  };

  const plan: DayPlan[] = [];
  
  // Create a unique seed based on user profile for personalization
  const userSeed = userProfile ? 
    `${userProfile.id || 'default'}_${userProfile.name || 'user'}_${category}` : 
    `${Date.now()}_${category}`;
  
  for (let d = 1; d <= 30; d++) {
    let block: 'activate' | 'deepen' | 'integrate';
    if (d <= 7) block = 'activate';
    else if (d <= 20) block = 'deepen';
    else block = 'integrate';

    const sessionData = sessionVariations[category];
    
    // Generate 3 sessions with 3 affirmations each using session-specific variations
    const getSessionAffirmations = (sessionType: 'morning' | 'afternoon' | 'evening') => {
      const sessionPhrases = sessionData[sessionType];
      const sessionAffirmations: string[] = [];
      
      // Create personalized seed for this day and session
      const daySeed = `${userSeed}_${d}_${sessionType}`;
      const seedNumber = hashString(daySeed);
      
      // Shuffle affirmations based on personalized seed
      const shuffledPhrases = shuffleArray([...sessionPhrases], seedNumber);
      
      // Select 3 unique affirmations for this session
      for (let i = 0; i < 3; i++) {
        sessionAffirmations.push(shuffledPhrases[i]);
      }
      return sessionAffirmations;
    };

    // Generate session-specific affirmations with variations
    const morning = getSessionAffirmations('morning');
    const afternoon = getSessionAffirmations('afternoon');
    const evening = getSessionAffirmations('evening');

    // Keep backward compatibility with old affirmations array
    const daily = [...morning, ...afternoon, ...evening];

    plan.push({ 
      day: d, 
      affirmations: daily,
      sessions: {
        morning,
        afternoon,
        evening
      }
    });
  }

  return plan;
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





