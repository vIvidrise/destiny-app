/**
 * 연애 궁합 · 직장 궁합 분석
 */

import { calcSajuPillarsCorrect, type SajuPillars } from './sajuLogic';

export interface SajuQAItem {
  title: string;
  icon: string;
  answer: string;
}

const OHANG: Record<string, string> = {
  갑: '木', 을: '木', 병: '火', 정: '火', 무: '土', 기: '土', 경: '金', 신: '金', 임: '水', 계: '水',
};
const JIJI_OHANG: Record<string, string> = {
  자: '水', 축: '土', 인: '木', 묘: '木', 진: '土', 사: '火', 오: '火', 미: '土', 신: '金', 유: '金', 술: '土', 해: '水',
};
const ZODIAC_NAMES: Record<string, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용', 사: '뱀',
  오: '말', 미: '양', 신: '원숭이', 유: '닭', 술: '개', 해: '돼지',
};

function getOhang(char: string): string {
  return OHANG[char[0]] ?? JIJI_OHANG[char[1]] ?? '';
}

/** 오행 상생: 木→火→土→金→水→木 */
function getOhangRelation(a: string, b: string): '생' | '극' | '동일' | '없음' {
  const order = ['木', '火', '土', '金', '水'];
  const ai = order.indexOf(a);
  const bi = order.indexOf(b);
  if (ai === -1 || bi === -1) return '없음';
  if (a === b) return '동일';
  if ((ai + 1) % 5 === bi) return '생'; // a가 b를 생
  if ((bi + 1) % 5 === ai) return '생'; // b가 a를 생
  if ((ai + 2) % 5 === bi) return '극'; // 상극
  if ((bi + 2) % 5 === ai) return '극';
  return '없음';
}

