import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  window: { width, height },
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  cardSize: {
    small: (width - 48) / 2,
    medium: 150,
    large: 180,
  },
  miniPlayerHeight: 64,
  tabBarHeight: 56,
  headerHeight: 56,
};
