import { ManseryeokResult, SajuAnalysisReport, Ohaeng } from './types';

// 오행별 보완 개운법 (부족한 기운 채우기)
export const OHAENG_KAEWUN: Record<
  Ohaeng,
  {
    colors: string[];
    numbers: string;
    direction: string;
    food: string;
    lifestyle: string;
  }
> = {
  목: {
    colors: ['청록색', '초록색', '에메랄드'],
    numbers: '3, 8',
    direction: '동쪽',
    food: '신선한 녹황색 채소, 새콤한 과일, 녹차',
    lifestyle: '아침 일찍 산책하기, 실내에 반려식물 가꾸기, 배움과 새로운 취미 도전하기',
  },
  화: {
    colors: ['버밀리온 레드', '오렌지', '자주색'],
    numbers: '2, 7',
    direction: '남쪽',
    food: '따뜻한 차, 붉은색 파프리카, 토마토, 쓴맛을 내는 나물',
    lifestyle: '햇볕 쬐며 가벼운 운동하기, 감정을 솔직히 표현하기, 밝은 조명 활용하기',
  },
  토: {
    colors: ['황금색', '베이지', '브라운'],
    numbers: '5, 10',
    direction: '중앙',
    food: '단호박, 고구마, 꿀, 부드러운 곡물류',
    lifestyle: '맨발 걷기(어싱), 명상과 심호흡으로 마음 안정시키기, 정리정돈 습관화',
  },
  금: {
    colors: ['순백색', '실버', '라이트 그레이'],
    numbers: '4, 9',
    direction: '서쪽',
    food: '도라지, 무, 배, 마늘, 매콤하고 칼칼한 국물',
    lifestyle: '웨이트 트레이닝 등 단단한 근력 운동, 불필요한 인간관계 가지치기, 규칙적인 수면',
  },
  수: {
    colors: ['미드나잇 블랙', '사파이어 블루', '네이비'],
    numbers: '1, 6',
    direction: '북쪽',
    food: '미역/다시마 등 해조류, 검은콩, 흑임자, 충분한 미온수',
    lifestyle: '반신욕이나 수영하기, 조용한 밤에 독서나 일기 쓰기, 유연하게 물 흐르듯 대처하기',
  },
};

