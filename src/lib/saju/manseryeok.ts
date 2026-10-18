import KoreanLunarCalendar from 'korean-lunar-calendar';
import {
  Cheongan,
  CheonganHanja,
  Jiji,
  JijiHanja,
  Ohaeng,
  EumYang,
  SipSin,
  PillarData,
  ManseryeokResult,
} from './types';

export const CHEONGAN: Cheongan[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const CHEONGAN_HANJA: CheonganHanja[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const CHEONGAN_OHAENG: Ohaeng[] = ['목', '목', '화', '화', '토', '토', '금', '금', '수', '수'];
export const CHEONGAN_EUMYANG: EumYang[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];

export const JIJI: Jiji[] = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
export const JIJI_HANJA: JijiHanja[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const JIJI_ANIMALS = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
export const JIJI_OHAENG: Ohaeng[] = ['수', '토', '목', '목', '토', '화', '화', '토', '금', '금', '토', '수'];
export const JIJI_EUMYANG: EumYang[] = ['양', '음', '양', '음', '양', '음', '양', '음', '양', '음', '양', '음'];

// 오행 생극 관계
// 목생화, 화생토, 토생금, 금생수, 수생목
const GENERATES: Record<Ohaeng, Ohaeng> = {
  목: '화',
  화: '토',
  토: '금',
  금: '수',
  수: '목',
};

// 목극토, 토극수, 수극화, 화극금, 금극목
const OVERCOMES: Record<Ohaeng, Ohaeng> = {
  목: '토',
  토: '수',
  수: '화',
  화: '금',
  금: '목',
};

// 십신(육친) 계산 함수
export function calculateSipSin(
  targetOhaeng: Ohaeng,
  targetEumyang: EumYang,
  dayOhaeng: Ohaeng,
  dayEumyang: EumYang
): SipSin {
  const isSamePolarity = targetEumyang === dayEumyang;

  // 비견 / 겁재 (오행이 같음)
  if (targetOhaeng === dayOhaeng) {
    return isSamePolarity ? '비견' : '겁재';
  }

  // 식신 / 상관 (내가 생함: dayOhaeng -> targetOhaeng)
  if (GENERATES[dayOhaeng] === targetOhaeng) {
    return isSamePolarity ? '식신' : '상관';
  }

  // 편재 / 정재 (내가 극함: dayOhaeng -> targetOhaeng)
  if (OVERCOMES[dayOhaeng] === targetOhaeng) {
    return isSamePolarity ? '편재' : '정재';
  }

  // 편관 / 정관 (나를 극함: targetOhaeng -> dayOhaeng)
  if (OVERCOMES[targetOhaeng] === dayOhaeng) {
    return isSamePolarity ? '편관' : '정관';
  }

  // 편인 / 정인 (나를 생함: targetOhaeng -> dayOhaeng)
  if (GENERATES[targetOhaeng] === dayOhaeng) {
    return isSamePolarity ? '편인' : '정인';
  }

  return '비견';
}

// 24절기 중 12개 월령 절입일 계산 (1900~2099년)
interface SolarTermInfo {
  month: number;
  day: number;
}

export function getSolarTermDate(year: number, termIndex: number): SolarTermInfo {
  const is20th = year < 2000;
  // 12 절입: 0:소한(1월), 1:입춘(2월), 2:경칩(3월), 3:청명(4월), 4:입하(5월), 5:망종(6월),
  // 6:소서(7월), 7:입추(8월), 8:백로(9월), 9:한로(10월), 10:입동(11월), 11:대설(12월)
  const coeffs21 = [
    [1, 5.4055],   // 소한
    [2, 3.87],     // 입춘
    [3, 5.63],     // 경칩
    [4, 5.59],     // 청명
    [5, 6.318],    // 입하
    [6, 6.5],      // 망종
    [7, 7.928],    // 소서
    [8, 8.35],     // 입추
    [9, 8.44],     // 백로
    [10, 9.098],   // 한로
    [11, 8.218],   // 입동
    [12, 7.9],     // 대설
  ];
  const coeffs20 = [
    [1, 6.11],
    [2, 4.6295],
    [3, 6.3826],
    [4, 6.35],
    [5, 7.078],
    [6, 7.273],
    [7, 8.68],
    [8, 9.1],
    [9, 9.19],
    [10, 9.85],
    [11, 8.97],
    [12, 8.65],
  ];

  const table = is20th ? coeffs20 : coeffs21;
  const [month, c] = table[termIndex];
  const yr = year % 100;
  const val = yr * 0.2422 + c;
  const day = Math.floor(val) - Math.floor((yr - 1) / 4);
  return { month, day };
}

// 사주 연주 & 월주 계산 (절기 기준)
function calculateSajuYearAndMonth(solarYear: number, solarMonth: number, solarDay: number) {
  // 12 절기 날짜 계산
  const terms: { [key: number]: number } = {};
  for (let i = 0; i < 12; i++) {
    const t = getSolarTermDate(solarYear, i);
    terms[t.month] = t.day;
  }

  // 1. 연주(Year Pillar) 판단: 입춘(2월 절기) 이전이면 전년도 세차 적용
  const ipchunDay = terms[2] || 4;
  let sajuYear = solarYear;
  if (solarMonth < 2 || (solarMonth === 2 && solarDay < ipchunDay)) {
    sajuYear = solarYear - 1;
  }

  // 연간, 연지
  const yearIndex = (sajuYear - 4) % 60;
  const normalizedYearIndex = yearIndex >= 0 ? yearIndex : yearIndex + 60;
  const yearGan = normalizedYearIndex % 10;
  const yearJi = normalizedYearIndex % 12;

  // 2. 월주(Month Pillar) 판단: 12 절기 기준
  // 절입 기준 월령 지지:
  // 1월 소한전: 자월(11) / 소한후: 축월(1)
  // 2월 입춘전: 축월(1) / 입춘후: 인월(2)
  // 3월 경칩전: 인월(2) / 경칩후: 묘월(3)
  // ...
  let monthJi = 0;
  let monthOrderFromIn = 0; // 인월(0), 묘월(1), ... 축월(11)

  const curTermDay = terms[solarMonth];

  if (solarMonth === 1) {
    if (solarDay < curTermDay) {
      monthJi = 0; // 자월 (전년도 대설 이후)
      monthOrderFromIn = 10;
    } else {
      monthJi = 1; // 축월 (소한 이후)
      monthOrderFromIn = 11;
    }
  } else if (solarMonth === 2) {
    if (solarDay < curTermDay) {
      monthJi = 1; // 축월
      monthOrderFromIn = 11;
    } else {
      monthJi = 2; // 인월
      monthOrderFromIn = 0;
    }
  } else {
    // 3월 ~ 12월
    const baseJi = solarMonth - 1; // 3월은 묘(3), 4월은 진(4), ... 12월은 자(0)
    if (solarDay < curTermDay) {
      monthJi = (baseJi + 11) % 12;
      monthOrderFromIn = (solarMonth - 3 + 12) % 12;
    } else {
      monthJi = baseJi % 12;
      monthOrderFromIn = (solarMonth - 2) % 12;
    }
  }

  // 오호둔월법 (五虎遁月法)으로 월간 계산
  // 갑/기년 -> 병인월(2) 시작
  // 을/경년 -> 무인월(4) 시작
  // 병/신년 -> 경인월(6) 시작
  // 정/임년 -> 임인월(8) 시작
  // 무/계년 -> 갑인월(0) 시작
  const firstMonthGan = ((yearGan % 5) * 2 + 2) % 10;
  const monthGan = (firstMonthGan + monthOrderFromIn) % 10;

  return {
    yearGan,
    yearJi,
    monthGan,
    monthJi,
  };
}

// 시간(시주) 지지 인덱스 산출 (한국 표준시 30분 보정 기준 23:30~01:29 자시)
export function getHourBranchIndex(hour: number, minute: number = 0): number {
  const totalMinutes = hour * 60 + minute;
  // 23:30 (1410분) 이후이거나 01:30 (90분) 미만이면 자시(0)
  if (totalMinutes >= 1410 || totalMinutes < 90) return 0; // 자시
  if (totalMinutes < 210) return 1; // 축시 (01:30~03:29)
  if (totalMinutes < 330) return 2; // 인시 (03:30~05:29)
  if (totalMinutes < 450) return 3; // 묘시 (05:30~07:29)
  if (totalMinutes < 570) return 4; // 진시 (07:30~09:29)
  if (totalMinutes < 690) return 5; // 사시 (09:30~11:29)
  if (totalMinutes < 810) return 6; // 오시 (11:30~13:29)
  if (totalMinutes < 930) return 7; // 미시 (13:30~15:29)
  if (totalMinutes < 1050) return 8; // 신시 (15:30~17:29)
  if (totalMinutes < 1170) return 9; // 유시 (17:30~19:29)
  if (totalMinutes < 1290) return 10; // 술시 (19:30~21:29)
  return 11; // 해시 (21:30~23:29)
}

export const TIME_SLOTS = [
  { id: '0', label: '자시 (23:30 ~ 01:29)', hour: 0, branch: '자' },
  { id: '1', label: '축시 (01:30 ~ 03:29)', hour: 2, branch: '축' },
  { id: '2', label: '인시 (03:30 ~ 05:29)', hour: 4, branch: '인' },
  { id: '3', label: '묘시 (05:30 ~ 07:29)', hour: 6, branch: '묘' },
  { id: '4', label: '진시 (07:30 ~ 09:29)', hour: 8, branch: '진' },
  { id: '5', label: '사시 (09:30 ~ 11:29)', hour: 10, branch: '사' },
  { id: '6', label: '오시 (11:30 ~ 13:29)', hour: 12, branch: '오' },
  { id: '7', label: '미시 (13:30 ~ 15:29)', hour: 14, branch: '미' },
  { id: '8', label: '신시 (15:30 ~ 17:29)', hour: 16, branch: '신' },
  { id: '9', label: '유시 (17:30 ~ 19:29)', hour: 18, branch: '유' },
  { id: '10', label: '술시 (19:30 ~ 21:29)', hour: 20, branch: '술' },
  { id: '11', label: '해시 (21:30 ~ 23:29)', hour: 22, branch: '해' },
];

export const ILGAN_INFO: Record<
  Cheongan,
  { keyword: string; title: string; description: string }
> = {
  갑: {
    keyword: '큰 나무, 곧은 소나무, 개척자',
    title: '우뚝 솟은 큰 나무 (甲木)',
    description: '곧은 지조와 리더십을 지니며, 어떤 시련에도 굴하지 않고 주도적으로 새로운 길을 개척하는 당당한 기운입니다.',
  },
  을: {
    keyword: '화초, 덩굴, 유연한 생명력',
    title: '끈질긴 생명력의 화초 (乙木)',
    description: '어떤 환경에서도 적응하는 부드러운 유연함과 강한 생활력, 친화력으로 사람들의 마음을 얻는 기운입니다.',
  },
  병: {
    keyword: '태양, 빛, 열정, 솔직함',
    title: '온 세상을 밝히는 태양 (丙火)',
    description: '주위를 환하게 비추는 따뜻한 열정과 솔직함, 뒤끝 없는 당당함으로 사람들을 이끄는 밝은 에너지입니다.',
  },
  정: {
    keyword: '촛불, 달빛, 온기, 섬세함',
    title: '어둠을 밝히는 은은한 등불 (丁火)',
    description: '타인을 세심하게 배려하는 깊은 정과 헌신, 사물의 본질을 꿰뚫어 보는 예리한 통찰력을 품고 있습니다.',
  },
  무: {
    keyword: '거대한 산, 넓은 대지, 신뢰',
    title: '흔들림 없는 웅장한 큰 산 (戊土)',
    description: '묵묵히 만물을 품어주는 넓은 포용력과 듬직한 신뢰감, 중후한 뚝심으로 사람들에게 안식처가 되어줍니다.',
  },
  기: {
    keyword: '비옥한 옥토, 모성애, 포용',
    title: '곡식을 길러내는 기름진 흙 (己土)',
    description: '모두를 따뜻하게 보듬는 부드러운 배려와 실속, 꼼꼼함으로 조용히 자신의 결실을 가꾸어가는 기운입니다.',
  },
  경: {
    keyword: '원석, 강철, 결단력, 의리',
    title: '단단하고 강인한 강철 (庚金)',
    description: '불의를 참지 못하는 강한 의리와 확고한 소신, 맺고 끊음이 분명한 추진력과 결단력을 자랑합니다.',
  },
  신: {
    keyword: '보석, 예리한 칼날, 완벽주의',
    title: '섬세하게 빛나는 보석 (辛金)',
    description: '정교하고 예리한 감각, 높은 자존심과 깔끔한 미적 감각을 지닌 결점 없는 완성도를 추구하는 기운입니다.',
  },
  임: {
    keyword: '넓은 바다, 큰 호수, 지혜',
    title: '깊고 푸른 넓은 바다 (壬水)',
    description: '어디에나 흘러드는 유연한 지혜와 깊은 사고력, 큰 뜻을 품고 대범하게 세상을 품어 안는 큰 물의 기운입니다.',
  },
  계: {
    keyword: '단비, 맑은 샘물, 총명함',
    title: '만물을 적시는 촉촉한 봄비 (癸水)',
    description: '조용하고 총명한 직관력, 부드럽고 섬세한 감수성으로 사람들의 갈증을 채워주고 통찰을 건네는 기운입니다.',
  },
};

// 60일주 동물/특성 별칭 계산
const ILJU_ANIMALS: Record<Cheongan, string> = {
  갑: '푸른(청)',
  을: '푸른(청)',
  병: '붉은(적)',
  정: '붉은(적)',
  무: '누런(황)',
  기: '누런(황)',
  경: '하얀(백)',
  신: '하얀(백)',
  임: '검은(흑)',
  계: '검은(흑)',
};

// 메인 만세력 계산 함수
export function calculateManseryeok(input: {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
  isLunar: boolean;
  isLeapMonth?: boolean;
  gender: 'male' | 'female';
  name: string;
  hasTime: boolean;
}): ManseryeokResult {
  const cal = new KoreanLunarCalendar();
  let solarYear = input.year;
  let solarMonth = input.month;
  let solarDay = input.day;

  // 음력 입력인 경우 양력으로 변환
  if (input.isLunar) {
    const success = cal.setLunarDate(input.year, input.month, input.day, !!input.isLeapMonth);
    if (success) {
      const sol = cal.getSolarCalendar();
      solarYear = sol.year;
      solarMonth = sol.month;
      solarDay = sol.day;
    }
  } else {
    cal.setSolarDate(solarYear, solarMonth, solarDay);
  }

  // 1. 일주(Day Pillar) 계산 (연속 일진)
  const gapJaIndex = cal.getGapJaIndex();
  const dayGan = gapJaIndex.cheongan.day;
  const dayJi = gapJaIndex.ganji.day;

  const dayOhaeng = CHEONGAN_OHAENG[dayGan];
  const dayEumyang = CHEONGAN_EUMYANG[dayGan];

  // 2. 연주 & 월주 계산 (절기 기준)
  const { yearGan, yearJi, monthGan, monthJi } = calculateSajuYearAndMonth(
    solarYear,
    solarMonth,
    solarDay
  );

  // 3. 시주(Hour Pillar) 계산
  let hourGan: number | null = null;
  let hourJi: number | null = null;

  if (input.hasTime && input.hour !== undefined) {
    hourJi = getHourBranchIndex(input.hour, input.minute || 0);
    // 오서둔시법: (dayGan % 5 * 2 + hourJi) % 10
    hourGan = ((dayGan % 5) * 2 + hourJi) % 10;
  }

  // 기둥별 객체 생성
  const createPillar = (ganIdx: number, jiIdx: number, isDay: boolean = false): PillarData => {
    const gHangul = CHEONGAN[ganIdx];
    const gHanja = CHEONGAN_HANJA[ganIdx];
    const gOhaeng = CHEONGAN_OHAENG[ganIdx];
    const gEumyang = CHEONGAN_EUMYANG[ganIdx];

    const jHangul = JIJI[jiIdx];
    const jHanja = JIJI_HANJA[jiIdx];
    const jOhaeng = JIJI_OHAENG[jiIdx];
    const jEumyang = JIJI_EUMYANG[jiIdx];
    const animal = JIJI_ANIMALS[jiIdx];

    const ganSipSin = isDay
      ? '일간(본인)'
      : calculateSipSin(gOhaeng, gEumyang, dayOhaeng, dayEumyang);
    const jiSipSin = calculateSipSin(jOhaeng, jEumyang, dayOhaeng, dayEumyang);

    return {
      gan: {
        hangul: gHangul,
        hanja: gHanja,
        ohaeng: gOhaeng,
        eumyang: gEumyang,
        sipsin: ganSipSin,
      },
      ji: {
        hangul: jHangul,
        hanja: jHanja,
        ohaeng: jOhaeng,
        eumyang: jEumyang,
        sipsin: jiSipSin,
        animal,
      },
    };
  };

  const yearPillar = createPillar(yearGan, yearJi);
  const monthPillar = createPillar(monthGan, monthJi);
  const dayPillar = createPillar(dayGan, dayJi, true);
  const hourPillar =
    hourGan !== null && hourJi !== null ? createPillar(hourGan, hourJi) : null;

  // 오행 개수 및 비율 계산
  const ohaengCounts: Record<Ohaeng, number> = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
  };

  const allPillars = [yearPillar, monthPillar, dayPillar, ...(hourPillar ? [hourPillar] : [])];
  allPillars.forEach((p) => {
    ohaengCounts[p.gan.ohaeng]++;
    ohaengCounts[p.ji.ohaeng]++;
  });

  const totalElements = allPillars.length * 2;
  const ohaengPercentages: Record<Ohaeng, number> = {
    목: Math.round((ohaengCounts.목 / totalElements) * 100),
    화: Math.round((ohaengCounts.화 / totalElements) * 100),
    토: Math.round((ohaengCounts.토 / totalElements) * 100),
    금: Math.round((ohaengCounts.금 / totalElements) * 100),
    수: Math.round((ohaengCounts.수 / totalElements) * 100),
  };

  // 과다 및 결핍 오행 도출
  const dominantOhaeng: Ohaeng[] = [];
  const lackingOhaeng: Ohaeng[] = [];

  (Object.keys(ohaengCounts) as Ohaeng[]).forEach((el) => {
    if (ohaengCounts[el] >= 3) {
      dominantOhaeng.push(el);
    }
    if (ohaengCounts[el] === 0) {
      lackingOhaeng.push(el);
    }
  });

  // 일간 및 일주 정보
  const ilganHangul = CHEONGAN[dayGan];
  const ilganHanja = CHEONGAN_HANJA[dayGan];
  const ilganMeta = ILGAN_INFO[ilganHangul];

  const iljuHangul = `${ilganHangul}${JIJI[dayJi]}`;
  const iljuHanja = `${ilganHanja}${JIJI_HANJA[dayJi]}`;
  const iljuAnimal = `${ILJU_ANIMALS[ilganHangul]} ${JIJI_ANIMALS[dayJi]}`;

  return {
    birthDate: {
      solarYear,
      solarMonth,
      solarDay,
      solarHour: input.hour,
      solarMinute: input.minute,
      isLunar: input.isLunar,
      isLeapMonth: input.isLeapMonth,
      gender: input.gender,
      name: input.name,
      hasTime: input.hasTime,
    },
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    ilgan: {
      hangul: ilganHangul,
      hanja: ilganHanja,
      ohaeng: dayOhaeng,
      eumyang: dayEumyang,
      keyword: ilganMeta.keyword,
      title: ilganMeta.title,
      description: ilganMeta.description,
    },
    ilju: {
      hangul: iljuHangul,
      hanja: iljuHanja,
      animal: iljuAnimal,
      traits: `${iljuAnimal}의 상징을 지닌 ${iljuHangul}(${iljuHanja})일주`,
    },
    ohaengCounts,
    ohaengPercentages,
    dominantOhaeng,
    lackingOhaeng,
  };
}
