/**
 * 사주(四柱) 천간지지 계산 및 상세 해석
 * 이름, 생년월일, 출생시간, 성별 기반
 *
 * 일주(일간) 기준: 자시(子時) 23시부터 다음 날로 인정하는 관행에 맞춤.
 * → 23:00~23:59 출생 시 다음 날 일주 적용 (다른 만세력·사주 사이트와 일치).
 */

const CHEONGAN = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const;  // 天干
const JIJI = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const;  // 地支
const GAPJA = [
  '갑자', '을축', '병인', '정묘', '무진', '기사', '경오', '신미', '임신', '계유',
  '갑술', '을해', '병자', '정축', '무인', '기묘', '경진', '신사', '임오', '계미',
  '갑신', '을유', '병술', '정해', '무자', '기축', '경인', '신묘', '임진', '계사',
  '갑오', '을미', '병신', '정유', '무술', '기해', '경자', '신축', '임인', '계묘',
  '갑진', '을사', '병오', '정미', '무신', '기유', '경술', '신해', '임자', '계축',
  '갑인', '을묘', '병진', '정사', '무오', '기미', '경신', '신유', '임술', '계해',
] as const;

/** 입춘일 근사 (연도별 2월 3~5일) */
function getIpchunDay(year: number): number {
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) return 4;
  return 3 + Math.floor((year - 2000) / 4) % 3;
}

/** 해당 날짜가 입춘 이전인지 */
function isBeforeIpchun(year: number, month: number, day: number): boolean {
  if (month < 2) return true;
  if (month > 2) return false;
  return day < getIpchunDay(year);
}

/** 해당 연도의 년주(年柱) 천간지지 인덱스 (입춘 기준) */
function getYearGanZhiIndex(year: number, month: number, day: number): number {
  const y = isBeforeIpchun(year, month, day) ? year - 1 : year;
  return ((y - 4) % 60 + 60) % 60;
}

/** 1월 1일부터 해당일까지의 일수 */
function getDayOfYear(year: number, month: number, day: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) daysInMonth[1] = 29;
  let sum = 0;
  for (let m = 0; m < month - 1; m++) sum += daysInMonth[m];
  return sum + day;
}