// 60일주 핵심 요약 키워드 & 기질
export const ILJU_DESCRIPTIONS: Record<string, { summary: string; trait: string }> = {
  갑자: { summary: '지혜와 우아함을 겸비한 푸른 쥐', trait: '총명하고 예술적 감각이 뛰어나며, 시작하는 추진력이 강합니다.' },
  을축: { summary: '근면성실함으로 결실을 맺는 푸른 소', trait: '끈기와 인내심이 남다르며, 척박한 땅에서도 꽃을 피워내는 자수성가형입니다.' },
  병인: { summary: '열정적이고 용맹한 붉은 호랑이', trait: '활달하고 낙천적이며, 강한 리더십과 창의적인 기획력으로 주변을 이끕니다.' },
  정묘: { summary: '감수성이 풍부하고 총명한 붉은 토끼', trait: '예의 바르고 섬세하며, 번뜩이는 영감과 직관력이 매우 뛰어납니다.' },
  무진: { summary: '웅장한 꿈과 이상을 품은 황금 용', trait: '포용력과 배포가 크며, 남다른 뚝심으로 큰일을 도모하는 기백이 있습니다.' },
  기사: { summary: '지혜롭고 직관력이 예리한 황금 뱀', trait: '두뇌 회전이 빠르고 현실 감각이 탁월하여 실속을 차리는 능력이 좋습니다.' },
  경오: { summary: '정의롭고 당당한 백마', trait: '원칙과 명예를 중시하며, 솔직하고 시원시원한 성격으로 신망을 얻습니다.' },
  신미: { summary: '섬세하고 영특한 하얀 양', trait: '자존심과 예술성이 높으며, 고난을 묵묵히 이겨내는 강단이 숨어 있습니다.' },
  임신: { summary: '재주가 넘치고 지혜로운 검은 원숭이', trait: '다재다능하고 학문과 지혜가 깊으며, 어떤 상황에서도 기지를 발휘합니다.' },
  계유: { summary: '맑고 고결한 지혜를 품은 검은 닭', trait: '사리분별이 명확하고 감각이 예리하며, 학문이나 전문 분야에서 두각을 나타냅니다.' },
  갑술: { summary: '책임감과 신의가 두터운 청구(푸른 개)', trait: '한번 맺은 인연을 소중히 하며, 정직하고 근면하게 부를 일구어갑니다.' },
  을해: { summary: '순수하고 학구열이 높은 푸른 돼지', trait: '인정이 많고 온화하며, 배움을 사랑하고 평화를 추구하는 넉넉한 기운입니다.' },
  병자: { summary: '밝고 매력적인 붉은 쥐', trait: '외유내강의 전형으로, 사람을 끄는 도화의 매력과 명석한 두뇌를 지녔습니다.' },
  정축: { summary: '따뜻한 온기와 실속을 지닌 붉은 소', trait: '부드러운 미소 뒤에 강한 집념이 있으며, 재물을 안전하게 지키는 능력이 뛰어납니다.' },
  무인: { summary: '위엄과 기백을 자랑하는 황호', trait: '카리스마와 배포가 남다르며, 남의 밑에 있기보다 조직의 장이 어울립니다.' },
  기묘: { summary: '민첩하고 예술적 감각이 뛰어난 황금 토끼', trait: '순발력과 적응력이 우수하며, 자신의 재능을 섬세하게 발휘합니다.' },
  경진: { summary: '불굴의 의지를 지닌 백룡', trait: '괴강의 기운으로 위기 상황에서 놀라운 결단력과 괴력을 발휘합니다.' },
  신사: { summary: '빛나는 지혜와 예리함을 품은 백사', trait: '단정하고 품위가 있으며, 정확한 관찰력과 분별력을 자랑합니다.' },
  임오: { summary: '넓은 시야와 열정을 품은 흑마', trait: '사교성이 좋고 재물운이 따르며, 사람들과 활발하게 교류하며 성장합니다.' },
  계미: { summary: '끈기 있고 지혜로운 검은 양', trait: '겉은 부드러우나 속은 단단하며, 어려운 난관을 슬기롭게 극복합니다.' },
  갑신: { summary: '기동력과 기상이 넘치는 푸른 원숭이', trait: '변화에 능숙하고 개혁적인 성향으로, 새로운 분야에 과감히 도전합니다.' },
  을유: { summary: '깔끔하고 감각이 돋보이는 청유(푸른 닭)', trait: '자신만의 개성과 원칙이 뚜렷하며, 정밀하고 디테일한 일에 특화되어 있습니다.' },
  병술: { summary: '충성심과 열정이 가득한 붉은 개', trait: '사람들에게 따뜻하고 헌신적이며, 듬직한 신의로 인정받습니다.' },
  정해: { summary: '맑고 지혜로운 붉은 돼지', trait: '천을귀인의 복록을 품어 마음씨가 곱고, 인생의 귀인 도움이 많이 따릅니다.' },
  무자: { summary: '알찬 실속과 재복을 품은 황금 쥐', trait: '재물 감각이 매우 뛰어나며, 티끌 모아 태산을 이루는 저력이 있습니다.' },
  기축: { summary: '묵묵히 땅을 갈아엎는 황금 소', trait: '성실함의 대명사로, 어떤 역경에도 흔들리지 않고 제 길을 걷습니다.' },
  경인: { summary: '용맹하고 추진력이 넘치는 백호', trait: '시원시원한 결단력과 과감한 실행력으로 목표를 쟁취합니다.' },
  신묘: { summary: '감각적이고 손재주가 뛰어난 하얀 토끼', trait: '심미안이 뛰어나고 세밀한 작업에 강하며, 다정하고 친절합니다.' },
  임진: { summary: '광활한 바다를 누비는 흑룡', trait: '스케일이 크고 야망이 있으며, 대인배다운 기질로 무리를 이끕니다.' },
  계사: { summary: '복록과 지혜를 타고난 흑사', trait: '천을귀인의 기운으로 지혜롭고 처세술이 뛰어나며, 재물과 명예운이 길합니다.' },
  갑오: { summary: '자유분방하고 활기찬 푸른 말', trait: '표현력이 탁월하고 솔직담백하며, 창작과 예술 분야에서 두각을 나타냅니다.' },
  을미: { summary: '친화력과 생활력이 강한 푸른 양', trait: '주변 사람들과 원만하게 어울리며, 알뜰하고 야무지게 미래를 준비합니다.' },
  병신: { summary: '밝고 재치 넘치는 붉은 원숭이', trait: '유머 감각과 센스가 뛰어나며, 다재다능하여 어디서나 인기를 끕니다.' },
  정유: { summary: '귀티와 섬세함을 지닌 붉은 닭', trait: '천을귀인을 놓아 품격이 있고, 예리한 감각으로 전문성을 구축합니다.' },
  무술: { summary: '태산 같은 뚝심을 지닌 황구(황금 개)', trait: '믿음직하고 우직하며, 한번 맡은 일은 끝까지 책임지는 의리가 있습니다.' },
  기해: { summary: '풍요롭고 다정한 황금 돼지', trait: '복록이 많고 마음이 너그러우며, 사람들에게 편안한 쉼터가 되어줍니다.' },
  경자: { summary: '총명하고 예술성이 풍부한 백서(하얀 쥐)', trait: '두뇌가 비상하고 언변이 뛰어나며, 아이디어가 마르지 않습니다.' },
  신축: { summary: '인내심과 보석 같은 가치를 품은 백우(하얀 소)', trait: '겉은 조용하나 내면에 강한 고집과 끈기가 있어 반드시 성공을 이룹니다.' },
  임인: { summary: '지혜롭고 당당한 흑호(검은 호랑이)', trait: '식신을 품어 식복과 재복이 두텁고, 진취적인 기상으로 남을 잘 보살핍니다.' },
  계묘: { summary: '영민하고 귀여움을 받는 흑토(검은 토끼)', trait: '천을귀인의 덕으로 사랑을 많이 받으며, 온화하고 다정다감합니다.' },
  갑진: { summary: '풍운을 일으키는 청룡(푸른 용)', trait: '진취적이고 배짱이 두둑하며, 이상을 향해 힘차게 전진하는 리더입니다.' },
  을사: { summary: '화려하고 언변이 뛰어난 청사(푸른 뱀)', trait: '활동적이고 눈치가 빠르며, 사람의 마음을 사로잡는 화술이 뛰어납니다.' },
  병오: { summary: '태양처럼 뜨거운 열정의 적마(붉은 말)', trait: '자신감과 에너지가 넘치며, 불의를 보면 참지 못하는 화끈한 성품입니다.' },
  정미: { summary: '따뜻하고 정이 넘치는 붉은 양', trait: '예의 바르고 배려심이 깊으며, 내면에 타오르는 열정으로 성취를 이룹니다.' },
  무신: { summary: '재주 많고 의리 있는 황금 원숭이', trait: '음식 솜씨나 손재주가 좋고, 사람을 끄는 넉넉함과 여유가 있습니다.' },
  기유: { summary: '깔끔하고 성실한 황금 닭', trait: '식신을 놓아 베풀기를 좋아하며, 정확하고 빈틈없는 일 처리 능력을 자랑합니다.' },
  경술: { summary: '우직하고 강인한 백구(하얀 개)', trait: '괴강살의 강렬한 기운으로, 어떤 위기에서도 중심을 잃지 않는 굳센 의지가 있습니다.' },
  신해: { summary: '맑고 우아한 백저(하얀 돼지)', trait: '금백수청의 맑은 기운으로 총명하고 아름다우며, 예술적 직관이 풍부합니다.' },
  임자: { summary: '거대한 파도처럼 강력한 흑서(검은 쥐)', trait: '양인살의 강인한 주체성과 대범함으로, 큰 승부수를 던질 줄 아는 여장부/대장부입니다.' },
  계축: { summary: '묵묵히 실력을 쌓아가는 백절불굴의 검은 소', trait: '끈기와 뚝심이 대단하며, 조용하지만 무서운 집중력으로 결실을 맺습니다.' },
  갑인: { summary: '우거진 숲처럼 웅장한 청호(푸른 호랑이)', trait: '간여지동의 강한 자존심과 주체성으로, 누구에게도 굽히지 않는 대장부의 기운입니다.' },
  을묘: { summary: '생기발랄하고 부드러운 청묘(푸른 토끼)', trait: '친화력이 극대화된 기운으로, 사교성이 좋고 예술적 감각이 매우 뛰어납니다.' },
  병진: { summary: '대지를 비추는 아침 햇살과 용', trait: '다정다감하고 도량이 넓으며, 사람을 품고 기르는 교육이나 상담에 적합합니다.' },
  정사: { summary: '강렬하게 타오르는 불꽃의 적사(붉은 뱀)', trait: '솔직하고 화끈하며, 목표가 생기면 밤낮을 가리지 않고 돌진하는 열정파입니다.' },
  무오: { summary: '대지를 질주하는 웅장한 적토마(황마)', trait: '남다른 고집과 뚝심, 불굴의 용기로 스스로 일어서는 강력한 기운입니다.' },
  기미: { summary: '단단하고 따뜻한 옥토의 황금 양', trait: '신용을 목숨처럼 여기며, 흔들리지 않는 자기주관으로 자산을 차곡차곡 쌓습니다.' },
  경신: { summary: '단련된 명검 같은 강철의 백원(하얀 원숭이)', trait: '맺고 끊음이 칼 같고 의리가 두터우며, 뛰어난 실행력으로 앞서 나갑니다.' },
  신유: { summary: '반짝이는 완성된 다이아몬드(백유)', trait: '결벽에 가까운 깔끔함과 날카로운 직관, 타협하지 않는 순수한 자존심의 상징입니다.' },
  임술: { summary: '깊은 물을 품은 신비로운 흑구(검은 개)', trait: '지혜와 재물 감각을 겸비하였으며, 사람을 부리는 리더십과 융통성이 탁월합니다.' },
  계해: { summary: '모든 물이 모여드는 거대한 큰 바다(흑저)', trait: '무한한 가능성과 깊은 지혜, 만물을 품어주는 넉넉한 포용력을 지닌 완성의 기운입니다.' },
};

