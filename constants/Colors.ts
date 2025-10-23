// 🌅 Paletă principală (energie + echilibru)
const tintColorLight = '#FFD56B'; // Auriu cald
const tintColorDark = '#1E2A38'; // Albastru intens de noapte

export const Colors = {
  light: {
    text: '#1E2A38', // Albastru intens
    background: '#FAFAFA', // Alb perlat
    tint: tintColorLight,
    icon: '#1E2A38', // Albastru intens
    tabIconDefault: '#6ECEDA', // Turcoaz apă
    tabIconSelected: tintColorLight,
    primary: '#FFD56B', // Auriu cald
    secondary: '#6ECEDA', // Turcoaz apă
    tertiary: '#A3C4A7', // Verde salvie
    neutral: '#F5E8C7', // Bej pal
    accentLavender: '#C7B9FF', // Lavandă pală
    accentOrange: '#FFB18A', // Portocaliu soft
    error: '#DC2626', // Roșu pentru erori
    success: '#10B981', // Verde pentru succes
  },
  dark: {
    text: '#FAFAFA', // Alb perlat
    background: '#1E2A38', // Albastru intens de noapte
    tint: tintColorDark,
    icon: '#FAFAFA', // Alb perlat
    tabIconDefault: '#6ECEDA', // Turcoaz apă
    tabIconSelected: tintColorDark,
    primary: '#FFD56B', // Auriu cald
    secondary: '#6ECEDA', // Turcoaz apă
    tertiary: '#A3C4A7', // Verde salvie
    neutral: '#F5E8C7', // Bej pal
    accentLavender: '#C7B9FF', // Lavandă pală
    accentOrange: '#FFB18A', // Portocaliu soft
    error: '#EF4444', // Roșu pentru erori
    success: '#34D399', // Verde pentru succes
  },
};

// Gradient-uri pentru efecte speciale
export const Gradients = {
  sunrise: ['#FFD56B', '#FFB18A'], // Auriu la portocaliu
  ocean: ['#6ECEDA', '#1E2A38'], // Turcoaz la albastru intens
  calm: ['#C7B9FF', '#A3C4A7'], // Lavandă la verde salvie
  energy: ['#FFD56B', '#6ECEDA'], // Auriu la turcoaz
};

// Export default pentru compatibilitate cu importuri
export default Colors;