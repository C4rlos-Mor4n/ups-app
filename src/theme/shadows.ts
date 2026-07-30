import { Platform } from 'react-native';
import { colors } from './colors';

export const shadows = {
  soft: Platform.select({
    ios: {
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
    default: {
      boxShadow: '0px 2px 8px rgba(64, 63, 59, 0.05)',
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: colors.textPrimary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: {
      elevation: 4,
    },
    default: {
      boxShadow: '0px 4px 12px rgba(64, 63, 59, 0.08)',
    },
  }),
};
