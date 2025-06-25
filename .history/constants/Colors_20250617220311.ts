/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#6BCF7F';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

// FitLife Pastel Green Color Palette
export const FitLifeColors = {
  // Ana yeşil tonları
  primary: '#6BCF7F',        // Ana yeşil (button primary)
  primaryLight: '#A8E6A3',   // Açık yeşil (hover states)
  primaryDark: '#4CAF50',    // Koyu yeşil (active states)
  
  // İkinci seviye yeşil tonları
  secondary: '#81C784',      // İkincil yeşil (secondary buttons)
  secondaryLight: '#C8E6C9', // Çok açık yeşil (backgrounds)
  secondaryDark: '#66BB6A',  // Orta koyu yeşil
  
  // Accent yeşil tonları
  accent: '#A5D6A7',         // Vurgu yeşili
  accentLight: '#E8F5E8',    // En açık yeşil (card backgrounds)
  accentDark: '#8BC34A',     // Canlı yeşil
  
  // Durum renkleri - yeşil tonlarında
  success: '#66BB6A',        // Başarı (koyu yeşil)
  warning: '#9CCC65',        // Uyarı (sarımsı yeşil)
  error: '#81C784',          // Hata (yumuşak yeşil - sert kırmızı yerine)
  info: '#A5D6A7',          // Bilgi (pastel yeşil)
  
  // Nötr renkler
  white: '#FFFFFF',
  lightGray: '#F1F8E9',      // Çok açık yeşilimsi gri
  gray: '#C8E6C9',           // Açık yeşilimsi gri
  darkGray: '#66BB6A',       // Koyu yeşilimsi gri
  black: '#2E7D32',          // Koyu yeşil (siyah yerine)
  
  // Text renkleri
  textPrimary: '#2E7D32',    // Ana text (koyu yeşil)
  textSecondary: '#4CAF50',   // İkincil text (orta yeşil)
  textLight: '#81C784',      // Açık text (açık yeşil)
  textMuted: '#A5D6A7',      // Soluk text (pastel yeşil)
  
  // Background renkleri
  background: '#F9FBE7',     // Ana background (çok açık yeşilimsi)
  cardBackground: '#FFFFFF', // Kart background
  surfaceLight: '#F1F8E9',   // Açık surface
  surfaceDark: '#E8F5E8',    // Koyu surface
};
