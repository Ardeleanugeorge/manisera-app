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
      
      // Select 3 unique affirmations for this session
      for (let i = 0; i < 3; i++) {
        const phraseIndex = (d - 1 + i) % sessionPhrases.length;
        sessionAffirmations.push(sessionPhrases[phraseIndex]);
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





