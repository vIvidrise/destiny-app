/**
 * 78장 타로 카드 데이터, Fisher-Yates 셔플, 카드별 의미
 */

const MAJOR_ARCANA = [
  { id: 0, name: '바보', filename: '0. 바보 카드.jpg' },
  { id: 1, name: '마법사', filename: '1. 마법사 카드.jpg' },
  { id: 2, name: '여사제', filename: '2. 여사제 카드.jpg' },
  { id: 3, name: '여황제', filename: '3. 여황제 카드.jpg' },
  { id: 4, name: '황제', filename: '4. 황제 카드.jpg' },
  { id: 5, name: '교황', filename: '5. 교황 카드.jpg' },
  { id: 6, name: '연인', filename: '6. 연인 카드.jpg' },
  { id: 7, name: '전차', filename: '7. 전차 카드.jpg' },
  { id: 8, name: '힘', filename: '8. 힘 카드.jpg' },
  { id: 9, name: '은둔자', filename: '9. 은둔자 카드.jpg' },
  { id: 10, name: '운명의 수레바퀴', filename: '10. 운명의 수레바퀴.jpg' },
  { id: 11, name: '정의', filename: '11. 정의 카드.jpg' },
  { id: 12, name: '행맨', filename: '12. 행맨 카드.jpg' },
  { id: 13, name: '죽음', filename: '13. 죽음 카드.jpg' },
  { id: 14, name: '절제', filename: '14. 절제 카드.jpg' },
  { id: 15, name: '악마', filename: '15. 악마 카드.jpg' },
  { id: 16, name: '타워', filename: '16. 타워 카드.jpg' },
  { id: 17, name: '별', filename: '17. 별 카드.jpg' },
  { id: 18, name: '달', filename: '18. 달 카드.jpg' },
  { id: 19, name: '태양', filename: '19. 태양 카드.jpg' },
  { id: 20, name: '심판', filename: '20. 심판 카드.jpg' },
  { id: 21, name: '세계', filename: '21. 세계 카드.jpg' },
];

const MINOR_SUITS = [
  { suit: '완드', cards: ['완드 에이스', '완드2', '완드3', '완드4', '완드5', '완드6', '완드7', '완드8', '완드9', '완드10', '완드 페이지', '완드 나이트', '완드 퀸', '완드 킹'] },
  { suit: '컵', cards: ['컵 에이스', '컵2', '컵3', '컵4', '컵5', '컵6', '컵7', '컵8', '컵9', '컵10', '컵 페이지', '컵 나이트', '컵 퀸', '컵 킹'] },
  { suit: '소드', cards: ['소드 에이스', '소드2', '소드3', '소드4', '소드5', '소드6', '소드7', '소드8', '소드9', '소드10', '소드 페이지', '소드 나이트', '소드 퀸', '소드 킹'] },
  { suit: '펜타클', cards: ['펜타클 에이스', '펜타클2', '펜타클3', '펜타클4', '펜타클5', '펜타클6', '펜타클7', '펜타클8', '펜타클9', '펜타클10', '펜타클 페이지', '펜타클 나이트', '펜타클 퀸', '펜타클 킹'] },
];

const MINOR_FILENAMES: Record<string, string> = {
  '완드 에이스': '완드 에이스.jpg', '완드2': '완드2.jpg', '완드3': '완드3.jpg', '완드4': '완드4.jpg', '완드5': '완드5.jpg',
  '완드6': '완드6.jpg', '완드7': '완드7.jpg', '완드8': '완드8.jpg', '완드9': '완드9.jpg', '완드10': '완드10.jpg',
  '완드 페이지': '완드 페이지.jpg', '완드 나이트': '완드 나이트.jpg', '완드 퀸': '완드 퀸.jpg', '완드 킹': '완드 킹.jpg',
  '컵 에이스': '컵 에이스.jpg', '컵2': '컵2.jpg', '컵3': '컵3.jpg', '컵4': '컵4.jpg', '컵5': '컵5.jpg',
  '컵6': '컵6.jpg', '컵7': '컵7.jpg', '컵8': '컵8.jpg', '컵9': '컵9.jpg', '컵10': '컵10.jpg',
  '컵 페이지': '컵 페이지.jpg', '컵 나이트': '컵 나이트.jpg', '컵 퀸': '컵 퀸.jpg', '컵 킹': '컵 킹.jpg',
  '소드 에이스': '소드 에이스.jpg', '소드2': '소드2.jpg', '소드3': '소드3.jpg', '소드4': '소드4.jpg', '소드5': '소드5.jpg',
  '소드6': '소드6.jpg', '소드7': '소드7.jpg', '소드8': '소드8.jpg', '소드9': '소드9.jpg', '소드10': '소드10.jpg',
  '소드 페이지': '소드 페이지.jpg', '소드 나이트': '소드 나이트.jpg', '소드 퀸': '소드 퀸.jpg', '소드 킹': '소드 킹.jpg',
  '펜타클 에이스': '펜타클 에이스.jpg', '펜타클2': '펜타클2.jpg', '펜타클3': '펜타클3.jpg', '펜타클4': '펜타클4.jpg', '펜타클5': '펜타클5.jpg',
  '펜타클6': '펜타클6.jpg', '펜타클7': '펜타클7.jpg', '펜타클8': '펜타클8.jpg', '펜타클9': '펜타클9.jpg', '펜타클10': '펜타클10.jpg',
  '펜타클 페이지': '펜타클 페이지.jpg', '펜타클 나이트': '펜타클 나이트.jpg', '펜타클 퀸': '펜타클 퀸.jpg', '펜타클 킹': '펜타클 킹.jpg',
};

