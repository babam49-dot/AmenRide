/**
 * Color palette and styling constants for Amen-Ride app (Bahir Dar theme)
 */

export const COLORS = {
  primary: '#0D9488', // Emerald Teal
  primaryDark: '#0F766E',
  secondary: '#0284C7', // Lake Tana Blue
  accent: '#F59E0B', // Amber / Gold accent
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Neutral Tones
  dark: '#0F172A',
  darkGray: '#334155',
  mediumGray: '#64748B',
  lightGray: '#E2E8F0',
  cardBg: '#FFFFFF',
  surface: '#F8FAFC',

  // Status Indicators
  online: '#22C55E',
  offline: '#94A3B8',
  busy: '#F97316',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 18,
  full: 9999,
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'online':
    case 'completed':
    case 'accepted':
      return COLORS.success;
    case 'busy':
    case 'in_progress':
      return COLORS.busy;
    case 'offline':
    case 'cancelled':
      return COLORS.offline;
    default:
      return COLORS.primary;
  }
};
