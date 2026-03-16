/**
 * 십이지시(十二支時) — 하루 24시간을 2시간 단위 12구간으로 나눈 전통 시간법
 * 자(子)~해(亥)에 각각 시간대 대응. 시주(時柱) 계산에 사용.
 */

export type SibijisiBranch =
  | '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';

export interface SibijisiItem {
  branch: SibijisiBranch;
  /** 한자 地支 */
  char: string;
  /** 시간 구간 표시 (예: 11:31~13:30) */
  timeRange: string;
  /** 해당 구간 대표 시(0~23). 사주 시주 계산용 */
  hour: number;
}

/** 십이지시 12구간 (예시 이미지 기준: XX:31~(XX+2):30) */
export const SIBIJISI_LIST: SibijisiItem[] = [
  { branch: '자', char: '子', timeRange: '23:31~01:30', hour: 0 },
  { branch: '축', char: '丑', timeRange: '01:31~03:30', hour: 2 },
  { branch: '인', char: '寅', timeRange: '03:31~05:30', hour: 4 },
  { branch: '묘', char: '卯', timeRange: '05:31~07:30', hour: 6 },
  { branch: '진', char: '辰', timeRange: '07:31~09:30', hour: 8 },
  { branch: '사', char: '巳', timeRange: '09:31~11:30', hour: 10 },
  { branch: '오', char: '午', timeRange: '11:31~13:30', hour: 12 },
  { branch: '미', char: '未', timeRange: '13:31~15:30', hour: 14 },
  { branch: '신', char: '申', timeRange: '15:31~17:30', hour: 16 },
  { branch: '유', char: '酉', timeRange: '17:31~19:30', hour: 18 },
  { branch: '술', char: '戌', timeRange: '19:31~21:30', hour: 20 },
  { branch: '해', char: '亥', timeRange: '21:31~23:30', hour: 22 },
];

const BRANCH_TO_HOUR: Record<SibijisiBranch, number> = Object.fromEntries(
  SIBIJISI_LIST.map((item) => [item.branch, item.hour])
) as Record<SibijisiBranch, number>;

/**
 * 선택한 십이지시 지지(자~해)를 사주 계산용 HHMM 문자열로 변환.
 * 각 구간의 대표 시각 정시(00분) 기준.
 */
export function getBirthTimeHHMMFromSibijisi(branch: SibijisiBranch): string {
  const h = BRANCH_TO_HOUR[branch] ?? 12;
  return String(h).padStart(2, '0') + '00';
}

/** 지지 한글 키로 SibijisiItem 찾기 */
export function getSibijisiItem(branch: SibijisiBranch): SibijisiItem | undefined {
  return SIBIJISI_LIST.find((item) => item.branch === branch);
}
