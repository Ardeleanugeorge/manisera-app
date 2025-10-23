export type SessionType = 'morning' | 'afternoon' | 'evening';

export const sessionContextMessages: Record<SessionType, string[]> = {
  morning: [
    "Începe ziua cu intenție clară și energie pozitivă.",
    "Deschide-te la toate oportunitățile de azi.",
    "Pregătește-te să primești toate binecuvântările zilei.",
    "Focalizează-te pe obiectivele tale importante.",
    "Deschide-te la toate posibilitățile care vin spre tine.",
    "Permite-ți să fii vulnerabil și autentic.",
    "Fii în pace cu toate aspectele vieții tale.",
    "Iubește-te și acceptă toate părțile tale.",
    "Permite-ți să fii fericit și împlinit.",
    "Deschide-te la toate formele de abundență."
  ],
  afternoon: [
    "Fii recunoscător pentru toate realizările de azi.",
    "Menține energia echilibrată și puternică.",
    "Deschide-te la toate oportunitățile care se prezintă.",
    "Permite-ți să fii vulnerabil și autentic.",
    "Fii în pace cu toate aspectele vieții tale.",
    "Iubește-te și acceptă toate părțile tale.",
    "Merită toate binecuvântările.",
    "Permite-ți să fii fericit și împlinit.",
    "Deschide-te la toate formele de iubire.",
    "Permite-ți să fii vulnerabil și autentic."
  ],
  evening: [
    "Mulțumește pentru toate experiențele din ziua de azi.",
    "Fii recunoscător pentru toate lecțiile învățate.",
    "Permite-ți să fii vulnerabil și autentic.",
    "Fii în pace cu toate aspectele vieții tale.",
    "Iubește-te și acceptă toate părțile tale.",
    "Merită toate binecuvântările.",
    "Permite-ți să fii fericit și împlinit.",
    "Deschide-te la toate formele de iubire.",
    "Permite-ți să fii vulnerabil și autentic.",
    "Fii în pace cu toate aspectele vieții tale."
  ]
};

// Category-specific context messages
export const categoryContextMessages = {
  bani: {
    morning: [
      "Începe ziua cu intenție clară pentru abundență financiară.",
      "Deschide-te la toate oportunitățile financiare de azi.",
      "Pregătește-te să primești toate binecuvântările financiare.",
      "Focalizează-te pe energia prosperității din tine.",
      "Deschide-te la toate sursele de abundență.",
      "Permite-ți să fii vulnerabil și autentic cu banii.",
      "Fii în pace cu toate aspectele financiare.",
      "Iubește-te și acceptă abundența în toate formele.",
      "Permite-ți să fii fericit și împlinit financiar.",
      "Deschide-te la toate formele de prosperitate."
    ],
    afternoon: [
      "Sunt recunoscător pentru toate oportunitățile financiare de azi.",
      "Energia prosperității este echilibrată și puternică.",
      "Sunt deschis la toate oportunitățile care se prezintă.",
      "Îmi permit să fiu vulnerabil și autentic cu abundența.",
      "Sunt în pace cu toate aspectele financiare.",
      "Îmi iubesc și îmi accept toate formele de prosperitate.",
      "Sunt demn de toate binecuvântările financiare.",
      "Îmi permit să fiu fericit și împlinit cu banii.",
      "Sunt deschis la toate formele de abundență.",
      "Îmi permit să fiu vulnerabil și autentic cu prosperitatea."
    ],
    evening: [
      "Mulțumesc pentru toate oportunitățile financiare din ziua de azi.",
      "Sunt recunoscător pentru toate lecțiile despre abundență.",
      "Îmi permit să fiu vulnerabil și autentic cu prosperitatea.",
      "Sunt în pace cu toate aspectele financiare.",
      "Îmi iubesc și îmi accept abundența în toate formele.",
      "Sunt demn de toate binecuvântările financiare.",
      "Îmi permit să fiu fericit și împlinit cu banii.",
      "Sunt deschis la toate formele de prosperitate.",
      "Îmi permit să fiu vulnerabil și autentic cu abundența.",
      "Sunt în pace cu toate aspectele prosperității."
    ]
  }
};

export function getSessionContextMessage(sessionType: SessionType, day: number, focusArea?: string): string {
  // Get category-specific messages if available
  if (focusArea && categoryContextMessages[focusArea as keyof typeof categoryContextMessages]) {
    const categoryMessages = categoryContextMessages[focusArea as keyof typeof categoryContextMessages];
    const messages = categoryMessages[sessionType];
    const messageIndex = (day - 1) % messages.length;
    return messages[messageIndex];
  }
  
  // Fallback to generic messages
  const messages = sessionContextMessages[sessionType];
  const messageIndex = (day - 1) % messages.length;
  return messages[messageIndex];
}