/** 연애 궁합 분석 */
export function getLoveCompatibilityAnalysis(
  myName: string,
  myBirthDate: string,
  myBirthTime: string,
  myGender: 'male' | 'female',
  partnerName: string,
  partnerBirthDate: string,
  partnerBirthTime: string,
  partnerGender: 'male' | 'female'
): { keyword: string; overall: string; qaItems: SajuQAItem[] } {
  const myP = calcSajuPillarsCorrect(myBirthDate, myBirthTime);
  const ptP = calcSajuPillarsCorrect(partnerBirthDate, partnerBirthTime);
  const me = myName.trim() || '나';
  const pt = partnerName.trim() || '상대';

  const myDayGan = myP.day[0];
  const ptDayGan = ptP.day[0];
  const myDayBranch = myP.day[1];
  const ptDayBranch = ptP.day[1];
  const myOhang = getOhang(myDayGan);
  const ptOhang = getOhang(ptDayGan);
  const rel = getOhangRelation(myOhang, ptOhang);

  const keyword = `${me} × ${pt} — 천생연분일까, 찰나의 인연일까?`;
  const overall =
    `${me}님(年${myP.year} 月${myP.month} 日${myP.day} 時${myP.hour})과 ` +
    `${pt}님(年${ptP.year} 月${ptP.month} 日${ptP.day} 時${ptP.hour})의 깊은 궁합을 분석합니다.`;

  const qaItems: SajuQAItem[] = [
    {
      title: '한눈에 보는 궁합 요약 — 천생연분? 찰나의 인연?',
      icon: '💞',
      answer:
        `${me}님의 일간 ${myP.day[0]}(${myOhang})과 ${pt}님의 일간 ${ptP.day[0]}(${ptOhang})은 오행상 ${rel === '생' ? '상생(相生)' : rel === '극' ? '상극(相剋)' : rel === '동일' ? '동일오행' : '중성'} 관계입니다. ` +
        (rel === '생'
          ? `상생은 서로 에너지를 북돋우는 조합으로, 깊은 이해와 신뢰가 쌓이기 좋습니다. 천생연분에 가까운 궁합입니다.`
          : rel === '극'
          ? `상극은 때로 긴장감과 반등이 있지만, 서로를 다듬는 관계가 됩니다. 이해와 타협이 중요해요.`
          : `동일 오행은 비슷한 성향으로 끌리지만, 때로는 싸움도 있을 수 있어요. 개인 시간을 존중하는 것이 핵심입니다.`),
    },
    {
      title: `${me}님의 배우자궁(일지) — ${pt}님이 채워주는 것`,
      icon: '🌙',
      answer:
        `${me}님의 일지(日支) ${myDayBranch}(${ZODIAC_NAMES[myDayBranch] ?? ''}띠 기운)는 배우자궁입니다. ` +
        `${pt}님의 일간 ${ptP.day}이(가) 이 자리를 어떻게 채우는지가 중요해요. ` +
        `${pt}님은 ${me}님이 ` +
        (['자', '인'].includes(myDayBranch) ? '직관과 영감' : ['축', '미', '술'].includes(myDayBranch) ? '안정과 성실' : ['오', '사'].includes(myDayBranch) ? '열정과 활동' : '소통과 조화') +
        `를 더할 수 있는 에너지를 가져다줍니다. 두 사주의 시주(時柱)가 조화를 이루면 장기적인 인연으로 이어지기 좋습니다.`,
    },
    {
      title: `${pt}님의 배우자궁 — ${me}님이 채워주는 것`,
      icon: '☀️',
      answer:
        `${pt}님의 일지 ${ptDayBranch}(${ZODIAC_NAMES[ptDayBranch] ?? ''}띠 기운)는 ${pt}님의 배우자궁입니다. ` +
        `${me}님의 일간 ${myP.day}이(가) ${pt}님에게 ` +
        (['자', '해'].includes(ptDayBranch) ? '지혜와 깊이' : ['인', '묘'].includes(ptDayBranch) ? '성장과 희망' : '안정과 신뢰') +
        `를 더해 줍니다. ` +
        `년주(年柱)끼리의 띠 조합(${ZODIAC_NAMES[myP.year[1]] ?? ''}띠 × ${ZODIAC_NAMES[ptP.year[1]] ?? ''}띠)은 첫인상과 외적 끌림을, 일주는 깊은 마음의 궁합을 나타냅니다.`,
    },
    {
      title: '오행 극·생과 관계의 조화',
      icon: '🔥',
      answer:
        `${myOhang}과(와) ${ptOhang}의 조합은 ` +
        (rel === '생'
          ? `木生火·火生土·土生金·金生水·水生木 중 하나로, ${me}님과 ${pt}님이 서로를 키워 주는 관계입니다.`
          : rel === '극'
          ? `상극이지만, 오히려 서로의 부족한 면을 자극해 성장하게 만듭니다. 다만 말과 행동에 서로를 배려하는 노력이 필요해요.`
          : `비슷한 기운이라 이해는 빠르나, 다툼 시 양보가 필요합니다.`) +
        ` 월주(月柱)와 시주(時柱)까지 보면 더 정교한 궁합이 나오지만, 핵심은 두 사람의 일주(日柱)입니다.`,
    },
    {
      title: '이 관계가 오래가려면',
      icon: '💜',
      answer:
        `${me}님과 ${pt}님은 ` +
        (rel === '생'
          ? `상생 궁합이라 기본적으로 잘 맞습니다. 다만 서로 당연시하지 말고, 작은 말과 행동으로 감사함을 표현하세요.`
          : rel === '극'
          ? `상극이라 때로 말다툼이 있을 수 있어요.냉정하게 대화할 시간을 갖고, 상대의 입장을 먼저 들어주는 습관이 관계를 오래 가게 합니다.`
          : `비슷한 성향이라 편하지만 지루해질 수 있어요. 함께 새로운 경험을 만들고, 서로의 차이를 존중하세요.`) +
        ` 사주는 가이드일 뿐, 실제 관계는 두 사람의 선택과 노력이 더 큽니다. ✨`,
    },
  ];

  return { keyword, overall, qaItems };
}

/** 회사명 → 오행 변환 (간단 휴리스틱) */
function companyToOhang(companyName: string): string {
  const s = (companyName || '').replace(/\s/g, '');
  if (!s) return '土';
  const code = s.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const idx = code % 5;
  return ['木', '火', '土', '金', '水'][idx];
}