/** 날짜에 하루 더하기 (월·연말 넘김 처리). 일주는 자시 23시부터 다음 날로 보는 관행 반영용 */
function addOneDay(year: number, month: number, day: number): { y: number; m: number; d: number } {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const isLeap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  if (isLeap) daysInMonth[1] = 29;
  let d = day + 1;
  let m = month;
  let y = year;
  const maxDay = daysInMonth[m - 1];
  if (d > maxDay) {
    d = 1;
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return { y, m, d };
}

/** 일주(日柱) 인덱스: 1900-01-01 = 庚子(36) 기준 */
function getDayGanZhiIndex(year: number, month: number, day: number): number {
  const baseYear = 1900;
  let totalDays = 0;
  for (let y = baseYear; y < year; y++) {
    totalDays += (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 366 : 365;
  }
  totalDays += getDayOfYear(year, month, day) - 1;
  return (36 + totalDays) % 60;
}

/** 월주(月柱): 절기 간소화, 2월 인일~다음 2월 인일 전 */
function getMonthGanZhiIndex(year: number, month: number, day: number): number {
  const yearIndex = getYearGanZhiIndex(year, month, day);
  const yearStem = yearIndex % 10;
  const monthOffset = [2, 2, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1][month - 1];
  const stemTable: Record<number, number> = { 0: 2, 1: 4, 2: 6, 3: 8, 4: 0, 5: 2, 6: 4, 7: 6, 8: 8, 9: 0 };
  const mStem = (stemTable[yearStem] + monthOffset) % 10;
  const mBranch = (month + 1) % 12;
  return (mStem * 6 + Math.floor(mBranch / 2) + 60) % 60;
}

/** 시주: 甲己日甲子起, 乙庚日丙子起, 丙辛日戊子起, 丁壬日庚子起, 戊癸日壬子起 */
function calcHourPillar(dayGanIndex: number, hour: number): string {
  const dayStem = dayGanIndex % 10;
  const hourBranchIdx = hour === 23 || hour === 0 ? 0 : Math.floor((hour + 1) / 2) % 12;
  const startStem = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][dayStem];
  const hStem = (startStem + hourBranchIdx) % 10;
  return CHEONGAN[hStem] + JIJI[hourBranchIdx];
}

export interface SajuPillars {
  year: string;   // 年柱
  month: string;  // 月柱
  day: string;    // 日柱
  hour: string;   // 時柱
  yearIndex: number;
  monthIndex: number;
  dayIndex: number;
  hourIndex: number;
}

export function calcSajuPillarsCorrect(birthDate: string, birthTime: string): SajuPillars {
  const y = parseInt(birthDate.slice(0, 4), 10);
  const m = parseInt(birthDate.slice(4, 6), 10);
  const d = parseInt(birthDate.slice(6, 8), 10);
  const h = parseInt(birthTime.slice(0, 2), 10);

  const yearIdx = getYearGanZhiIndex(y, m, d);
  const monthIdx = getMonthGanZhiIndex(y, m, d);
  const dayForPillar = h >= 23 ? addOneDay(y, m, d) : { y, m, d };
  const dayIdx = getDayGanZhiIndex(dayForPillar.y, dayForPillar.m, dayForPillar.d);
  const hourStr = calcHourPillar(dayIdx, h);
  const hourBranchIdx = JIJI.indexOf(hourStr[1] as typeof JIJI[number]);
  const hourStemIdx = CHEONGAN.indexOf(hourStr[0] as typeof CHEONGAN[number]);
  const hourIdx = hourStemIdx * 6 + Math.floor(hourBranchIdx / 2);

  return {
    year: GAPJA[yearIdx],
    month: GAPJA[monthIdx],
    day: GAPJA[dayIdx],
    hour: hourStr,
    yearIndex: yearIdx,
    monthIndex: monthIdx,
    dayIndex: dayIdx,
    hourIndex: hourIdx % 60,
  };
}

const ILGAN_DESC: Record<string, { char: string; ohang: string; personality: string; tendency: string }> = {
  갑: { char: '甲', ohang: '木', personality: '큰 나무처럼 든든하고 리더십이 있으며, 정의롭고 당당한 성향', tendency: '뻗어나가는 상승 에너지' },
  을: { char: '乙', ohang: '木', personality: '풀과 꽃처럼 유연하고 배려심이 깊으며, 섬세하고 인내심이 강함', tendency: '곡선적으로 성장하는 에너지' },
  병: { char: '丙', ohang: '火', personality: '태양처럼 밝고 열정적이며, 카리스마 있고 사교적', tendency: '밝히고 활력 주는 에너지' },
  정: { char: '丁', ohang: '火', personality: '촛불처럼 따뜻하고 지적이며, 예리한 통찰력과 꼼꼼함', tendency: '은은히 빛나는 내면의 불꽃' },
  무: { char: '戊', ohang: '土', personality: '산과 대지처럼 안정적이고 신중하며, 믿음직하고 보수적', tendency: '쌓고 지키는 고정 에너지' },
  기: { char: '己', ohang: '土', personality: '밭과 논처럼 포용력 있고 부지런하며, 순하고 다정함', tendency: '길러내고 키우는 육성 에너지' },
  경: { char: '庚', ohang: '金', personality: '쇠와 칼처럼 단호하고 원칙적이며, 결단력과 의지가 강함', tendency: '채찍질하고 다듬는 에너지' },
  신: { char: '辛', ohang: '金', personality: '보석과 같이 섬세하고 완벽을 추구하며, 예민하고 고귀한 기품', tendency: '정제되고 날카로운 에너지' },
  임: { char: '壬', ohang: '水', personality: '바다와 강처럼 넓고 유연하며, 지혜롭고 포용적', tendency: '흐르고 담는 수렴 에너지' },
  계: { char: '癸', ohang: '水', personality: '비와 이슬처럼 순수하고 직관적이며, 예민하고 내면이 깊음', tendency: '스며들고 정화하는 에너지' },
};

const ZODIAC_NAMES: Record<string, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용', 사: '뱀',
  오: '말', 미: '양', 신: '원숭이', 유: '닭', 술: '개', 해: '돼지',
};

