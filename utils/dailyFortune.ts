/**
 * 오늘의 운세: 날짜 기반 랜덤 카드, 하루 멘트, 오늘의 운세
 */

import {
  TAROT_DECK,
  getCardMeaning,
  type DrawnTarotCard,
} from '@/utils/tarotLogic';

/** YYYYMMDD 형식의 오늘 날짜 시드 */
function getDateSeed(): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return parseInt(`${y}${m}${d}`, 10);
}

/** 날짜 시드로 0 ~ max-1 범위의 일관된 인덱스 */
function seededIndex(seed: number, max: number): number {
  const h = ((seed * 31 + 17) % 1000000 + 1000000) % 1000000;
  return h % max;
}

/** 오늘의 운세 카드 (날짜마다 고정) */
export function getDailyCard(): DrawnTarotCard {
  const seed = getDateSeed();
  const cardIndex = seededIndex(seed, TAROT_DECK.length);
  const card = TAROT_DECK[cardIndex];
  const isReversed = seededIndex(seed + 1, 2) === 0;
  return { ...card, isReversed };
}

const DAILY_MANTRAS = [
  '오늘 하루, 당신의 선택이 미래를 만듭니다.',
  '작은 걸음이 큰 변화의 시작입니다.',
  '지금 이 순간을 온전히 느끼세요.',
  '당신 안에 이미 모든 답이 있습니다.',
  '오늘의 에너지를 그대로 받아들이세요.',
  '흐름을 거스르지 않고, 흐름에 맡기세요.',
  '믿음이 있으면 길이 열립니다.',
  '오늘 당신에게 찾아온 메시지를 마음에 새기세요.',
  '내일을 위해 오늘을 살되, 오늘을 충분히 즐기세요.',
  '당신의 직관을 믿으세요.',
  '모든 것은 순환합니다. 지금이 지나가면 새로운 것이 옵니다.',
  '작은 행복을 모으면 큰 행복이 됩니다.',
];

/** 오늘의 하루 멘트 */
export function getDailyMantra(): string {
  const seed = getDateSeed();
  const index = seededIndex(seed + 100, DAILY_MANTRAS.length);
  return DAILY_MANTRAS[index];
}

export interface DailyFortuneResult {
  card: DrawnTarotCard;
  mantra: string;
  fortune: string;
}

/** 오늘의 운세 전체 (카드 + 멘트 + 상세 해석) */
export function getDailyFortune(): DailyFortuneResult {
  const card = getDailyCard();
  const mantra = getDailyMantra();
  const meaning = getCardMeaning(card.name, card.isReversed);
  const dirLabel = card.isReversed ? '역방향' : '정방향';

  const fortune =
    `오늘 당신에게 선택된 카드는 ${card.name}(${dirLabel})입니다.\n\n` +
    `${meaning}\n\n` +
    `이 카드가 전하는 메시지를 오늘 하루 마음에 품어보세요. ` +
    `아침에 한 번, 중요한 결정 전에 한 번씩 떠올려보시면, ` +
    `당신의 하루에 긍정적인 영향을 미칠 것입니다. ` +
    `오늘 하루도 당신에게 좋은 일만 가득하기를. ✨`;

  return { card, mantra, fortune };
}