// 고품질 기본(Fallback) 사주 리포트 생성기
export function generateLocalReport(manseryeok: ManseryeokResult): SajuAnalysisReport {
  const { ilgan, ilju, dominantOhaeng, lackingOhaeng } = manseryeok;
  const iljuData = ILJU_DESCRIPTIONS[ilju.hangul] || {
    summary: `${ilju.animal}의 상징을 지닌 기운`,
    trait: '자신만의 개성과 뚝심으로 인생의 길을 개척해 나가는 형상입니다.',
  };

  const targetLacking = lackingOhaeng[0] || (dominantOhaeng[0] === '화' ? '수' : '목');
  const kaewunInfo = OHAENG_KAEWUN[targetLacking];

  // 1. 성향 분석
  const strengths = [
    `${ilgan.title}의 기운을 받아 ${ilgan.keyword.split(', ')[0]}처럼 당당하고 주체적인 중심이 잡혀 있습니다.`,
    `${iljuData.trait}`,
    '주변 상황에 쉽게 휩쓸리지 않고 스스로 결단을 내리는 소신과 자존감이 돋보입니다.',
  ];

  const weaknesses = [
    '자신의 기준이 확고하여 때로는 주변 사람들의 피드백을 수용하기까지 마음의 시간이 필요할 수 있습니다.',
    '책임감이 지나치게 강해 모든 짐을 혼자 짊어지려 하다가 번아웃이 올 수 있으니 유의해야 합니다.',
  ];

  // 2. 재물운
  let wealthGrade: SajuAnalysisReport['wealth']['grade'] = '중상';
  if (manseryeok.ohaengCounts.토 >= 2 || manseryeok.ohaengCounts.금 >= 2) {
    wealthGrade = '상';
  } else if (manseryeok.ohaengCounts.화 === 0 && manseryeok.ohaengCounts.금 === 0) {
    wealthGrade = '노력형';
  }

  // 3. 직업/진로
  const careerFieldsMap: Record<Ohaeng, string[]> = {
    목: ['교육/연구', '스타트업/기획', '문화/예술', '출판/디자인'],
    화: ['마케팅/PR', '미디어/콘텐츠 크리에이터', 'IT/테크', '외식/엔터테인먼트'],
    토: ['부동산/자산관리', '컨설팅/상담', '공공/행정', '건축/환경'],
    금: ['금융/투자', '법률/의료', '정밀 엔지니어링', '경영 관리/회계'],
    수: ['데이터 분석/전략', '해외/무역', '심리/철학', '유통/물류'],
  };

  const bestFields = careerFieldsMap[ilgan.ohaeng] || ['전문직', '기획/전략', '크리에이티브'];

  return {
    personality: {
      summary: `당신은 ${iljuData.summary}의 형상으로, ${ilgan.description}`,
      strengths,
      weaknesses,
      advice: '자신의 강력한 본성을 믿되, 가끔은 한 템포 쉬어가며 주변과의 조화를 도모할 때 천운(天運)이 더욱 크게 열립니다.',
    },
    wealth: {
      grade: wealthGrade,
      style: `${ilgan.ohaeng}의 기운을 바탕으로 ${
        wealthGrade === '상'
          ? '큰 흐름을 포착하고 자산을 안정적으로 축적하는 남다른 재물 그릇을 지녔습니다.'
          : '성실하고 꼼꼼한 관리로 점진적으로 부를 증식시키는 알짜배기 재물 스타일입니다.'
      }`,
      timing: '인생의 중반기 이후 재물의 그릇이 본격적으로 단단해지며, 30대 중후반부터 결실이 가시화됩니다.',
      actionableTip: '충동적인 단기 투자보다는 내가 확실히 이해하고 주도할 수 있는 분야에 장기적으로 씨앗을 뿌리세요.',
    },
    career: {
      bestFields,
      workStyle: '수동적인 지시를 따르기보다, 스스로 재량권을 가지고 주도적으로 완결 지을 수 있는 독립적인 환경에서 최고의 역량을 발휘합니다.',
      growthPoint: '나만의 독보적인 전문 무기(기술, 자격, 지식)를 하나 명확히 갖추는 것이 커리어 도약의 열쇠입니다.',
    },
    love: {
      style: '한번 신뢰를 주면 깊고 헌신적인 사랑을 쏟으나, 거짓이나 예의 없는 태도에는 단호하게 선을 긋는 진중한 연애관을 지녔습니다.',
      compatibleTypes: `${targetLacking}의 유연하고 따뜻한 기운을 품어 나의 부족한 점을 감싸 안아주는 지혜로운 사람과 최고의 궁합을 이룹니다.`,
      relationshipAdvice: '서운한 점이 있을 때 혼자 삭히거나 표정으로 드러내기보다, 차분하고 솔직한 대화로 마음을 풀어내는 연습이 관계를 더욱 깊어지게 합니다.',
    },
    currentYearFortune: {
      year: 2026,
      title: '새로운 도약과 확장의 전환기 (丙午年)',
      flow: '2026년은 강한 불(丙火)과 말(午火)의 활발한 에너지가 들어오는 해로, 그동안 정체되었던 일들에 가속도가 붙고 새로운 기회의 문이 열리는 흐름입니다.',
      caution: '성급하게 서두르다 보면 디테일을 놓치거나 감정 소모가 커질 수 있으니, 계약이나 중요한 결정 전에는 반드시 한 번 더 검토하세요.',
      opportunity: '새로운 도전, 자격 취득, 이직이나 사업 확장 등 자신의 영역을 넓히기에 더없이 좋은 모멘텀이 찾아옵니다.',
    },
    kaewun: {
      luckyColors: kaewunInfo.colors,
      luckyNumber: kaewunInfo.numbers,
      luckyDirection: kaewunInfo.direction,
      mindset: `${kaewunInfo.lifestyle}. 특히 ${kaewunInfo.food} 등을 가까이하여 몸과 마음에 균형을 선물하세요.`,
    },
  };
}

