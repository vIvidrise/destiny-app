import * as Haptics from 'expo-haptics';
import { Platform, Pressable, PressableProps } from 'react-native';

type HapticPressableProps = PressableProps & {
  hapticStyle?: Haptics.ImpactFeedbackStyle;
};

export function HapticPressable({
  onPress,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  children,
  ...rest
}: HapticPressableProps) {
  const handlePress = (e: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(hapticStyle);
    }
    onPress?.(e);
  };

  return (
    <Pressable onPress={handlePress} {...rest}>
      {children}
    </Pressable>
  );
}
