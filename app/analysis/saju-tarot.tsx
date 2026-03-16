import { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
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
import {
  TAROT_DECK,
  TAROT_THEMES,
  getInterpretationSajuTarotStyle,
  shuffleDeck,
  type DrawnTarotCard,
  type TarotThemeId,
  type SajuContext,
} from '@/utils/tarotLogic';
import { buildSajuContextForTarot } from '@/utils/sajuLogic';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { TAROT_IMAGE_MAP, CARD_BACK } from '@/utils/tarotImages';
import { SibijisiTimePicker } from '@/components/SibijisiTimePicker';
import { getBirthTimeHHMMFromSibijisi, getSibijisiItem, type SibijisiBranch } from '@/utils/sibijisi';
import { triggerHaptic } from '@/utils/haptic';

const LABELS = ['과거', '현재', '미래'] as const;
const CARD_WIDTH = 56;
const CARD_HEIGHT = 84;
const FAN_CARD_COUNT = 22;
const FAN_RADIUS = 165;
const FAN_ANGLE_SPAN = 88;
const FAN_ARC_HEIGHT = 200;
const { width } = Dimensions.get('window');

type Step = 'theme' | 'saju' | 'select';

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
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8} style={styles.fanCardTouch}>
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

export default function SajuTarotScreen() {
  const [step, setStep] = useState<Step>('theme');
  const [themeId, setThemeId] = useState<TarotThemeId | null>(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('19940225');
  const [birthSibijisi, setBirthSibijisi] = useState<SibijisiBranch>('미');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedCards, setSelectedCards] = useState<DrawnTarotCard[]>([]);
  const [selectSlot, setSelectSlot] = useState(0);
  const [shuffleComplete, setShuffleComplete] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const getBirthTimeHHMM = () => getBirthTimeHHMMFromSibijisi(birthSibijisi);

  const getBirthTimeDisplay = () => {
    const item = getSibijisiItem(birthSibijisi);
    return item ? `${item.char} (${item.timeRange})` : getBirthTimeHHMM().slice(0, 2) + ':' + getBirthTimeHHMM().slice(2);
  };

  const sajuContext = useMemo((): SajuContext | null => {
    if (step !== 'select') return null;
    const ctx = buildSajuContextForTarot(name, birthDate, getBirthTimeHHMM(), calendarType);
    return ctx as SajuContext;
  }, [step, name, birthDate, birthSibijisi, calendarType]);

  useEffect(() => {
    if (step === 'select') setShuffleComplete(false);
  }, [step]);

  const shuffledDeck = useMemo(() => {
    return shuffleDeck(
      TAROT_DECK.map((c) => ({ ...c, isReversed: Math.random() > 0.5 }))
    ) as DrawnTarotCard[];
  }, [step === 'select', shuffleKey]);

  const selectedIds = new Set(selectedCards.map((c) => c.id));
  const availableCards = shuffledDeck.filter((c) => !selectedIds.has(c.id));

  const themeLabel = themeId ? TAROT_THEMES.find((t) => t.id === themeId)?.label ?? '' : '';

  const handleThemeSelect = (id: TarotThemeId) => {
    setThemeId(id);
    setStep('saju');
  };

  const handleSajuNext = () => {
    setSelectedCards([]);
    setSelectSlot(0);
    setStep('select');
  };

  const handleCardSelect = (card: DrawnTarotCard) => {
    if (selectedCards.length >= 3 || !sajuContext) return;
    setSelectedCards((prev) => [...prev, card]);
    if (selectedCards.length >= 2) {
      const three = [...selectedCards, card];
      const result = getInterpretationSajuTarotStyle(themeLabel, three, sajuContext);
      const y = birthDate.slice(0, 4);
      const m = birthDate.slice(4, 6);
      const d = birthDate.slice(6, 8);
      const calLabel = calendarType === 'lunar' ? '음력' : '양력';
      const birthStr = `${calLabel} ${y}년 ${m}월 ${d}일 ${getBirthTimeDisplay()} 출생`;
      const pillars = sajuContext.pillars;
      const sajuInfo = {
        displayName: sajuContext.displayName,
        birthStr,
        pillarsText: `年柱 ${pillars.year} | 月柱 ${pillars.month} | 日柱 ${pillars.day} | 時柱 ${pillars.hour}`,
        ilganDesc: `${sajuContext.ilganInfo.char}${sajuContext.ilganInfo.ohang}(${sajuContext.ilganInfo.ohang}) — ${sajuContext.ilganInfo.personality}`,
        zodiacDesc: sajuContext.zodiacInfo,
      };
      router.push({
        pathname: '/analysis/result',
        params: {
          type: 'SajuTarot',
          data: JSON.stringify({
            keyword: `${sajuContext.displayName}님의 사주×타로 — ${themeLabel}`,
            themeLabel: result.themeLabel,
            cards: result.cards,
            sajuSummary: result.sajuSummary,
            sajuInfo,
            sections: result.sections,
            isSajuTarot: true,
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

  // Step 1: 테마 선택
  if (step === 'theme') {
    return (
      <AnalysisScreenLayout>
      <View style={styles.container}>
        <Text style={styles.title}>테마를 선택하세요</Text>
        <Text style={styles.subtitle}>
          질문에 맞는 테마를 고른 뒤, 사주 정보를 입력하고 78장 중 3장의 카드를 선택합니다
        </Text>
        <View style={styles.themeGrid}>
          {TAROT_THEMES.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={styles.themeButton}
              onPress={() => { triggerHaptic(); handleThemeSelect(t.id); }}
              activeOpacity={0.8}
            >
              <Text style={styles.themeIcon}>{t.icon}</Text>
              <Text style={styles.themeLabel}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      </AnalysisScreenLayout>
    );
  }

  // Step 2: 사주 정보 입력
  if (step === 'saju') {
    return (
      <AnalysisScreenLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>{themeLabel}</Text>
          <Text style={styles.subtitle}>
            사주 정보를 입력하면, 타로 해석에 당신의 일간·띠·오행이 반영됩니다.
          </Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력해주세요"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>생년월일 (YYYYMMDD)</Text>
            <View style={styles.calendarRow}>
              <TouchableOpacity
                style={[styles.calendarButton, calendarType === 'solar' && styles.calendarSelected]}
                onPress={() => setCalendarType('solar')}
              >
                <Text style={styles.calendarButtonText}>양력</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.calendarButton, calendarType === 'lunar' && styles.calendarSelected]}
                onPress={() => setCalendarType('lunar')}
              >
                <Text style={styles.calendarButtonText}>음력</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, styles.dateInput]}
              value={birthDate}
              onChangeText={(t) => setBirthDate(t.replace(/\D/g, '').slice(0, 8))}
              placeholder="19940225"
              placeholderTextColor="#888"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>출생시간 (십이지시)</Text>
            <SibijisiTimePicker value={birthSibijisi} onSelect={setBirthSibijisi} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.radioButton, gender === 'male' && styles.radioSelected]}
                onPress={() => setGender('male')}
              >
                <Text style={styles.radioText}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, gender === 'female' && styles.radioSelected]}
                onPress={() => setGender('female')}
              >
                <Text style={styles.radioText}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleSajuNext}>
            <Text style={styles.nextButtonText}>다음: 카드 선택</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      </AnalysisScreenLayout>
    );
  }

  // Step 3: 카드 선택
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
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { color: '#BB86FC', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: {
    color: '#8A8C9E',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: { marginBottom: 20 },
  label: { color: '#E0E0E0', fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  dateInput: { marginTop: 4 },
  calendarRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  calendarButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  calendarSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  calendarButtonText: { color: '#E0E0E0', fontSize: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { flex: 1, minWidth: 50 },
  timeSeparator: { color: '#E0E0E0', fontSize: 14 },
  amPmRow: { flexDirection: 'row', gap: 8 },
  amPmButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  amPmSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  amPmText: { color: '#E0E0E0', fontSize: 14 },
  genderRow: { flexDirection: 'row', gap: 12 },
  radioButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#BB86FC',
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
  },
  radioText: { color: '#E0E0E0', fontSize: 16 },
  nextButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  themeButton: {
    width: '45%',
    minWidth: 140,
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
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
  selectedCard: { alignItems: 'center', width: 70 },
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
  fanContainer: { flex: 1, paddingBottom: 24 },
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
  speechText: { color: '#FFF', fontSize: 15, textAlign: 'center', lineHeight: 22 },
  fanWrapper: {
    height: 260,
    minHeight: 260,
    width: '100%',
    position: 'relative',
    overflow: 'visible',
  },
  fanCard: { width: CARD_WIDTH, height: CARD_HEIGHT, zIndex: 1, position: 'absolute' },
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
  shuffleButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
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
  shuffleCardsWrap: { width: 120, height: 90, position: 'relative' },
  shuffleCard: { position: 'absolute', width: 70, height: 105, borderRadius: 8 },
  shuffleCardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.5)',
  },
});
