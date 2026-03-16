import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function triggerHaptic(style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(style);
  }
}
