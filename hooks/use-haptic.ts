import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptic() {
  const impact = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(style);
    }
  };

  const withHaptic = <T extends (...args: unknown[]) => void>(
    fn: T,
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light
  ): T => {
    return ((...args: Parameters<T>) => {
      impact(style);
      fn(...args);
    }) as T;
  };

  return { impact, withHaptic };
}