function buildDeck(): Array<{ id: number; name: string; filename: string }> {
  const deck: Array<{ id: number; name: string; filename: string }> = [];
  let id = 0;
  MAJOR_ARCANA.forEach((c) => {
    deck.push({ id: id++, name: c.name, filename: c.filename });
  });
  MINOR_SUITS.forEach(({ cards }) => {
    cards.forEach((name) => {
      deck.push({ id: id++, name, filename: MINOR_FILENAMES[name] ?? `${name}.jpg` });
    });
  });
  return deck;
}

export const TAROT_DECK = buildDeck();

export interface DrawnTarotCard {
  id: number;
  name: string;
  filename: string;
  isReversed: boolean;
}

/** 카드별 기본 해석 (질문에 맞게 보강 가능) */
export const CARD_MEANINGS: Record<string, { upright: string; reversed: string }> = {
  '바보': { upright: '새로운 시작, 자유, 모험. 질문에 대한 답은 열린 마음으로 맞이할 때 찾아옵니다.', reversed: '신중함이 필요합니다. 무모한 결정을 피하세요.' },
  '마법사': { upright: '의지와 창조력. 질문에 대한 해결의 열쇠는 당신 손안에 있습니다.', reversed: '잠재력을 발휘하기 위해 집중이 필요합니다.' },
  '여사제': { upright: '직관과 내면의 지혜. 질문의 답은 고요함 속에서 찾으세요.', reversed: '숨겨진 진실이 드러날 때입니다.' },
  '여황제': { upright: '풍요와 사랑. 질문은 성장과 풍요로운 결과를 예고합니다.', reversed: '조급함보다는 인내가 필요합니다.' },
  '황제': { upright: '권위와 안정. 질문에 대한 답은 체계와 규율에서 나옵니다.', reversed: '유연함을 발휘할 시기입니다.' },
  '연인': { upright: '선택과 조화. 질문의 핵심은 중요한 선택에 있습니다.', reversed: '균형을 다시 맞출 필요가 있습니다.' },
  '운명의 수레바퀴': { upright: '변화와 순환. 질문에 대한 흐름이 바뀌고 있습니다.', reversed: '잠시 멈춰 흐름을 관찰하세요.' },
  '별': { upright: '희망과 영감. 질문에 대한 답은 긍정적인 미래에 있습니다.', reversed: '희망을 잃지 마세요.' },
  '태양': { upright: '성공과 기쁨. 질문의 결과는 밝게 빛날 것입니다.', reversed: '잠시 구름이 지나가고 있습니다.' },
  '세계': { upright: '완성과 성취. 질문은 마무리와 새로운 시작을 동시에 암시합니다.', reversed: '마지막 단계를 다듬을 때입니다.' },
};

export function getCardMeaning(name: string, isReversed: boolean): string {
  const meaning = CARD_MEANINGS[name];
  if (meaning) return isReversed ? meaning.reversed : meaning.upright;
  return isReversed
    ? `${name} 역방향: 기존 흐름에 반대되는 에너지가 작용합니다.`
    : `${name} 정방향: 이 카드는 질문에 대한 긍정적인 신호를 보냅니다.`;
}

export interface TarotQAItem {
  title: string;
  icon: string;
  answer: string;
}

/** 테마 (freesaju 스타일) */
export const TAROT_THEMES = [
  { id: 'business', label: '사업운', icon: '💼' },
  { id: 'love', label: '연애운', icon: '💕' },
  { id: 'study', label: '학업운', icon: '✍️' },
  { id: 'job', label: '취업운', icon: '🏢' },
  { id: 'relationship', label: '인간관계운', icon: '🤝' },
] as const;

export type TarotThemeId = (typeof TAROT_THEMES)[number]['id'];