const ZODIAC_DESC: Record<string, string> = {
  자: '쥐띠: 총명하고 재물을 모으며, 기회를 잘 잡는 재주가 있습니다.',
  축: '소띠: 성실하고 인내심이 강하며, 묵묵히 나아가는 힘이 있습니다.',
  인: '호랑이띠: 용맹하고 리더십이 있으며, 도전을 두려워하지 않습니다.',
  묘: '토끼띠: 온순하고 배려심이 깊으며, 원만한 대인관계를 가집니다.',
  진: '용띠: 위엄 있고 야망이 있으며, 큰일을 이루려는 기개가 있습니다.',
  사: '뱀띠: 지혜롭고 신비로우며, 깊은 통찰력을 가집니다.',
  오: '말띠: 활동적이고 열정적이며, 자유를 추구합니다.',
  미: '양띠: 온화하고 창의적이며, 예술적 감성이 뛰어납니다.',
  신: '원숭이띠: 영리하고 재치 있으며, 순발력이 뛰어납니다.',
  유: '닭띠: 정확하고 꼼꼼하며, 자기관리가 철저합니다.',
  술: '개띠: 충성스럽고 의리 있으며, 정의감이 강합니다.',
  해: '돼지띠: 순수하고 풍요로우며, 인복이 두터운 편입니다.',
};

/** 일간별 재물운 제목 */
const WEALTH_TITLE: Record<string, string> = {
  갑: '대지를 밟고 올라가는 甲木의 재물 기둥', 을: '꽃 피우는 만큼 모이는 乙木의 재물',
  병: '태양이 비추는 곳에 재물이 모이는 丙火', 정: '은은히 타오르는 丁火의 재물 촛불',
  무: '산처럼 쌓이는 戊土의 확고한 재물', 기: '밭에서 자라는 己土의 결실 재물',
  경: '단단히 다듬어지는 庚金의 재물', 신: '보석처럼 갈고닦는 辛金의 재물',
  임: '강물처럼 흐르는 壬水의 재물', 계: '이슬처럼 모이는 癸水의 재물',
};

/** 일간별 이중성 제목 */
const DUALITY_TITLE: Record<string, string> = {
  갑: '겉은 당당한 나무, 속은 여린 뿌리', 을: '겉은 유연한 풀, 속은 단단한 고집',
  병: '겉은 밝은 태양, 속은 깊은 그림자', 정: '겉은 은은한 불꽃, 속은 예리한 열기',
  무: '겉은 든든한 산, 속은 외로운 정상', 기: '겉은 순한 밭, 속은 굳은 결심',
  경: '겉은 단호한 강철, 속은 녹아드는 따뜻함', 신: '겉은 날카로운 보석, 속은 섬세한 마음',
  임: '겉은 넓은 바다, 속은 흐르는 고독', 계: '겉은 맑은 이슬, 속은 깊은 직관',
};

/** 월지(月支)별 직업운 제목 */
const JOB_TITLE: Record<string, string> = {
  자: '총명한 子月生, 숫자와 계약이 맞는 직업', 축: '인내의 丑月生, 꾸준함이 빛나는 분야',
  인: '봄바람 타고 오르는 寅月生의 리더십', 묘: '꽃 피우는 卯月生, 세상과 소통하는 일',
  진: '용이 하늘로 오르는 辰月生의 야망', 사: '지혜의 巳月생, 깊이 파는 전문가',
  오: '활달한 午月생, 현장과 무대가 천국', 미: '창의의 未月생, 예술과 감성이 빛나는 길',
  신: '재치의 申月생, 변통과 기획이 살길', 유: '정밀의 酉月생, 세밀함이武器인 직업',
  술: '충성의 戌月생, 팀과 신뢰가 핵심', 해: '인복의 亥月생, 사람이 모이는 분야',
};

/** 일지(日支=배우자궁)별 연애운 제목 */
const LOVE_TITLE: Record<string, string> = {
  자: '子支 배우자궁 — 총명한 인연, 깊은 신뢰가 열쇠', 축: '丑支 배우자궁 — 든든한 인연, 묵묵한 지킴이',
  인: '寅支 배우자궁 — 도전적인 인연, 함께 성장하는 사랑', 묘: '卯支 배우자궁 — 온화한 인연, 부드러운 이해',
  진: '辰支 배우자궁 — 위엄 있는 인연, 서로 끌어올리는 관계', 사: '巳支 배우자궁 — 지혜로운 인연, 깊은 통찰의 만남',
  오: '午支 배우자궁 — 열정적인 인연, 자유를 존중하는 사랑', 미: '未支 배우자궁 — 창의적 인연, 감성으로 통하는 관계',
  신: '申支 배우자궁 — 재치 있는 인연, 대화가 즐거운 만남', 유: '酉支 배우자궁 — 섬세한 인연, 서로를 다듬는 사랑',
  술: '戌支 배우자궁 — 충성스러운 인연, 의리가 지키는 관계', 해: '亥支 배우자궁 — 풍요로운 인연, 인복이 있는 결연',
};

