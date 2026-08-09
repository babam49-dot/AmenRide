import { Platform } from 'react-native';

/**
 * Returns platform-appropriate shadow styles.
 * On web, uses CSS boxShadow. On native, uses React Native shadow props.
 */
export function shadow(offsetX = 0, offsetY = 4, blur = 8, opacity = 0.1, color = '#000') {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${offsetX}px ${offsetY}px ${blur}px rgba(0,0,0,${opacity})`,
    };
  }
  return {
    shadowColor: color,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius: blur / 2,
    elevation: Math.round(offsetY * 2),
  };
}
