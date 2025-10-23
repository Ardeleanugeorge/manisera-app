// 🌅 Paletă principală (energie + echilibru)
export const Colors = {
  // Culori principale
  primary: {
    // 🌕 Auriu cald - lumina, energia, abundența
    gold: '#FFD56B',
    // 🌙 Albastru intens de noapte - echilibru, profunzime, calm
    nightBlue: '#1E2A38',
    // 🌊 Turcoaz apă - claritate, liniște, fluiditate
    turquoise: '#6ECEDA',
    // 🌤️ Bej pal / nisipiu - neutralitate elegantă
    sand: '#F5E8C7',
    // ✨ Alb perlat - puritate, curățenie vizuală
    pearl: '#FAFAFA',
  },
  
  // Accente opționale
  accent: {
    // 🩵 Lavandă pală - calm mental, spiritualitate
    lavender: '#C7B9FF',
    // 🧡 Portocaliu soft - energie pozitivă blândă
    softOrange: '#FFB18A',
    // 🌿 Verde salvie - armonie și echilibru natural
    sage: '#A3C4A7',
  },
  
  // Culori pentru stări
  state: {
    success: '#A3C4A7', // Verde salvie pentru succes
    warning: '#FFB18A', // Portocaliu soft pentru atenționare
    error: '#FF6B6B', // Roșu pentru erori
    info: '#6ECEDA', // Turcoaz pentru informații
  },
  
  // Culori pentru text
  text: {
    primary: '#1E2A38', // Albastru intens pentru text principal
    secondary: '#6B7280', // Gri pentru text secundar
    light: '#FAFAFA', // Alb perlat pentru text pe fundal închis
    accent: '#FFD56B', // Auriu pentru text accentuat
  },
  
  // Culori pentru fundal
  background: {
    primary: '#FAFAFA', // Alb perlat pentru fundal principal
    secondary: '#F5E8C7', // Bej pal pentru fundal secundar
    card: '#FFFFFF', // Alb pentru carduri
    overlay: 'rgba(30, 42, 56, 0.8)', // Albastru intens cu transparență
  },
  
  // Culori pentru borduri
  border: {
    light: '#F5E8C7', // Bej pal pentru borduri ușoare
    medium: '#6ECEDA', // Turcoaz pentru borduri medii
    strong: '#1E2A38', // Albastru intens pentru borduri puternice
  }
};

// Gradient-uri pentru efecte speciale
export const Gradients = {
  sunrise: ['#FFD56B', '#FFB18A'], // Auriu la portocaliu
  ocean: ['#6ECEDA', '#1E2A38'], // Turcoaz la albastru intens
  calm: ['#C7B9FF', '#A3C4A7'], // Lavandă la verde salvie
  energy: ['#FFD56B', '#6ECEDA'], // Auriu la turcoaz
};

// Culori pentru teme
export const ThemeColors = {
  light: {
    background: Colors.background.primary,
    surface: Colors.background.card,
    text: Colors.text.primary,
    accent: Colors.primary.gold,
  },
  dark: {
    background: Colors.primary.nightBlue,
    surface: '#2A3A4A',
    text: Colors.text.light,
    accent: Colors.primary.gold,
  }
};