/** 오행별 건강 제목 */
const HEALTH_TITLE: Record<string, string> = {
  '木': '木日干 — 간·눈·근육을 살피는 木의 건강',
  '火': '火日干 — 심장·순환·신경을 챙기는 火의 건강',
  '土': '土日干 — 비위·소화·면역을 지키는 土의 건강',
  '金': '金日干 — 폐·피부·호흡을 돌보는 金의 건강',
  '水': '水日干 — 신장·귀·뼈를 케어하는 水의 건강',
};

/** 월지·시지 조합별 용두사미/마무리 제목 */
function getMomentumTitle(monthBranch: string, hourBranch: string): string {
  const m = ZODIAC_NAMES[monthBranch] ?? monthBranch;
  const h = ZODIAC_NAMES[hourBranch] ?? hourBranch;
  const combos: Record<string, string> = {
    '자인': '子月 寅시 — 시작은 주저, 마무리에 돌진',
    '묘오': '卯月 午시 — 봄의 기운, 한여름에 꽃피우기',
    '진신': '辰月 申시 — 용의 기세, 원숭이의 변통으로 마침',
    '사유': '巳月 酉시 — 깊이 파고, 정교히 마무리',
    '오자': '午月 子시 — 열정으로 시작, 침착으로 마무리',
  };
  const key = monthBranch + hourBranch;
  if (combos[key]) return combos[key];
  return `${m}월 · ${h}시 — 시작과 마무리의 균형이 핵심`;
}

/** 띠+일간 조합 강점 제목 */
function getStrengthTitle(zodiacName: string, dayGan: string): string {
  const ganShort: Record<string, string> = {
    갑: '甲木', 을: '乙木', 병: '丙火', 정: '丁火', 무: '戊土', 기: '己土',
    경: '庚金', 신: '辛金', 임: '壬水', 계: '癸水',
  };
  const g = ganShort[dayGan] ?? dayGan;
  return `${zodiacName}띠 ${g} — 누구도 따라올 수 없는 숨은 무기`;
}

/** 일주·시주 오행에 따른 재물관리 제목 */
function getWealthManageTitle(weakOhang: string): string {
  const t: Record<string, string> = {
    '木': '木이 부족한 사주 — 재물은 오는데 나가는 구멍을 막아야',
    '火': '火가 부족한 사주 — 재물의 불꽃을 지켜야 할 때',
    '土': '土가 부족한 사주 — 재물을 쌓을 밑바탕이 필요',
    '金': '金이 부족한 사주 — 수입은 좋으나 관리가 관건',
    '水': '水가 부족한 사주 — 재물의 흐름을 가둬야 하는 형국',
  };
  return t[weakOhang] ?? '재물은 터졌으나 지갑을 지키는 습관이 필요';
}

export interface SajuQAItem {
  title: string;
  icon: string;
  answer: string;
}

export interface SajuAnalysisResult {
  keyword: string;
  overall: string;
  details?: Array<{ category: string; icon: string; content: string }>;
  advice?: string;
  qaItems?: SajuQAItem[];
  pillars?: SajuPillars;
}

/** 사주×타로용 컨텍스트 (타로 해석에 사주 반영) */
export interface SajuContextForTarot {
  displayName: string;
  pillars: SajuPillars;
  ilganInfo: { char: string; ohang: string; personality: string; tendency: string };
  zodiacInfo: string;
  zodiacName: string;
  strongOhang: string;
  weakOhang: string;
  dayGan: string;
}

