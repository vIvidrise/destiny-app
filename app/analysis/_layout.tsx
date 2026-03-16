import { Stack } from 'expo-router';
import { AppInTossHeader } from '@/components/appin-toss-header';
import { AppConfig } from '@/constants/appConfig';

export default function AnalysisLayout() {
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
      <Stack.Screen name="daily-fortune" options={{ title: '오늘의 운세' }} />
      <Stack.Screen name="face-reading" options={{ title: 'AI 관상' }} />
      <Stack.Screen name="saju" options={{ title: 'AI 사주' }} />
      <Stack.Screen name="tarot" options={{ title: 'AI 타로' }} />
      <Stack.Screen name="saju-tarot" options={{ title: '사주×타로' }} />
      <Stack.Screen name="love-compatibility" options={{ title: '연애 궁합' }} />
      <Stack.Screen name="work-compatibility" options={{ title: '직장 궁합' }} />
      <Stack.Screen name="result" options={{ title: '분석 결과' }} />
    </Stack>
  );
}