/** AI 타로: 과거·현재·미래 분리 + 디테일·이해하기 쉬운 풀이 */
export function getInterpretationCardStyle(
  themeLabel: string,
  cards: DrawnTarotCard[]
): { themeLabel: string; cards: DrawnTarotCard[]; interpretation: string; sections: SajuTarotSection[] } {
  const meanings = cards.map((c) => getCardMeaning(c.name, c.isReversed));
  const d = (c: DrawnTarotCard) => (c.isReversed ? '역방향' : '정방향');

  const actionByTheme: Record<string, string> = {
    연애운: '상대에게 진심 한마디 전하기, 내 마음을 쪽지나 메시지에 적어보기',
    사업운: '이번 주 할 일 3가지를 정리해 실행하기, 동료·파트너에게 아이디어 하나 공유하기',
    학업운: '매일 30분 집중 공부 습관 만들기, 이해가 안 되는 부분 한 가지만 선생님이나 동료에게 질문하기',
    취업운: '이력서·자기소개서 한 문단씩 다듬기, 관심 직무 모집공고 하나 골라 요구사항·자격을 정리하기',
    인간관계운: '오랫동안 연락 안 한 소중한 사람에게 안부 연락하기, 나를 위해 작은 선물 하나 주기',
  };
  const actionText = actionByTheme[themeLabel] ?? '이번 주 카드 메시지를 떠올리며 한 가지를 실천하기';

  const sections: SajuTarotSection[] = [
    {
      icon: '🌙',
      title: `과거 — ${cards[0].name}(${d(cards[0])})가 말하는 것`,
      content:
        `과거 카드는 "지금 ${themeLabel}에 대한 고민이 어디서 시작됐는지"를 보여줍니다. ` +
        `타로에서 과거는 단순히 옛날 일이 아니라, 현재 상황을 만들고 있는 뿌리라고 볼 수 있어요.\n\n` +
        `뽑은 카드 ${cards[0].name}(${d(cards[0])})는 "${meanings[0]}"라는 메시지를 전합니다. ` +
        `지나온 경험, 과거의 선택, 그동안의 만남과 갈등이 지금의 질문과 상황을 만들었다는 뜻이에요.\n\n` +
        `과거를 후회하기보다는, 그 안에서 "뭘 배웠는지, 반복하고 싶지 않은 건 뭔지"를 한 번 정리해 보세요. ` +
        `그 교훈만 명확히 가져가면, 앞으로 어디로 나아갈지 방향이 더 선명해집니다.`,
    },
    {
      icon: '☀️',
      title: `현재 — ${cards[1].name}(${d(cards[1])})가 말하는 것`,
      content:
        `현재 카드는 "지금 이 순간 ${themeLabel}에서 가장 필요한 에너지나 마음가짐"을 가리킵니다. ` +
        `타로에서 현재는 과거와 미래를 이어주는 가운데 지점이에요.\n\n` +
        `${cards[1].name}(${d(cards[1])})는 "${meanings[1]}"라는 메시지를 담고 있습니다. ` +
        `지금 이 에너지를 의식적으로 품고, 이번 주 조금이라도 실천에 옮겨 보세요. ` +
        `지금의 마음가짐과 작은 행동이 미래 결과를 바꾼다고 믿어도 좋아요.\n\n` +
        `급하게 결과를 바라기보다, 매일 조금씩 쌓는 쪽에 집중하는 것이 좋습니다. ` +
        `오늘 한 걸음이 내일의 흐름을 만듭니다.`,
    },
    {
      icon: '⭐',
      title: `미래 — ${cards[2].name}(${d(cards[2])})가 말하는 것`,
      content:
        `미래 카드는 "지금 선택과 행동을 이어갈 때 펼쳐질 수 있는 가능성"을 보여줍니다. ` +
        `타로에서 미래는 정해진 운명이 아니라, 당신의 의지와 실천에 따라 바뀔 수 있는 방향이에요.\n\n` +
        `${cards[2].name}(${d(cards[2])})는 "${meanings[2]}"의 흐름을 예고합니다. ` +
        `이 카드의 방향을 목표로 삼고, 이번 주 할 수 있는 첫걸음을 하나 정해 보세요. ` +
        `과거에서 얻은 교훈 + 현재 카드의 메시지 + 미래 카드의 방향. 세 장이 하나의 이야기로 이어져, ` +
        `${themeLabel}에서 원하는 결과에 가까워질 수 있도록 이끌어 줍니다.`,
    },
    {
      icon: '💜',
      title: '이번 주 해 볼 수 있는 한 가지',
      content:
        `현재 카드 ${cards[1].name}의 메시지를 떠올리며, 이번 주에 실행할 수 있는 구체적인 한 가지를 정해 보세요.\n\n` +
        `예시) ${actionText}\n\n` +
        `과거 카드가 말한 교훈은 "반복하지 않을 것"을 정리하는 데, 미래 카드의 방향은 "목표를 세우는 데" 활용하면 됩니다. ` +
        `한 주 동안의 작은 걸음이 모여, ${themeLabel}에서 원하는 결과에 한 걸음 더 가까워질 수 있습니다.`,
    },
  ];

  const interpretation = sections.map((s) => `${s.title}\n${s.content}`).join('\n\n');

  return { themeLabel, cards: [...cards], interpretation, sections };
}

