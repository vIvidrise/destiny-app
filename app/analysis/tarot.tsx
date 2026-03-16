import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import {
  TAROT_DECK,
  TAROT_THEMES,
  getInterpretationCardStyle,
  shuffleDeck,
  type DrawnTarotCard,
  type TarotThemeId,
} from '@/utils/tarotLogic';
import { TAROT_IMAGE_MAP, CARD_BACK } from '@/utils/tarotImages';
import { triggerHaptic } from '@/utils/haptic';

const LABELS = ['과거', '현재', '미래'] as const;
const CARD_WIDTH = 56;
const CARD_HEIGHT = 84;
const FAN_CARD_COUNT = 22;
const FAN_RADIUS = 165;
const FAN_ANGLE_SPAN = 88;
const FAN_ARC_HEIGHT = 200;
const { width, height } = Dimensions.get('window');

type Step = 'theme' | 'select' | 'result';

const CARD_ENTRANCE_DELAY = 35;
const CARD_ENTRANCE_DURATION = 500;

function FanCard({
  item,
  index,
  x,
  tyBase,
  angle,
  onSelect,
}: {
  item: DrawnTarotCard;
  index: number;
  x: number;
  tyBase: number;
  angle: number;
  onSelect: () => void;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * CARD_ENTRANCE_DELAY,
      withTiming(1, { duration: CARD_ENTRANCE_DURATION })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.5, 1]);
    const opacity = interpolate(progress.value, [0, 0.3, 1], [0.5, 0.9, 1]);
    const fanProgress = interpolate(progress.value, [0, 1], [0, 1]);
    const tx = x * fanProgress;
    const ty = tyBase * fanProgress;
    const rot = angle * fanProgress;
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${rot}deg` },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.fanCard,
        {
          position: 'absolute',
          left: width / 2 - CARD_WIDTH / 2,
          top: 0,
          zIndex: FAN_CARD_COUNT - Math.abs(index - (FAN_CARD_COUNT - 1) / 2),
        },
        animatedStyle,
      ]}
    >
      <TouchableOpacity
        onPress={onSelect}
        activeOpacity={0.8}
        style={styles.fanCardTouch}
      >
        <Image source={CARD_BACK} style={styles.fanCardImg} resizeMode="cover" />
      </TouchableOpacity>
    </Animated.View>
  );
}

function ShuffleOverlay({ onComplete }: { onComplete: () => void }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1200 }, (finished) => {
      if (finished) runOnJS(onComplete)();
    });
  }, []);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.sin(progress.value * Math.PI * 8) * 6 },
      { rotate: `${Math.sin(progress.value * Math.PI * 4) * 5}deg` },
    ],
  }));

  return (
    <View style={styles.shuffleOverlay}>
      <Text style={styles.shuffleText}>카드를 섞고 있습니다...</Text>
      <Animated.View style={[styles.shuffleCardsWrap, shakeStyle]}>
        {[0, 1, 2, 3, 4].map((i) => (
          <View key={i} style={[styles.shuffleCard, { zIndex: i, left: i * 10 }]}>
            <Image source={CARD_BACK} style={styles.shuffleCardImg} resizeMode="cover" />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}

export default function TarotScreen() {
  const [step, setStep] = useState<Step>('theme');
  const [themeId, setThemeId] = useState<TarotThemeId | null>(null);
  const [selectedCards, setSelectedCards] = useState<DrawnTarotCard[]>([]);
  const [selectSlot, setSelectSlot] = useState(0);
  const [shuffleComplete, setShuffleComplete] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    if (step === 'select') setShuffleComplete(false);
  }, [step]);

  const shuffledDeck = useMemo(() => {
    return shuffleDeck(
      TAROT_DECK.map((c) => ({ ...c, isReversed: Math.random() > 0.5 }))
    ) as DrawnTarotCard[];
  }, [step === 'select']);

  const selectedIds = new Set(selectedCards.map((c) => c.id));
  const availableCards = shuffledDeck.filter((c) => !selectedIds.has(c.id));

  const themeLabel = themeId ? TAROT_THEMES.find((t) => t.id === themeId)?.label ?? '' : '';

  const handleThemeSelect = (id: TarotThemeId) => {
    setThemeId(id);
    setSelectedCards([]);
    setSelectSlot(0);
    setStep('select');
  };

  const handleCardSelect = (card: DrawnTarotCard) => {
    if (selectedCards.length >= 3) return;
    setSelectedCards((prev) => [...prev, card]);
    if (selectedCards.length >= 2) {
      const result = getInterpretationCardStyle(themeLabel, [...selectedCards, card]);
      router.push({
        pathname: '/analysis/result',
        params: {
          type: 'Tarot',
          data: JSON.stringify({
            keyword: `${themeLabel} - 당신의 타로카드`,
            themeLabel: result.themeLabel,
            cards: result.cards,
            interpretation: result.interpretation,
            sections: result.sections,
            isCardStyle: true,
          }),
        },
      });
      setStep('theme');
      setThemeId(null);
      setSelectedCards([]);
    } else {
      setSelectSlot(selectedCards.length + 1);
    }
  };

  if (step === 'theme') {
    return (
      <AnalysisScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>테마를 선택하세요</Text>
        <Text style={styles.subtitle}>질문에 맞는 테마를 고른 뒤, 78장 중 3장의 카드를 직접 선택합니다</Text>
        <View style={styles.themeGrid}>
          {TAROT_THEMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.themeButtonWrapper, Platform.OS === 'android' && styles.themeButtonWrapperAndroid]}
              onPress={() => { triggerHaptic(); handleThemeSelect(t.id); }}
              activeOpacity={0.85}
            >
              <View style={styles.themeButtonContent}>
                <Text style={styles.themeIcon}>{t.icon}</Text>
                <Text style={styles.themeLabel}>{t.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </AnalysisScreenLayout>
    );
  }

  return (
    <AnalysisScreenLayout>
    <View style={styles.container}>
      {!shuffleComplete && (
        <ShuffleOverlay onComplete={() => setShuffleComplete(true)} />
      )}
      <Text style={styles.title}>{themeLabel}</Text>
      <Text style={styles.selectPrompt}>
        {selectSlot === 0 && '과거'}
        {selectSlot === 1 && '현재'}
        {selectSlot === 2 && '미래'} 카드를 선택하세요 ({selectedCards.length + 1}/3)
      </Text>

      {selectedCards.length > 0 && (
        <View style={styles.selectedRow}>
          {selectedCards.map((card, i) => (
            <View key={i} style={styles.selectedCard}>
              {TAROT_IMAGE_MAP[card.filename] ? (
                <Image
                  source={TAROT_IMAGE_MAP[card.filename]}
                  style={[styles.smallCardImg, card.isReversed && { transform: [{ rotate: '180deg' }] }]}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.smallCardPlaceholder}>
                  <Text style={styles.smallCardName}>{card.name}</Text>
                </View>
              )}
              <Text style={styles.slotLabel}>{LABELS[i]}</Text>
            </View>
          ))}
        </View>
      )}

      {shuffleComplete && (
        <View style={styles.fanContainer}>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>질문을 생각하면서 마음이 가는 카드를 선택하세요</Text>
          </View>
          <View style={styles.fanWrapper}>
            {availableCards.slice(0, FAN_CARD_COUNT).map((item, index) => {
              const t = FAN_CARD_COUNT <= 1 ? 0.5 : index / (FAN_CARD_COUNT - 1);
              const angle = (t - 0.5) * FAN_ANGLE_SPAN;
              const rad = (angle * Math.PI) / 180;
              const x = Math.sin(rad) * FAN_RADIUS;
              const tyBase = FAN_ARC_HEIGHT * (1 - Math.cos(rad));
              return (
                <FanCard
                  key={`${item.id}-${item.filename}-${index}`}
                  item={item}
                  index={index}
                  x={x}
                  tyBase={tyBase}
                  angle={angle}
                  onSelect={() => { triggerHaptic(); handleCardSelect(item); }}
                />
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.shuffleButton}
            onPress={() => {
            triggerHaptic();
            setShuffleKey((k: number) => k + 1);
            setSelectedCards([]);
            setSelectSlot(0);
            setShuffleComplete(false);
          }}
            activeOpacity={0.8}
          >
            <Text style={styles.shuffleButtonText}>카드 섞기</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 24 },
  title: { color: '#BB86FC', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#8A8C9E', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  themeButtonWrapper: {
    width: '45%',
    minWidth: 140,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#12142a',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    borderRightColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  themeButtonWrapperAndroid: {
    elevation: 6,
  },
  themeButtonContent: {
    alignItems: 'center',
  },
  themeIcon: { fontSize: 36, marginBottom: 8 },
  themeLabel: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  selectPrompt: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  selectedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  selectedCard: {
    alignItems: 'center',
    width: 70,
  },
  smallCardImg: {
    width: 70,
    height: 105,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  smallCardPlaceholder: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: '#1A1C35',
    borderWidth: 2,
    borderColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallCardName: { color: '#FFD700', fontSize: 10, textAlign: 'center' },
  slotLabel: { color: '#888', fontSize: 12, marginTop: 4, fontWeight: '600' },
  fanContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  speechBubble: {
    backgroundColor: 'rgba(60, 55, 90, 0.9)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignSelf: 'center',
    maxWidth: width - 48,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.25)',
  },
  speechText: {
    color: '#FFF',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  fanWrapper: {
    height: 260,
    minHeight: 260,
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  fanCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 1,
    position: 'absolute',
  },
  fanCardTouch: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 28, 50, 0.95)',
  },
  fanCardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.5)',
  },
  shuffleButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(30, 25, 55, 0.9)',
  },
  shuffleButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  shuffleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 18, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  shuffleText: {
    color: '#BB86FC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 32,
  },
  shuffleCardsWrap: {
    width: 120,
    height: 90,
    position: 'relative',
  },
  shuffleCard: {
    position: 'absolute',
    width: 70,
    height: 105,
    borderRadius: 8,
  },
  shuffleCardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.5)',
  },
});
