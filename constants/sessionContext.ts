export type SessionType = 'morning' | 'afternoon' | 'evening';

export const sessionContextMessages: Record<SessionType, string[]> = {
  morning: [
    "Respir adânc și simt energia zilei curgând prin mine.",
    "Îmi deschid inima la toate oportunitățile de azi.",
    "Sunt pregătit să primesc toate binecuvântările zilei.",
    "Energia mea este puternică și focalizată.",
    "Sunt deschis la toate posibilitățile care vin spre mine.",
    "Îmi permit să fiu vulnerabil și autentic.",
    "Sunt în pace cu toate aspectele vieții mele.",
    "Îmi iubesc și îmi accept toate părțile.",
    "Îmi permit să fiu fericit și împlinit.",
    "Sunt deschis la toate formele de abundență."
  ],
  afternoon: [
    "Sunt recunoscător pentru toate realizările de azi.",
    "Energia mea este echilibrată și puternică.",
    "Sunt deschis la toate oportunitățile care se prezintă.",
    "Îmi permit să fiu vulnerabil și autentic.",
    "Sunt în pace cu toate aspectele vieții mele.",
    "Îmi iubesc și îmi accept toate părțile.",
    "Sunt demn de toate binecuvântările.",
    "Îmi permit să fiu fericit și împlinit.",
    "Sunt deschis la toate formele de iubire.",
    "Îmi permit să fiu vulnerabil și autentic."
  ],
  evening: [
    "Mulțumesc pentru toate experiențele din ziua de azi.",
    "Sunt recunoscător pentru toate lecțiile învățate.",
    "Îmi permit să fiu vulnerabil și autentic.",
    "Sunt în pace cu toate aspectele vieții mele.",
    "Îmi iubesc și îmi accept toate părțile.",
    "Sunt demn de toate binecuvântările.",
    "Îmi permit să fiu fericit și împlinit.",
    "Sunt deschis la toate formele de iubire.",
    "Îmi permit să fiu vulnerabil și autentic.",
    "Sunt în pace cu toate aspectele vieții mele."
  ]
};

// Category-specific context messages
export const categoryContextMessages = {
  bani: {
    morning: [
      "Respir adânc și simt abundența curgând prin mine.",
      "Îmi deschid inima la toate oportunitățile financiare de azi.",
      "Sunt pregătit să primesc toate binecuvântările financiare.",
      "Energia prosperității este puternică în mine.",
      "Sunt deschis la toate sursele de abundență.",
      "Îmi permit să fiu vulnerabil și autentic cu banii.",
      "Sunt în pace cu toate aspectele financiare.",
      "Îmi iubesc și îmi accept abundența în toate formele.",
      "Îmi permit să fiu fericit și împlinit financiar.",
      "Sunt deschis la toate formele de prosperitate."
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
