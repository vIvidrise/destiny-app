import { Stack } from 'expo-router';
import { AppInTossHeader } from '@/components/appin-toss-header';
import { AppConfig } from '@/constants/appConfig';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        header: ({ navigation }) => (
          <AppInTossHeader canGoBack={navigation.canGoBack()} />
        ),
        headerShadowVisible: false,
        contentStyle: { backgroundColor: AppConfig.ui.backgroundColor },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}
