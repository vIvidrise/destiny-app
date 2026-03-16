import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { triggerHaptic } from '@/utils/haptic';
import { AppConfig } from '@/constants/appConfig';
import { getDailyCard } from '@/utils/dailyFortune';
import { TAROT_IMAGE_MAP } from '@/utils/tarotImages';

const ACTION_ITEMS = [
  { icon: '🔮', title: 'AI 사주', route: '/analysis/saju' as const },
  { icon: '🃏', title: 'AI 타로', route: '/analysis/tarot' as const },
  { icon: '🗝️', title: '사주×타로', route: '/analysis/saju-tarot' as const },
] as const;

export default function HomeScreen() {
  const dailyCard = useMemo(() => getDailyCard(), []);
  const cardSource = TAROT_IMAGE_MAP[dailyCard.filename];

  return (
    <LinearGradient
        colors={[AppConfig.ui.navBarBackground, AppConfig.ui.backgroundColor]}
        style={styles.container}
      >
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 1. 오늘의 운세 카드 (메인 글래스모피즘 카드) */}
          <Pressable
            onPress={() => router.push('/analysis/daily-fortune')}
            style={({ pressed }) => [styles.mainCardWrapper, pressed && { opacity: 0.9 }]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 30 : 80}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.mainCard, Platform.OS === 'android' && styles.blurFallback]}
            />
            <View style={styles.mainCardContent} pointerEvents="none">
              {cardSource ? (
                <Image
                  source={cardSource}
                  style={[styles.dailyCardImage, dailyCard.isReversed && styles.reversedCard]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.tarotCardMockup} />
              )}
              <Text style={styles.mainTitle}>오늘의 운세 카드</Text>
              <Text style={styles.mainSubtitle}>
                {dailyCard.name} ({dailyCard.isReversed ? '역방향' : '정방향'}){'\n'}
                탭해서 오늘의 운세를 확인하세요
              </Text>
            </View>
          </Pressable>

          {/* 2. 3개의 기능 버튼 (가로 정렬) */}
          <View style={styles.buttonRow}>
            {ACTION_ITEMS.map((item, index) => (
              <Pressable
                key={index}
                onPress={() => { triggerHaptic(); router.push(item.route); }}
                style={({ pressed }) => [
                  styles.actionButtonWrapper,
                  pressed && styles.actionButtonPressed,
                ]}
              >
                <BlurView
                  intensity={Platform.OS === 'ios' ? 20 : 60}
                  tint="dark"
                  pointerEvents="none"
                  style={[StyleSheet.absoluteFill, styles.actionButton, Platform.OS === 'android' && styles.blurFallback]}
                />
                <View style={styles.actionButtonContent} pointerEvents="none">
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={styles.buttonText}>{item.title}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* 3. 오늘 인기 운세 리스트 */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>오늘 인기 운세</Text>
            <TouchableOpacity onPress={() => { triggerHaptic(); router.push('/analysis/tarot'); }}>
              <Text style={styles.listMore}>보러가기 {'>'}</Text>
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => router.push('/analysis/tarot')}
            style={({ pressed }) => [styles.listItemWrapper, pressed && { opacity: 0.8 }]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 20 : 60}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.listItem, Platform.OS === 'android' && styles.blurFallback]}
            />
            <View style={styles.listIconContent} pointerEvents="none">
              <Text style={styles.listIcon}>💜</Text>
              <View>
                <Text style={styles.listRank}>1위 연애운</Text>
                <Text style={styles.listDesc}>
                  상대방의 속마음을 꿰뚫어보는 타로
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/analysis/tarot')}
            style={({ pressed }) => [styles.listItemWrapper, pressed && { opacity: 0.8 }]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 20 : 60}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.listItem, Platform.OS === 'android' && styles.blurFallback]}
            />
            <View style={styles.listIconContent} pointerEvents="none">
              <Text style={styles.listIcon}>🪙</Text>
              <View>
                <Text style={styles.listRank}>2위 재물운</Text>
                <Text style={styles.listDesc}>
                  올해 나의 재물 흐름을 파악해보세요
                </Text>
              </View>
            </View>
          </Pressable>

          {/* 오늘 인기 사주 */}
          <View style={[styles.listHeader, { marginTop: 24 }]}>
            <Text style={styles.listTitle}>오늘 인기 사주</Text>
            <TouchableOpacity onPress={() => { triggerHaptic(); router.push('/analysis/saju'); }}>
              <Text style={styles.listMore}>보러가기 {'>'}</Text>
            </TouchableOpacity>
          </View>

          <Pressable
            onPress={() => router.push('/analysis/love-compatibility')}
            style={({ pressed }) => [styles.listItemWrapper, pressed && { opacity: 0.8 }]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 20 : 60}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.listItem, Platform.OS === 'android' && styles.blurFallback]}
            />
            <View style={styles.listIconContent} pointerEvents="none">
              <Text style={styles.listIcon}>💞</Text>
              <View>
                <Text style={styles.listRank}>1위 연애 궁합</Text>
                <Text style={styles.listDesc}>
                  천생연분일까, 찰나의 인연일까? 깊은 궁합 분석
                </Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => { triggerHaptic(); router.push('/analysis/work-compatibility'); }}
            style={({ pressed }) => [styles.listItemWrapper, pressed && { opacity: 0.8 }]}
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 20 : 60}
              tint="dark"
              pointerEvents="none"
              style={[StyleSheet.absoluteFill, styles.listItem, Platform.OS === 'android' && styles.blurFallback]}
            />
            <View style={styles.listIconContent} pointerEvents="none">
              <Text style={styles.listIcon}>🤝</Text>
              <View>
                <Text style={styles.listRank}>2위 직장 궁합</Text>
                <Text style={styles.listDesc}>
                  나의 업무 성향과 지금 회사의 찰떡 지수 확인
                </Text>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },

  mainCardWrapper: {
    borderRadius: 24,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
    minHeight: 280,
  },
  mainCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  mainCardContent: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurFallback: {
    backgroundColor: 'rgba(30, 30, 50, 0.85)',
  },
  tarotCardMockup: {
    width: 120,
    height: 180,
    backgroundColor: '#1A1C35',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A4E85',
  },
  dailyCardImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(187, 134, 252, 0.5)',
  },
  reversedCard: { transform: [{ rotate: '180deg' }] },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  mainSubtitle: {
    color: '#8A8C9E',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // 3개 버튼 배열
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 10,
  },
  actionButtonWrapper: {
    flex: 1,
    aspectRatio: 1,
    minHeight: 100,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPressed: {
    opacity: 0.8,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
  },
  buttonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },

  // 리스트 영역
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  listMore: { color: '#8A8C9E', fontSize: 13 },

  listItemWrapper: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 80,
  },
  listItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  listIconContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  listIcon: { fontSize: 30, marginRight: 15 },
  listRank: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  listDesc: { color: '#8A8C9E', fontSize: 12 },
});