/** 사주 컨텍스트 (사주×타로용) */
export interface SajuContext {
  displayName: string;
  pillars: { year: string; month: string; day: string; hour: string };
  ilganInfo: { char: string; ohang: string; personality: string; tendency: string };
  zodiacInfo: string;
  zodiacName: string;
  strongOhang: string;
  weakOhang: string;
  dayGan: string;
}

export interface SajuTarotSection {
  icon: string;
  title: string;
  content: string;
}

/** 테마별 현재 섹션에서 강조할 포인트 */
function getThemeCurrentPoint(themeLabel: string): string {
  const map: Record<string, string> = {
    연애운: '상대에 대한 마음, 나 자신을 아끼는 태도',
    사업운: '기회를 포착하는 눈, 이미 가진 역량에 대한 확신',
    학업운: '집중하는 시간, 이해하지 못한 부분을 인정하는 용기',
    취업운: '지금 쌓아온 경력과 성장, 시장이 원하는 것과의 연결',
    인간관계운: '진심을 나누는 한 사람, 관계에서 지키고 싶은 경계',
  };
  return map[themeLabel] ?? '지금 이 순간 필요한 마음가짐';
}

/** 테마별 구체적 실천 예시 (여러 개) */
function getThemeActionExamples(themeLabel: string): string {
  const map: Record<string, string> = {
    연애운: '상대에게 오랜만에 진심 한마디 보내기, 내가 원하는 관계상을 종이에 적어보기',
    사업운: '이번 주 할 일 3가지를 정리해 실행하기, 동료나 파트너에게 아이디어 하나 공유하기',
    학업운: '집중 가능한 30분 정해두고 한 과목만 깊게 파기, 이해 안 되는 부분 한 가지만 선생님·동료에게 질문하기',
    취업운: '이력서나 자기소개서 한 문단 수정하기, 관심 회사 모집공고 하나 골라 요구사항 정리하기',
    인간관계운: '오랫동안 연락 안 한 소중한 사람에게 안부 메시지 보내기, 상처 줬다 싶은 사람이 있다면 마음을 담아 연락하기',
  };
  return map[themeLabel] ?? '오늘 하루 중 카드 메시지를 생각하며 한 가지 실천하기';
}

/** 일간별 과거 관점 (사주 — 데이터마다 다르게) */
const SAJU_PAST_BY_DAYGAN: Record<string, string> = {
  갑: '甲木 일간은 과거에 리더십이나 도전, 앞으로 나서는 선택이 지금의 고민을 만들었을 수 있어요.',
  을: '乙木 일간은 과거에 유연한 대처나 관계 속에서의 인내가 현재 상황의 뿌리가 됐을 수 있습니다.',
  병: '丙火 일간은 과거의 열정, 밝게 나서던 순간들이 지금의 질문과 연결돼 있어요.',
  정: '丁火 일간은 과거에 꼼꼼히 쌓아온 것, 은은히 키운 관계가 지금에 영향을 줍니다.',
  무: '戊土 일간은 과거의 안정 추구, 신중한 결정이 현재를 만들었을 가능성이 높아요.',
  기: '己土 일간은 과거에 포용하고 키우던 경험이 지금의 성장과 고민의 밑바탕이 됐어요.',
  경: '庚金 일간은 과거의 원칙, 단호한 선택이 지금의 방향을 정했을 수 있습니다.',
  신: '辛金 일간은 과거에 다듬고 완성하려 했던 것들이 현재의 기준과 감각을 만들었어요.',
  임: '壬水 일간은 과거의 흐름 읽기, 넓게 보던 시각이 지금의 고민과 연결됩니다.',
  계: '癸水 일간은 과거의 직관, 내면으로 깊이 새기던 경험이 현재에 영향을 줍니다.',
};

/** 일간별 현재 관점 */
const SAJU_PRESENT_BY_DAYGAN: Record<string, string> = {
  갑: '甲木 성향이라 지금은 한 가지를 정해 밀고 나가는 게 중요해요.',
  을: '乙木 성향이라 지금은 무리하지 않고 곡선적으로 나아가는 게 맞습니다.',
  병: '丙火 성향이라 지금 그 열정을 작은 실천으로 나누어 쓰는 게 좋아요.',
  정: '丁火 성향이라 지금은 한 가지에 집중해 깊이 파는 게 효과적이에요.',
  무: '戊土 성향이라 지금은 흔들리지 않고 기둥처럼 서 있는 게 중요합니다.',
  기: '己土 성향이라 지금은 쌓아온 것을 정리하고 다음 씨앗을 뿌리는 때예요.',
  경: '庚金 성향이라 지금은 원칙을 지키되, 필요하면 한 번 유연히 보는 것도 좋아요.',
  신: '辛金 성향이라 지금은 완벽을 추구하되, 과한 부담은 내려두는 게 좋습니다.',
  임: '壬水 성향이라 지금은 큰 그림을 보면서도 한 걸음씩 옮기는 게 맞아요.',
  계: '癸水 성향이라 지금은 고요한 시간을 갖고 직관을 듣는 것이 도움이 됩니다.',
};