// Gemini용 정밀 프롬프트 빌더
export function buildGeminiPrompt(manseryeok: ManseryeokResult): string {
  const { birthDate, pillars, ilgan, ilju, ohaengCounts, dominantOhaeng, lackingOhaeng } =
    manseryeok;

  const hourPillarStr = pillars.hour
    ? `${pillars.hour.gan.hangul}(${pillars.hour.gan.hanja}) ${pillars.hour.ji.hangul}(${pillars.hour.ji.hanja}) [십신: ${pillars.hour.gan.sipsin} / ${pillars.hour.ji.sipsin}]`
    : '시주 정보 없음(시간 모름)';

  return `
당신은 한국의 정통 명리학과 현대적 통찰을 겸비한, 지혜롭고 깊이 있으며 따뜻한 사주 명리 대가(스승)입니다.
신뢰감 있고 온화한 정중체('해요체')로 내담자의 타고난 천명을 꿰뚫어 보고, 용기와 지혜를 건네주어야 합니다.

[내담자 정밀 사주 원국 데이터]
- 성명: ${birthDate.name || '내담자'}
- 성별: ${birthDate.gender === 'male' ? '남성' : '여성'}
- 양력 생년월일: ${birthDate.solarYear}년 ${birthDate.solarMonth}월 ${birthDate.solarDay}일 ${
    birthDate.hasTime ? `${birthDate.solarHour ?? 0}시 ${birthDate.solarMinute ?? 0}분` : '(태어난 시간 모름)'
  }
- 연주(年柱): ${pillars.year.gan.hangul}(${pillars.year.gan.hanja}) ${pillars.year.ji.hangul}(${pillars.year.ji.hanja}) [십신: ${pillars.year.gan.sipsin} / ${pillars.year.ji.sipsin}]
- 월주(月柱): ${pillars.month.gan.hangul}(${pillars.month.gan.hanja}) ${pillars.month.ji.hangul}(${pillars.month.ji.hanja}) [십신: ${pillars.month.gan.sipsin} / ${pillars.month.ji.sipsin}]
- 일주(日柱): ${pillars.day.gan.hangul}(${pillars.day.gan.hanja}) ${pillars.day.ji.hangul}(${pillars.day.ji.hanja}) [일간: ${pillars.day.gan.sipsin} / 지지십신: ${pillars.day.ji.sipsin}]
- 시주(時柱): ${hourPillarStr}
- 일간(본원): ${ilgan.hangul}(${ilgan.hanja}) - ${ilgan.title} (${ilgan.ohaeng}, ${ilgan.eumyang})
- 일주 상징: ${ilju.traits}
- 오행 분포: 목(${ohaengCounts.목}개), 화(${ohaengCounts.화}개), 토(${ohaengCounts.토}개), 금(${ohaengCounts.금}개), 수(${ohaengCounts.수}개)
- 과다 오행: ${dominantOhaeng.length > 0 ? dominantOhaeng.join(', ') : '없음 (균형)'}
- 부족/결핍 오행: ${lackingOhaeng.length > 0 ? lackingOhaeng.join(', ') : '없음 (모두 구비)'}

[출력 요구사항]
반드시 아래 JSON 스키마 형식에 맞춰 정확한 JSON 문자열만 응답하세요. (마크다운 코드블록 안팎에 불필요한 사족을 달지 마세요)

\`\`\`json
{
  "personality": {
    "summary": "일간과 일주, 오행의 조화를 바탕으로 한 본인의 본성 총평 (3~4문장)",
    "strengths": ["강점 1 (구체적)", "강점 2", "강점 3"],
    "weaknesses": ["주의할 점 1 (따뜻한 조언 형식)", "주의할 점 2"],
    "advice": "인생을 주도적으로 이끌어가기 위한 핵심 조언"
  },
  "wealth": {
    "grade": "상 | 중상 | 중 | 노력형 중 택1",
    "style": "재물을 벌고 모으는 본인만의 고유한 스타일과 그릇",
    "timing": "인생에서 큰 재물운이 트이는 시기와 흐름",
    "actionableTip": "재물을 지키고 불리기 위한 현실적 실천 팁"
  },
  "career": {
    "bestFields": ["추천 직업/분야 1", "추천 직업/분야 2", "추천 직업/분야 3", "추천 직업/분야 4"],
    "workStyle": "직장에서 능력을 극대화할 수 있는 업무 스타일과 환경",
    "growthPoint": "커리어 도약을 위한 핵심 성장 포인트"
  },
  "love": {
    "style": "연애 및 대인관계에서의 감정 표현과 태도",
    "compatibleTypes": "서로에게 복이 되고 시너지를 내는 인연의 유형과 기운",
    "relationshipAdvice": "지속적이고 행복한 관계를 위한 마음가짐"
  },
  "currentYearFortune": {
    "year": 2026,
    "title": "2026년 병오년(丙午年)의 핵심 테마 한 줄 요약",
    "flow": "올해 내담자에게 미치는 기운의 변화와 전체적인 흐름 상세",
    "caution": "올해 특히 경계하거나 조심해야 할 부분",
    "opportunity": "올해 반드시 잡아야 할 기회와 도전 영역"
  },
  "kaewun": {
    "luckyColors": ["행운의 색상 1", "행운의 색상 2"],
    "luckyNumber": "행운의 숫자 2개",
    "luckyDirection": "행운의 방위",
    "mindset": "부족한 오행을 보완하고 운을 틔워주는 구체적인 생활 습관과 개운 비결"
  }
}
\`\`\`
`;
}