export function buildSajuContextForTarot(
  name: string,
  birthDate: string,
  birthTime: string,
  _calendarType: 'solar' | 'lunar' = 'solar'
): SajuContextForTarot {
  const pillars = calcSajuPillarsCorrect(birthDate, birthTime);
  const displayName = name.trim() || '귀하';
  const yearBranch = pillars.year[1];
  const dayGan = pillars.day[0];
  const ilganInfo = ILGAN_DESC[dayGan] ?? ILGAN_DESC['갑'];
  const zodiacInfo = ZODIAC_DESC[yearBranch] ?? '';
  const zodiacName = ZODIAC_NAMES[yearBranch] ?? '';
  const ohangBalance = getOhangBalance(pillars);
  const strongOhang = Object.entries(ohangBalance).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '木';
  const weakOhang = Object.entries(ohangBalance).sort((a, b) => a[1] - b[1])[0]?.[0] ?? '水';
  return {
    displayName,
    pillars,
    ilganInfo,
    zodiacInfo,
    zodiacName,
    strongOhang,
    weakOhang,
    dayGan,
  };
}

/**
 * 천간(天干) 오행 — 표준 명리학 매핑
 * 甲·乙=木, 丙·丁=火, 戊·己=土, 庚·辛=金, 壬·癸=水
 */
const CHEONGAN_OHANG: Record<string, string> = {
  갑: '木', 을: '木', 병: '火', 정: '火', 무: '土', 기: '土', 경: '金', 신: '金', 임: '水', 계: '水',
};

/**
 * 지지(地支) 오행 — 표준 명리학 매핑
 * 子·亥=水, 丑·辰·未·戌=土, 寅·卯=木, 巳·午=火, 申·酉=金
 */
const JIJI_OHANG: Record<string, string> = {
  자: '水', 해: '水', 축: '土', 진: '土', 미: '土', 술: '土', 인: '木', 묘: '木', 사: '火', 오: '火', 신: '金', 유: '金',
};

/**
 * 사주 네 기둥(년·월·일·시) 전체의 오행 개수 집계.
 * 각 기둥마다 천간(첫 글자) + 지지(둘째 글자) 둘 다 오행으로 환산해 합산.
 */
function getOhangBalance(pillars: SajuPillars): Record<string, number> {
  const count: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  for (const p of [pillars.year, pillars.month, pillars.day, pillars.hour]) {
    const stem = CHEONGAN_OHANG[p[0]];
    const branch = JIJI_OHANG[p[1]];
    if (stem) count[stem] = (count[stem] || 0) + 1;
    if (branch) count[branch] = (count[branch] || 0) + 1;
  }
  return count;
}

