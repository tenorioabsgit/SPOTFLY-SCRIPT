export const Colors = {
  // Brand
  primary: '#1DB954',
  primaryLight: '#1ED760',
  primaryDark: '#1AA34A',

  // Backgrounds
  background: '#121212',
  surface: '#181818',
  surfaceElevated: '#212121',
  surfaceLight: '#282828',
  surfaceLighter: '#333333',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textTertiary: '#727272',
  textInactive: '#535353',

  // UI
  inactive: '#535353',
  divider: '#282828',
  error: '#E22134',
  warning: '#F59B23',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Tab bar
  tabBarBackground: 'rgba(18, 18, 18, 0.95)',

  // Mini player
  miniPlayerBg: '#282828',

  // Category colors for search
  categories: [
    '#E13300', '#1E3264', '#8400E7', '#E8115B',
    '#1DB954', '#E91429', '#DC148C', '#27856A',
    '#503750', '#148A08', '#477D95', '#B02897',
    '#E1118C', '#537AA1', '#8C67AB', '#A56752',
  ] as string[],
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
};
