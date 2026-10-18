export type Cheongan = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type Jiji = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';

export type CheonganHanja = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type JijiHanja = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

export type Ohaeng = '목' | '화' | '토' | '금' | '수';
export type OhaengHanja = '木' | '火' | '土' | '金' | '水';
export type EumYang = '양' | '음';

export type SipSin =
  | '비견'
  | '겁재'
  | '식신'
  | '상관'
  | '편재'
  | '정재'
  | '편관'
  | '정관'
  | '편인'
  | '정인';

export interface PillarData {
  gan: {
    hangul: Cheongan;
    hanja: CheonganHanja;
    ohaeng: Ohaeng;
    eumyang: EumYang;
    sipsin: SipSin | '일간(본인)';
  };
  ji: {
    hangul: Jiji;
    hanja: JijiHanja;
    ohaeng: Ohaeng;
    eumyang: EumYang;
    sipsin: SipSin;
    animal: string;
  };
}

export interface ManseryeokResult {
  birthDate: {
    solarYear: number;
    solarMonth: number;
    solarDay: number;
    solarHour?: number;
    solarMinute?: number;
    isLunar: boolean;
    isLeapMonth?: boolean;
    gender: 'male' | 'female';
    name: string;
    hasTime: boolean;
  };
  pillars: {
    year: PillarData;
    month: PillarData;
    day: PillarData;
    hour: PillarData | null; // null if time unknown
  };
  ilgan: {
    hangul: Cheongan;
    hanja: CheonganHanja;
    ohaeng: Ohaeng;
    eumyang: EumYang;
    keyword: string;
    title: string;
    description: string;
  };
  ilju: {
    hangul: string; // e.g. "갑자"
    hanja: string; // e.g. "甲子"
    animal: string; // e.g. "푸른 쥐"
    traits: string;
  };
  ohaengCounts: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  ohaengPercentages: {
    목: number;
    화: number;
    토: number;
    금: number;
    수: number;
  };
  dominantOhaeng: Ohaeng[];
  lackingOhaeng: Ohaeng[];
}

export interface SajuAnalysisReport {
  personality: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    advice: string;
  };
  wealth: {
    grade: '상' | '중상' | '중' | '노력형';
    style: string;
    timing: string;
    actionableTip: string;
  };
  career: {
    bestFields: string[];
    workStyle: string;
    growthPoint: string;
  };
  love: {
    style: string;
    compatibleTypes: string;
    relationshipAdvice: string;
  };
  currentYearFortune: {
    year: number; // 2026 etc
    title: string;
    flow: string;
    caution: string;
    opportunity: string;
  };
  kaewun: {
    luckyColors: string[];
    luckyNumber: string;
    luckyDirection: string;
    mindset: string;
  };
}

export interface SajuProfile {
  id: string;
  name: string;
  relation: string; // '본인' | '배우자' | '연인' | '가족' | '친구'
  gender: 'male' | 'female';
  isLunar: boolean;
  isLeapMonth: boolean;
  year: number;
  month: number;
  day: number;
  hasTime: boolean;
  timeSlot?: string;
  hour?: number;
  minute?: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