export function getSajuAnalysis(
  name: string,
  birthDate: string,
  birthTime: string,
  gender: 'male' | 'female',
  calendarType: 'solar' | 'lunar' = 'solar'
): SajuAnalysisResult {
  // 음력 선택 시 API에서 변환 처리. 로컬 분석은 양력 기준으로 진행
  const pillars = calcSajuPillarsCorrect(birthDate, birthTime);
  const displayName = name.trim() || '귀하';
  const genderText = gender === 'male' ? '남성' : '여성';

  const yearBranch = pillars.year[1];
  const dayGan = pillars.day[0];
  const ilganInfo = ILGAN_DESC[dayGan] ?? ILGAN_DESC['갑'];
  const zodiacInfo = ZODIAC_DESC[yearBranch] ?? '';
  const ohangBalance = getOhangBalance(pillars);

  const y = parseInt(birthDate.slice(0, 4), 10);
  const m = parseInt(birthDate.slice(4, 6), 10);
  const d = parseInt(birthDate.slice(6, 8), 10);
  const calLabel = calendarType === 'lunar' ? '음력' : '양력';
  const birthStr = `${calLabel} ${y}년 ${m}월 ${d}일 ${birthTime.slice(0, 2)}:${birthTime.slice(2)}`;

  const keyword = `${displayName}님의 사주 — ${ilganInfo.ohang}일간 ${ilganInfo.char}${ilganInfo.ohang}`;
  const overall =
    `${displayName}님은 ${birthStr} 출생의 ${genderText}입니다.\n\n` +
    `【四柱八字】年柱 ${pillars.year} | 月柱 ${pillars.month} | 日柱 ${pillars.day} | 時柱 ${pillars.hour}\n` +
    `(일주는 자시 23시 기준으로 적용했습니다. 다른 만세력·사주 사이트와 동일한 기준입니다.)\n\n` +
    `일간(日干) ${ilganInfo.char}${ilganInfo.ohang}은 당신을 나타내는 기운입니다. 즉 오행(木火土金水) 중 ${ilganInfo.ohang}의 기운으로 태어나셨다고 보시면 되며, ${ilganInfo.personality}을(를) 지닙니다. ${zodiacInfo}`;

  const strongOhang = Object.entries(ohangBalance).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '木';
  const weakOhang = Object.entries(ohangBalance).sort((a, b) => a[1] - b[1])[0]?.[0] ?? '水';
  const monthBranch = pillars.month[1];
  const hourBranch = pillars.hour[1];
  const dayBranch = pillars.day[1];
  const zodiacName = ZODIAC_NAMES[yearBranch] ?? '';

  const dayBranchZodiac = ZODIAC_NAMES[dayBranch] ?? '';

  const ohangNames: Record<string, string> = { '木': '나무', '火': '불', '土': '흙', '金': '쇠', '水': '물' };
  const strongName = ohangNames[strongOhang] ?? strongOhang;
  const weakName = ohangNames[weakOhang] ?? weakOhang;

  const isWeakSameAsIlgan = weakOhang === ilganInfo.ohang;
  const ilganOhangExplain =
    `일간(日干) ${ilganInfo.char}${ilganInfo.ohang}은 당신을 나타내는 기운이에요. 즉 ${displayName}님은 오행 중 ${ilganInfo.ohang}(${ohangNames[ilganInfo.ohang] ?? ilganInfo.ohang})의 기운으로 태어나셨다고 보시면 됩니다. ` +
    `${ilganInfo.personality}을(를) 지니시는 이유입니다. `;
  const balanceExplain =
    isWeakSameAsIlgan
      ? `다만 사주 네 기둥(年·月·日·時) 전체에 들어 있는 오행 개수를 보면, ${weakOhang}(${weakName})이 다른 오행에 비해 상대적으로 적게 들어 있는 편입니다. ` +
        `당신 자체는 ${ilganInfo.ohang} 기운이시지만, 사주 전반의 조력(다른 기둥들) 속에서 ${weakName}이 적어 균형상 ${weakName}을 보강하면 좋다는 뜻이에요. `
      : `사주 네 기둥(年·月·日·時) 전체를 보면 ${strongOhang}(${strongName})이 우세하고, ${weakOhang}(${weakName})이 상대적으로 적은 편입니다. `;

  const qaItems: SajuQAItem[] = [
    {
      title: `${displayName}님, ${getOhangFormulation(strongOhang, weakOhang)}`,
      icon: '🔥',
      answer:
        `사주에서 오행(木火土金水)은 나무·불·흙·쇠·물 다섯 가지 기운을 말합니다. 여기서 반드시 구분할 것이 있어요.\n\n` +
        `【당신을 나타내는 기운 — 일간】 ${ilganOhangExplain}` +
        `${zodiacInfo}\n\n` +
        `【네 기둥 전체의 균형】 ${balanceExplain}` +
        `그래서 ${strongName} 기운이 지나치면 조절이, ${weakName}이 부족한 쪽은 일상 습관·계절 음식·방위·색채 등으로 보강하면 균형이 잡힙니다.`,
    },
    {
      title: `${displayName}님의 ${WEALTH_TITLE[dayGan] ?? '재물운'}`,
      icon: '📦',
      answer:
        `년주(년 기둥) ${pillars.year}과 일주 ${pillars.day}의 관계를 보면, ${displayName}님은 돈이 들어오는 통로가 있는 사주입니다. 다만 수입만큼 지출도 따라오는 형국이라, 흐름을 잘 제어하는 것이 재물을 지키는 핵심이에요. ` +
        `일간 ${ilganInfo.char}${ilganInfo.ohang}은 ${ilganInfo.tendency} 성향이라 기회를 포착하는 감각은 좋은 편입니다. ` +
        `적극적으로 권할 습관은 세 가지예요. 첫째, 월급·수입이 들어오는 즉시 일부를 별도 통장으로 옮기는 격리 저축. 둘째, 분기마다 구독·통신비 같은 고정비를 점검해 불필요한 지출을 줄이기. 셋째, 부수입이나 투자 기회는 기다리되, 여유 자금은 일단 단기 예·적금에 두고 천천히 판단하기. ` +
        `상반기에는 계획적 지출, 하반기에는 부수입·투자 기회를 놓치지 않는 타이밍 감각이 좋습니다.`,
    },
    {
      title: `${displayName}님, ${getMomentumTitle(monthBranch, hourBranch)}`,
      icon: '✈️',
      answer:
        `월주(월 기둥) ${pillars.month}는 일을 시작할 때의 기운, 시주(시 기둥) ${pillars.hour}는 끝맺을 때의 풍토를 보여줍니다. ` +
        `${displayName}님은 ${ilganInfo.personality} 성향이라, 초반에 열정이 크지만 마감 구간에서 정리가 더딘 패턴이 있을 수 있어요. 여러 일에 손을 대다가 마감 직전에 몰리는 경우, 스케줄 관리가 중요합니다. ` +
        `대형 프로젝트나 시험·면접 준비는 반으로 나누고, 중간에 ‘여기까지 완료’ 체크포인트를 두는 방식을 추천해요. ` +
        `시작의 에너지는 그대로 살리되, 마지막 10%에 힘을 더 쏟는 습관이 실제 성과로 이어집니다. ${ilganInfo.tendency}을(를) 알고 활용하면, 완결력이 눈에 띄게 올라갑니다.`,
    },
    {
      title: `${displayName}님의 ${getStrengthTitle(zodiacName, dayGan)}`,
      icon: '💫',
      answer:
        `${zodiacName}띠와 일간 ${ilganInfo.char}${ilganInfo.ohang}의 조합은, ${displayName}님만의 강점을 만들어냅니다. ` +
        `${zodiacInfo} ${ilganInfo.tendency}과(와) 맞물려 직관, 순발력, 사람을 읽는 감각이 뛰어나요. ` +
        `새로운 환경에 빨리 적응하고, 말로 풀기 어려운 분위기나 상대의 의도를 어느 정도 파악하는 능력이 있습니다. ` +
        `이 장점이 돋보이는 순간은 아이디어 회의, 협상, 첫만남, 창작·기획 업무, 팀 리드나 프로젝트 기획이에요. ` +
        `숫자·규칙 중심의 일보다 유연성과 소통이 중요한 분야에서 두각을 나타낼 수 있습니다. 이 에너지를 믿고 자신 있게 앞에 나서 보세요.`,
    },
    {
      title: `${displayName}님, ${DUALITY_TITLE[dayGan] ?? '겉과 속의 이중성'}`,
      icon: '😊',
      answer:
        `일간 ${ilganInfo.char}${ilganInfo.ohang}과 시주 ${pillars.hour}의 조합은, 겉과 속이 조금 다른 이중성을 보여줍니다. ` +
        `겉으로는 부드럽고 사교적·유연해 보이지만, 속에서는 기준이 확고하거나 깊은 고민·철학을 품고 있을 수 있어요. ` +
        `${zodiacInfo} 이런 성향이라 사람들과 어울리다가도, 실제로는 혼자만의 시간이 에너지를 충전하는 데 꼭 필요합니다. ` +
        `에너지가 떨어질 때는 맞춰주기만 하지 말고, 일기나 메모로 생각을 정리하거나, 내 선을 지키는 여유를 두는 것이 좋아요. ` +
        `겉의 유연함과 속의 확고함 모두 ${displayName}님의 자산이니, 무리하게 하나만 내세우지 않아도 됩니다.`,
    },
    {
      title: `${displayName}님의 ${JOB_TITLE[monthBranch] ?? '직업운'}`,
      icon: '👜',
      answer:
        `월주 ${pillars.month}는 직업·사회생활의 기운을 나타냅니다. ${displayName}님은 원칙과 규칙만 있는 일보다, 현장·대인관계·변화가 있는 일이 잘 맞아요. ` +
        `일간 ${ilganInfo.char}${ilganInfo.ohang}은 ${ilganInfo.personality} 성향이라, 데스크에만 앉아 있기보다 밖으로 나가 만나고, 협력하고, 실무에서 움직이는 환경에서 역량이 더 잘 드러납니다. ` +
        `${zodiacInfo} ` +
        `구체적으로는 영업, 마케팅, 컨설팅, 크리에이티브, 스타트업, 프리랜서처럼 외부 미팅·협업 비중이 큰 직무가 어울립니다. ` +
        `지금 하시는 일이 있다면, 회의·대외 활동·네트워킹 비중을 늘려보는 것도 좋은 방향입니다.`,
    },
    {
      title: `${displayName}님, ${getWealthManageTitle(weakOhang)}`,
      icon: '🔗',
      answer:
        (isWeakSameAsIlgan
          ? `일간이 ${ilganInfo.ohang}이시므로 당신은 ${ohangNames[ilganInfo.ohang]}의 기운이에요. 다만 사주 네 기둥 전체의 오행 균형을 보면 ${weakOhang}(${weakName})이 상대적으로 적은 편이라, 재물 흐름을 잡을 때 보강이 도움이 됩니다. `
          : `일주 ${pillars.day}와 시주 ${pillars.hour}를 포함해 사주 전반의 오행을 보면, ${weakOhang}(${weakName})이 상대적으로 적은 형국입니다. `) +
        `돈이 들어오는 통로는 있지만, 계획 없이 흐르기만 하면 나가는 쪽이 더 커질 수 있어요. 비상금·저축·투자 계획이 없으면 유출되기 쉽습니다. ` +
        `추천하는 관리법은 세 가지예요. 첫째, 월급의 10~20%를 입금 즉시 별도 통장으로 자동 이체하기. 둘째, 통신비·구독료 등 고정비를 정기적으로 점검해 줄이기. 셋째, 큰 지출 전 24시간 대기 규칙을 두어 충동 소비를 줄이기. ` +
        `이 세 가지 습관만으로도 재물이 더 단단히 쌓이기 시작합니다.`,
    },
    {
      title: LOVE_TITLE[dayBranch] ? `${displayName}님 — ${LOVE_TITLE[dayBranch]}` : `${displayName}님의 연애운`,
      icon: '💕',
      answer:
        `일지(日支) ${pillars.day}는 배우자궁이라, 인연과 결혼의 스타일을 보여줍니다. ${dayBranchZodiac}띠 기운이 들어 있어, 인연의 톤과 상대 유형에 영향을 줘요. ` +
        `${displayName}님은 감정을 소중히 여기고 상대를 이해하려는 태도가 있어, 오래 가는 관계를 만들 수 있는 성향입니다. ` +
        `${zodiacInfo} ` +
        `급하게 결혼을 재촉하기보다, 신뢰를 먼저 쌓은 뒤 천천히 결정하는 흐름이 유리해요. 서로의 속도를 존중하고, 말과 행동으로 마음을 전하는 것을 아끼지 마세요. ` +
        `만남의 장소·분위기보다, 함께 있을 때 편안함을 느끼는 사람을 만나는 게 좋습니다.`,
    },
    {
      title: `${displayName}님, ${HEALTH_TITLE[ilganInfo.ohang] ?? '오행과 건강'}`,
      icon: '🍀',
      answer:
        `일간 ${ilganInfo.char}${ilganInfo.ohang}(${ilganInfo.ohang})은 당신을 나타내는 기운이므로, ${displayName}님은 ${ilganInfo.ohang}(${ohangNames[ilganInfo.ohang] ?? ilganInfo.ohang})의 기운으로 태어나셨고, 이에 연결된 장부·기관을 특히 챙기시면 좋아요. ` +
        `오행 균형상 사주 전반에서 ${strongOhang}이 지나치면 절제가, ${weakOhang}이 상대적으로 적으면 그 방향으로 보강이 도움이 됩니다. ` +
        `(木은 간·눈·근육, 火는 심장·순환·신경, 土는 비위·소화·면역, 金은 폐·피부·호흡, 水는 신장·귀·뼈와 연결됩니다.) ` +
        `추천 습관은 수면 패턴 고정, 계절에 맞는 식단(찬 음식·과식 주의), 스트레스 해소 루틴(산책·호흡·명상 등)입니다. ` +
        `과로와 밤샘을 자주 하면 면역이 떨어지기 쉬우니, 분기마다 건강검진으로 점검받는 습관을 들이시면 좋습니다.`,
    },
  ];

  return {
    keyword,
    overall,
    qaItems,
    pillars,
  };
}

function getOhangFormulation(_strong: string, weak: string): string {
  const list = [
    '무성한 나무들 사이에 홀로 서 있는 한 그루',
    '이글거리는 불꽃 속에 고립된 소중한 물 한 방울',
    '메마른 대지 위에 홀로 피어난 꽃',
    '바람과 물결에 휩쓸리는 바다 위의 배',
    '넘치는 불 속에 녹아내리는 강철',
  ];
  const idx = { '\u6728': 0, '\u706B': 1, '\u571F': 2, '\u91D1': 3, '\u6C34': 4 }[weak];
  return idx !== undefined ? list[idx] : list[1];
}
