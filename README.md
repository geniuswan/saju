# 천기누설 (天機漏洩) - AI 맞춤형 모던 사주명리 웹 서비스

> **정통 60갑자 만세력 알고리즘**과 **Google Gemini AI**가 융합된 차세대 인터랙티브 사주 분석 웹 애플리케이션

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?style=flat&logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-orange?style=flat&logo=google)

---

## 🌟 주요 핵심 기능

### 1. 정밀 만세력 4주 8글자 및 일간 도출
- **24절기 절입 시각(입춘~대설) 정밀 계산**을 통해 연주와 월주를 정확하게 산출
- 양력 및 음력(윤달 지원) 생년월일시 완벽 대응
- 12간지 시간대(자시~해시, 한국 표준시 30분 보정) 및 '태어난 시간 모름(삼주 분석)' 옵션 지원
- 천간·지지별 **십신(비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인)** 실시간 계산
- 나를 상징하는 **본원(일간, 日干)과 60일주 동물 상징** 시각화

### 2. 오행(목·화·토·금·수) 밸런스 시각화
- 5개 원소의 비율 및 개수 게이지 그래프 제공
- **과다 오행(발달)**과 **결핍 오행(부족)** 자동 진단
- 부족한 기운을 채워주는 **오행 개운법(행운의 색, 숫자, 방향, 음식, 생활 습관)** 안내

### 3. 4대 핵심 영역 리포트 & 2026년 운세
- **타고난 본성과 잠재력**: 나의 기질, 핵심 강점, 주의점, 스승의 조언
- **재물운 & 사업운**: 부의 그릇 등급, 자산 축적 스타일, 재물 전성기 타이밍, 현실적인 실천 팁
- **직업 & 적성운**: 추천 직무 및 분야 해시태그, 최적의 업무 환경, 커리어 도약 포인트
- **애정 & 대인관계운**: 나의 연애 스타일, 복이 되는 찰떡 인연 유형, 관계 개선 팁
- **2026년 병오년(丙午年) 운세**: 붉은 말의 해 총평, 반드시 잡아야 할 기회, 조심할 점

### 4. 1:1 실시간 AI 사주도사 상담실
- 사주 원국과 리포트 컨텍스트를 기억하는 Google Gemini AI 챗봇
- 온화하고 지혜로운 사주 명리 스승 어투(해요체)로 실시간 문답
- 원클릭 추천 질문 칩 제공 (이직 타이밍, 개운 비결, 연애 궁합 등)

### 5. 결과 카드 이미지 저장 (PNG)
- 인스타그램 및 모바일 공유에 최적화된 감각적인 디자인의 사주 결과 카드 이미지 다운로드 기능 (`html-to-image`)

### 6. 로컬스토리지 기반 다중 프로필 관리
- 회원가입 없이 브라우저에 안전하게 사주 정보 보관 (개인정보 보호)
- '본인', '배우자', '연인', '가족', '친구' 등 다중 사주 프로필 저장 및 원클릭 불러오기

---

## 🚀 빠른 시작 가이드

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정 (선택 사항)
`.env.local` 파일에 Google Gemini API 키를 입력합니다:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> **참고**: API 키가 설정되어 있지 않아도 내장된 고품질 정밀 명리학 엔진으로 모든 리포트와 분석이 즉시 정상 작동합니다. 또한 웹 화면 우측 상단 **[API 설정]** 버튼을 통해 브라우저에서 직접 본인의 API 키를 등록하실 수도 있습니다.

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하시면 즉시 사주 풀이를 경험하실 수 있습니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 📁 프로젝트 구조

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── saju/
│   │   │       ├── analyze/route.ts  # 사주 만세력 계산 및 리포트 생성 API
│   │   │       └── chat/route.ts     # 1:1 AI 사주도사 문답 API
│   │   ├── globals.css               # 모던 오리엔탈 다크 테마 및 골드 액센트
│   │   ├── layout.tsx                # 메타데이터 및 글로벌 레이아웃
│   │   └── page.tsx                  # 메인 사주 웹 애플리케이션
│   ├── components/
│   │   ├── SajuInputForm.tsx         # 생년월일시 입력 폼 & 프로필 저장
│   │   ├── SajuWonGukView.tsx        # 4주 8글자 사주 원국 카드 뷰어
│   │   ├── OhaengChart.tsx           # 목화토금수 오행 분포도 & 개운 진단
│   │   ├── SajuReportView.tsx        # 4대 핵심운 및 2026년 세운 탭 리포트
│   │   ├── SajuChatModal.tsx         # AI 사주도사 1:1 대화 모달
│   │   ├── SajuShareCard.tsx         # 공유용 결과 카드 이미지 생성기 (PNG)
│   │   ├── ProfileDrawer.tsx         # 저장된 사주 보관함
│   │   └── SettingsModal.tsx         # Gemini API 설정 모달
│   └── lib/
│       ├── gemini.ts                 # Google Gemini 2.5 Flash 연동 모듈
│       └── saju/
│           ├── types.ts              # 만세력, 사주, 리포트 TypeScript 타입
│           ├── manseryeok.ts         # 24절기 및 60갑자 만세력 정밀 계산 엔진
│           └── interpretations.ts    # 60일주 해석, 개운법, 프롬프트 빌더
└── README.md
```

---

## 🎨 디자인 시스템

- **배경 테마**: 깊고 신비로운 딥 차콜 & 묵향 블랙 (`#090a0f`)
- **포인트 색상**: 고풍스러운 앤틱 골드 (`#d4af37`, `#fef3c7`)
- **오행 고유 컬러**:
  - **목 (木)**: 에메랄드 그린 (`#10b981`)
  - **화 (火)**: 버밀리온 레드 (`#ef4444`)
  - **토 (土)**: 앰버 골드 (`#f59e0b`)
  - **금 (金)**: 실버 화이트 (`#e2e8f0`)
  - **수 (水)**: 사파이어 블루 (`#3b82f6`)