/** 일간별 미래 관점 */
const SAJU_FUTURE_BY_DAYGAN: Record<string, string> = {
  갑: '甲木이라 앞으로도 당당히 목표를 세우고 올라가는 흐름이 잘 맞아요.',
  을: '乙木이라 미래는 꽃 피우듯 조금씩 피어나는 방식이 잘 어울립니다.',
  병: '丙火라 미래는 밝은 방향으로 에너지를 쏟을수록 결과가 열려요.',
  정: '丁火라 미래는 한 우물을 파는 집중이 결실을 맺기 쉽습니다.',
  무: '戊土라 미래는 쌓고 지키는 습관이 안정으로 이어져요.',
  기: '己土라 미래는 키우고 가꾸는 인내가 큰 결실로 이어집니다.',
  경: '庚金이라 미래는 원칙을 지키며 다듬어 나가면 단단해져요.',
  신: '辛金이라 미래는 갈고닦은 실력이 빛을 발하는 흐름이에요.',
  임: '壬水라 미래는 유연하게 흐름을 타면 기회가 열립니다.',
  계: '癸水라 미래는 직관과 내면을 믿고 나아가면 좋아요.',
};

/** 띠별 과거 한 줄 (데이터마다 다르게) */
const SAJU_PAST_BY_ZODIAC: Record<string, string> = {
  쥐: '쥐띠 기운으로 과거에 기회를 잡거나 판단했던 경험이 지금과 이어져요.',
  소: '소띠 기운으로 과거에 묵묵히 쌓아온 것이 현재의 밑바탕이 됐어요.',
  호랑이: '호랑이띠 기운으로 과거의 도전이나 리더십이 지금의 고민과 연결됩니다.',
  토끼: '토끼띠 기운으로 과거의 원만한 관계, 배려가 지금에 영향을 줘요.',
  용: '용띠 기운으로 과거의 야망이나 큰 그림이 현재의 질문을 만들었을 수 있어요.',
  뱀: '뱀띠 기운으로 과거에 깊이 파고들었던 경험이 지금의 통찰이 됐어요.',
  말: '말띠 기운으로 과거의 활동, 자유를 향한 움직임이 지금과 이어져요.',
  양: '양띠 기운으로 과거의 창의나 감성이 현재의 선택과 맞닿아 있어요.',
  원숭이: '원숭이띠 기운으로 과거의 재치, 순발력이 지금의 상황을 만들었어요.',
  닭: '닭띠 기운으로 과거에 꼼꼼히 쌓아온 것이 지금의 기준이 됐습니다.',
  개: '개띠 기운으로 과거의 의리, 신뢰가 지금의 관계와 고민에 영향을 줘요.',
  돼지: '돼지띠 기운으로 과거의 순수함, 인복이 지금의 흐름을 만들어요.',
};

/** 띠별 미래 한 줄 */
const SAJU_FUTURE_BY_ZODIAC: Record<string, string> = {
  쥐: '쥐띠의 총명함으로 앞으로도 기회를 놓치지 않는 흐름이 좋아요.',
  소: '소띠의 인내로 꾸준히 나아가면 결과가 따라옵니다.',
  호랑이: '호랑이띠의 용맹함으로 도전을 이어가면 흐름이 열려요.',
  토끼: '토끼띠의 온순함으로 관계를 가꾸면 미래가 밝아져요.',
  용: '용띠의 위엄으로 큰 목표를 품고 나아가도 좋아요.',
  뱀: '뱀띠의 지혜로 깊이 파고들면 통찰이 열립니다.',
  말: '말띠의 활달함으로 움직이면 기회가 생겨요.',
  양: '양띠의 창의로 감성을 살리면 결실이 맺혀요.',
  원숭이: '원숭이띠의 재치로 순발력 있게 대처하면 유리해요.',
  닭: '닭띠의 정확함으로 꼼꼼히 쌓으면 실력이 빛납니다.',
  개: '개띠의 충성으로 신뢰를 지키면 인연이 도와줘요.',
  돼지: '돼지띠의 인복으로 순수하게 나가면 흐름이 좋아져요.',
};