/** 직장 궁합 분석 */
export function getWorkCompatibilityAnalysis(
  myName: string,
  myBirthDate: string,
  myBirthTime: string,
  calendarType: 'solar' | 'lunar',
  companyName: string
): { keyword: string; overall: string; qaItems: SajuQAItem[] } {
  const pillars = calcSajuPillarsCorrect(myBirthDate, myBirthTime);
  const me = myName.trim() || '나';
  const company = (companyName || '').trim() || '(회사명)';

  const dayGan = pillars.day[0];
  const monthBranch = pillars.month[1];
  const myJobOhang = getOhang(monthBranch) || getOhang(dayGan);
  const compOhang = companyToOhang(company);
  const rel = getOhangRelation(myJobOhang, compOhang);

  const scoreText =
    rel === '생' ? '85~95점 — 찰떡 지수 매우 높음' : rel === '동일' ? '70~85점 — 궁합 양호' : rel === '극' ? '50~70점 — 보완 필요' : '60~75점 — 보통';

  const keyword = `${me}님 × ${company} — 업무 성향 궁합`;
  const overall =
    `${me}님의 사주(年${pillars.year} 月${pillars.month} 日${pillars.day} 時${pillars.hour})와 ` +
    `"${company}"의 에너지(오행 ${compOhang})를 비교한 직장 궁합 분석입니다.`;

  const qaItems: SajuQAItem[] = [
    {
      title: `찰떡 지수 — ${company}와의 궁합`,
      icon: '🤝',
      answer:
        `${me}님의 월주(月柱) ${pillars.month}은(는) 직업운을 나타내며, ${myJobOhang}의 기운을 가집니다. ` +
        `"${company}"는 ${compOhang} 에너지가 강한 조직으로 분석됩니다. ` +
        `궁합: ${scoreText}. ` +
        (rel === '생'
          ? `상생 관계로, 이 회사에서 ${me}님의 역량이 잘 발휘되고 인정받기 좋은 환경입니다.`
          : rel === '극'
          ? `상극일 수 있어 업무 스타일 차이가 있을 수 있습니다. 하지만 다양한 시각이 모여 오히려 시너지를 낼 수도 있어요.`
          : `비슷한 기운이라 작업 방식이 잘 맞을 가능성이 높습니다.`),
    },
    {
      title: '나의 업무 성향 — 월주(月柱)가 말하는 것',
      icon: '📋',
      answer:
        `월주 ${pillars.month} (${ZODIAC_NAMES[monthBranch] ?? ''}월 기운)은 ${me}님의 직장·업무 성향을 나타냅니다. ` +
        (['인', '묘'].includes(monthBranch)
          ? `봄 기운 — 창의적이고 시작을 잘하며, 새로운 프로젝트와 기획에 강합니다.`
          : ['사', '오'].includes(monthBranch)
          ? `여름 기운 — 열정적이고 추진력이 있으며, 팀을 이끄는 역할에 적합합니다.`
          : ['신', '유'].includes(monthBranch)
          ? `가을 기운 — 정밀하고 분석적이며, 전략·정리·마무리에 강합니다.`
          : `겨울·토 기운 — 인내심 있고 꾸준하며, 안정적 운영과 유지보수에 적합합니다. `) +
        `이 성향이 "${company}"의 업무 방식과 맞으면 시너지가 납니다.`,
    },
    {
      title: `"${company}"와 맞는 업무 스타일`,
      icon: '🏢',
      answer:
        `회사명 "${company}"는 ${compOhang} 오행으로 해석됩니다. ` +
        (compOhang === '木'
          ? `木 — 성장·창의·유연함을 중시하는 조직. 아이디어와 변화를 환영하는 문화일 수 있어요.`
          : compOhang === '火'
          ? `火 — 열정·속도·외부 활동을 중시. 프로모션, 영업, 마케팅 분야가 잘 맞을 수 있어요.`
          : compOhang === '土'
          ? `土 — 안정·신뢰·인프라를 중시. 꾸준함과 성실함이 인정받는 조직입니다.`
          : compOhang === '金'
          ? `金 — 원칙·정밀·규율을 중시. 데이터, 재무, 품질 관리 등에 강점이 있는 회사.`
          : `水 — 지혜·유연·전략을 중시. 기획, 분석, 연구 개발 분야가 어울립니다.`) +
        ` ${me}님의 월주와 맞으면 업무 적응이 빠릅니다.`,
    },
    {
      title: '이 회사에서 잘하려면',
      icon: '💡',
      answer:
        (rel === '생'
          ? `${me}님과 "${company}"는 궁합이 좋습니다. 자신감을 갖고 적극적으로 일하세요. ` + `다만 과한 확신은 금물. 겸손하게 팀과 협력하세요.`
          : rel === '극'
          ? `${me}님과 "${company}"의 업무 스타일 차이가 있을 수 있어요. ` + `회사 문화를 먼저 파악하고, 자신의 강점은 유지하면서 조직에 맞는 소통 방식을 찾으세요.`
          : `${me}님의 성향이 "${company}"와 어느 정도 맞습니다. ` +
            `빠른 적응과 꾸준한 성과가 핵심입니다. 좋은 인연을 만나면 더 잘 풀릴 수 있어요.`) +
        ` 사주는 가이드일 뿐, 실제 적응은 ${me}님의 노력이 더 중요합니다.`,
    },
  ];

  return { keyword, overall, qaItems };
}