/** 강한 오행별 현재 조언 (데이터마다 다르게) */
const SAJU_PRESENT_BY_STRONG: Record<string, string> = {
  '木': '木이 강한 사주라 지금 추진력은 있지만, 한 번 숨 고르고 방향을 점검하는 게 좋아요.',
  '火': '火가 강한 사주라 열정은 넘치니, 그 에너지를 작은 실행으로 나누어 쓰세요.',
  '土': '土가 강한 사주라 안정적이니, 그 기반 위에 한 걸음씩 도전을 더해 보세요.',
  '金': '金이 강한 사주라 결단력이 있으니, 필요하면 유연히 구부리는 것도 도움이 됩니다.',
  '水': '水가 강한 사주라 흐름 읽기가 좋으니, 그 직관을 믿고 움직이세요.',
};

/** 약한 오행별 보완 조언 */
const SAJU_PRESENT_BY_WEAK: Record<string, string> = {
  '木': '木이 부족하면 지금 작은 결심, 한 가지 방향 정리가 도움이 됩니다.',
  '火': '火가 부족하면 지금 조금씩 움직이고, 밝은 목표를 하나 정해 보세요.',
  '土': '土가 부족하면 지금 루틴을 하나 정해 꾸준히 쌓는 게 좋아요.',
  '金': '金이 부족하면 지금 원칙을 하나 정하고, 작은 것부터 다듬어 보세요.',
  '水': '水가 부족하면 지금 고요한 시간을 갖고, 흐름을 읽는 연습이 도움이 됩니다.',
};

/** 사주×타로: 일간·띠·오행 반영 + 과거/현재/미래별 개인화 (데이터·카드마다 다르게) */
export function getInterpretationSajuTarotStyle(
  themeLabel: string,
  cards: DrawnTarotCard[],
  saju: SajuContext
): {
  themeLabel: string;
  cards: DrawnTarotCard[];
  sajuSummary: string;
  sections: SajuTarotSection[];
} {
  const { displayName, pillars, ilganInfo, zodiacInfo, zodiacName, strongOhang, weakOhang, dayGan } = saju;
  const meanings = cards.map((c) => getCardMeaning(c.name, c.isReversed));
  const d = (c: DrawnTarotCard) => (c.isReversed ? '역방향' : '정방향');
  const themePoint = getThemeCurrentPoint(themeLabel);
  const actionExamples = getThemeActionExamples(themeLabel);

  const sajuPastIlgan = SAJU_PAST_BY_DAYGAN[dayGan] ?? `${ilganInfo.char}${ilganInfo.ohang} 일간의 과거 성향이 지금의 고민과 연결돼 있어요.`;
  const sajuPresentIlgan = SAJU_PRESENT_BY_DAYGAN[dayGan] ?? `${ilganInfo.tendency} 성향을 살리되, 이번 주 집중할 한 가지를 정해 보세요.`;
  const sajuFutureIlgan = SAJU_FUTURE_BY_DAYGAN[dayGan] ?? `앞으로 ${ilganInfo.personality}을(를) 살려 나가면 흐름이 열립니다.`;
  const sajuPastZodiac = SAJU_PAST_BY_ZODIAC[zodiacName] ?? `${zodiacName}띠 기운이 과거 경험과 만나 지금의 상황을 만들었어요.`;
  const sajuFutureZodiac = SAJU_FUTURE_BY_ZODIAC[zodiacName] ?? `${zodiacName}띠 기운으로 앞으로도 흐름을 타면 좋아요.`;
  const sajuPresentStrong = SAJU_PRESENT_BY_STRONG[strongOhang] ?? `${strongOhang}이 강한 사주라 추진력을 살리되, 과하지 않게 조절하는 게 좋아요.`;
  const sajuPresentWeak = SAJU_PRESENT_BY_WEAK[weakOhang] ?? `${weakOhang}이 부족하면 그 방향을 조금씩 채워가는 실천이 도움이 됩니다.`;

  const sections: SajuTarotSection[] = [
    {
      icon: '🌙',
      title: `과거 — 타로 ${cards[0].name}(${d(cards[0])}) + 사주 관점`,
      content:
        `【타로】 과거 카드 ${cards[0].name}(${d(cards[0])})는 "${meanings[0]}"라는 메시지를 전합니다. ` +
        `지나온 경험이 ${themeLabel}에 대한 지금의 고민과 연결돼 있어요. ` +
        `현실적으로 보면, 과거에 같은 패턴을 반복했거나 막힌 지점이 있었다면 그 부분을 인정하고 "앞으로는 반복하지 않을 점"을 명확히 정리하는 게 먼저입니다.\n\n` +
        `【사주 — ${displayName}님만의 과거】 ${sajuPastIlgan} ` +
        `${sajuPastZodiac} 과거를 미화하거나 후회만 하지 말고, 얻은 교훈과 한계를 같이 짚어 보는 편이 다음 선택에 도움이 됩니다.`,
    },
    {
      icon: '☀️',
      title: `현재 — 타로 ${cards[1].name}(${d(cards[1])}) + 사주 관점`,
      content:
        `【타로】 현재 카드 ${cards[1].name}(${d(cards[1])})는 "${meanings[1]}"를 가리킵니다. ` +
        `지금 ${displayName}님이 놓치기 쉬운 것은 ${themePoint}입니다. ` +
        `다만 조급하게 움직이면 오히려 실수가 늘어날 수 있으니, 결과보다 "지금 할 수 있는 한 가지"를 정해 그걸 꾸준히 하는 쪽이 현실적입니다.\n\n` +
        `【사주 — ${displayName}님만의 현재】 ${sajuPresentIlgan} ` +
        `${sajuPresentStrong} ${sajuPresentWeak} ` +
        `카드와 사주를 합쳐 보면, 무리하지 않는 범위에서 이번 주 한 가지만 정해 실행하는 것을 권합니다.`,
    },
    {
      icon: '⭐',
      title: `미래 — 타로 ${cards[2].name}(${d(cards[2])}) + 사주 관점`,
      content:
        `【타로】 미래 카드 ${cards[2].name}(${d(cards[2])})는 "${meanings[2]}"의 흐름을 예고합니다. ` +
        `타로의 미래는 확정이 아니라, 지금 선택과 행동에 따라 좋아질 수도·유지될 수도·더 어려워질 수도 있는 가능성입니다. ` +
        `현실적인 조언이라면, 목표만 세우지 말고 "이렇게 되지 않을 때" 대안도 생각해 두는 게 좋습니다.\n\n` +
        `【사주 — ${displayName}님만의 미래】 ${sajuFutureIlgan} ` +
        `${sajuFutureZodiac} ` +
        `과거의 교훈과 현재 카드의 메시지를 살리면 ${themeLabel}에서 흐름이 나아갈 수 있지만, 한두 번의 선택으로 바뀌는 게 아니라 꾸준함이 필요하다는 점을 염두에 두세요.`,
    },
    {
      icon: '📿',
      title: `사주 풀이 — 과거·현재·미래 (${displayName}님)`,
      content:
        `【과거】 ${ilganInfo.char}${ilganInfo.ohang} ${zodiacName}띠인 ${displayName}님의 과거는 ${sajuPastIlgan} ` +
        `${sajuPastZodiac} ${zodiacInfo} 그 성향이 지금의 감각과 판단에 영향을 주고 있어요. 장점이었던 부분이 상황에 따라 막힘으로 작용했을 수도 있으니, 그 경계를 알아두는 게 좋습니다.\n\n` +
        `【현재】 지금은 ${sajuPresentIlgan} 사주상 ${sajuPresentStrong} ${sajuPresentWeak} ` +
        `${themeLabel}에서 ${strongOhang}이 강하면 추진력은 있으나 조급해지기 쉽고, ${weakOhang}이 약하면 신중한 대신 움직임이 느릴 수 있어요. 둘 다 장단이 있으니 극단만 피하면 됩니다.\n\n` +
        `【미래】 ${sajuFutureIlgan} ${sajuFutureZodiac} ` +
        `일간 ${ilganInfo.char}${ilganInfo.ohang}의 ${ilganInfo.tendency}을(를) 살리되, 기대만 높이지 말고 단계별로 점검하면서 나아가는 편이 현실적으로 유리합니다.`,
    },
    {
      icon: '💜',
      title: '이번 주 해 볼 수 있는 한 가지',
      content: [
        `【타로】 과거 ${cards[0].name} — 반복하지 않을 점을 구체적으로 적어 보세요. 현재 ${cards[1].name} — "${meanings[1]}"를 ${themeLabel}에 적용할 때 "실제로 할 수 있는 행동" 하나만 골라 보세요. 미래 ${cards[2].name} — "${meanings[2]}" 방향을 목표로 삼되, 기대치를 낮추고 "이번 주 첫걸음"만 정하세요.\n\n`,
        `【사주】 ${ilganInfo.char}${ilganInfo.ohang} ${zodiacName}띠인 ${displayName}님은 ${ilganInfo.personality} 성향이라, ` +
        `${strongOhang}이 강하면 과한 추진은 자제하고, ${weakOhang}이 약하면 꾸준히 쌓는 방식을 선택하는 게 현실적입니다.\n\n`,
        `【실천】 이번 주 실행할 한 가지: ${actionExamples}. 무리하지 않는 범위에서, 한 가지만 확실히 해 보는 것을 권합니다.`,
      ].join(''),
    },
  ];

  const sajuSummary = `${ilganInfo.char}${ilganInfo.ohang} ${zodiacName}띠 · 年${pillars.year} 月${pillars.month} 日${pillars.day} 時${pillars.hour}`;

  return { themeLabel, cards: [...cards], sajuSummary, sections };
}

export function getInterpretation(
  question: string,
  cards: DrawnTarotCard[],
): { keyword: string; overall: string; qaItems: TarotQAItem[]; themeLabel?: string; cards?: DrawnTarotCard[]; interpretation?: string } {
  const meanings = cards.map((c) => getCardMeaning(c.name, c.isReversed));
  const dirLabel = (c: DrawnTarotCard) => (c.isReversed ? '역방향' : '정방향');

  const qaItems: TarotQAItem[] = [
    {
      title: `"${question}"에 대한 타로의 한 줄 답`,
      icon: '✨',
      answer: `${cards[0].name} → ${cards[1].name} → ${cards[2].name}의 흐름으로, 과거의 경험이 현재의 상태를 만들었고, 현재의 선택이 미래를 열어갑니다. ` +
        `핵심은 "${meanings[1]}"라는 메시지를 오늘 실천에 옮기는 것입니다.`,
    },
    {
      title: '과거 — 왜 지금 이런 고민이 생겼을까?',
      icon: '🌙',
      answer: `과거 카드 ${cards[0].name}(${dirLabel(cards[0])})가 "${meanings[0]}"를 전합니다. ` +
        `지나온 경험이 지금의 질문과 상황을 만들었습니다. 과거를 후회하기보다, 그 안에서 얻은 교훈을 정리해보세요. ` +
        `어떤 결정과 만남이 당신을 여기로 이끌었는지 돌아보면, 앞으로의 방향이 더 선명해집니다.`,
    },
    {
      title: '현재 — 지금 내게 가장 필요한 것은?',
      icon: '☀️',
      answer: `현재 카드 ${cards[1].name}(${dirLabel(cards[1])})는 "${meanings[1]}"를 가리킵니다. ` +
        `지금 이 순간, 이 메시지가 당신에게 가장 필요한 에너지입니다. 일상에서 의식적으로 품어보세요. ` +
        `현재의 마음가짐과 작은 행동이 미래의 결과를 결정합니다. 급하지 않게, 꾸준히 실천해보시길 권합니다.`,
    },
    {
      title: '미래 — 이대로 가면 어떻게 될까?',
      icon: '⭐',
      answer: `미래 카드 ${cards[2].name}(${dirLabel(cards[2])})는 "${meanings[2]}" 흐름을 예고합니다. ` +
        `타로의 미래는 고정된 운명이 아니라, 현재 선택이 이어질 때 펼쳐질 가능성입니다. ` +
        `당신의 의지와 행동이 결과를 더 밝게 만들 수 있음을 기억하세요.`,
    },
    {
      title: '오늘 할 수 있는 작은 실천 하나',
      icon: '📌',
      answer: `현재 카드(${cards[1].name})의 메시지를 바탕으로, 오늘 실행할 수 있는 구체적인 행동 하나를 정해보세요. ` +
        `예) 직관을 따라 해보고 싶었던 것 시작하기, 잠시 멈추고 주변 관계 돌아보기, 계획을 세우고 한 걸음 실행하기 등. ` +
        `과거 카드의 교훈은 반복을 피하는 데, 미래 카드의 방향은 목표를 세우는 데 활용하세요.`,
    },
    {
      title: '기억해야 할 마음가짐',
      icon: '💜',
      answer: `과거의 경험 → 현재의 메시지 → 미래의 가능성. 세 카드는 하나의 이야기로 이어집니다. ` +
        `조급하게 결과를 기대하기보다, 매일 작은 실행을 쌓는 쪽에 집중하세요. ` +
        `카드가 전하는 직관을 믿고, 당신만의 속도로 나아가는 것을 응원합니다. ✨`,
    },
  ];

  return {
    keyword: `"${question}"에 대한 타로의 답`,
    overall: `당신의 질문 "${question}"에 대해 3장의 카드(과거·현재·미래)가 답을 전합니다.`,
    qaItems,
  };
}

export function shuffleDeck<T>(deck: T[]): T[] {
  const arr = [...deck];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function drawTarotCards(count = 3): DrawnTarotCard[] {
  const shuffled = shuffleDeck(TAROT_DECK);
  return shuffled.slice(0, count).map((c) => ({
    ...c,
    isReversed: Math.random() > 0.5,
  }));
}

/** 특정 카드들을 제외하고 새 카드 1장 뽑기 (다시 뽑기용) */
export function drawSingleTarotCard(excludeIds: number[]): DrawnTarotCard {
  const excludeSet = new Set(excludeIds);
  const available = TAROT_DECK.filter((c) => !excludeSet.has(c.id));
  const picked = available[Math.floor(Math.random() * available.length)];
  return {
    ...picked,
    isReversed: Math.random() > 0.5,
  };
}
