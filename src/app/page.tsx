'use client';

import React, { useState, useEffect } from 'react';
import { ManseryeokResult, SajuAnalysisReport, SajuProfile } from '@/lib/saju/types';
import { SajuInputForm, SajuFormInput } from '@/components/SajuInputForm';
import { SajuWonGukView } from '@/components/SajuWonGukView';
import { OhaengChart } from '@/components/OhaengChart';
import { SajuReportView } from '@/components/SajuReportView';
import { SajuChatModal } from '@/components/SajuChatModal';
import { SajuShareCard } from '@/components/SajuShareCard';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import {
  Sparkles,
  Users,
  Settings,
  RotateCcw,
  Moon,
  Compass,
  ScrollText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function Home() {
  const [manseryeok, setManseryeok] = useState<ManseryeokResult | null>(null);
  const [report, setReport] = useState<SajuAnalysisReport | null>(null);
  const [isAI, setIsAI] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 모달 제어 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 로컬 스토리지 상태
  const [savedProfiles, setSavedProfiles] = useState<SajuProfile[]>([]);
  const [customApiKey, setCustomApiKey] = useState('');

  // 컴포넌트 마운트 시 로컬스토리지 복원
  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem('saju_saved_profiles');
      if (storedProfiles) {
        setSavedProfiles(JSON.parse(storedProfiles));
      }

      const storedKey = localStorage.getItem('saju_custom_gemini_key');
      if (storedKey) {
        setCustomApiKey(storedKey);
      }

      const storedAnalysis = localStorage.getItem('saju_last_analysis');
      if (storedAnalysis) {
        const parsed = JSON.parse(storedAnalysis);
        setManseryeok(parsed.manseryeok);
        setReport(parsed.report);
        setIsAI(parsed.isAI);
      }
    } catch (e) {
      console.error('LocalStorage restoration error:', e);
    }
  }, []);

  // 사주 분석 요청 처리
  const handleAnalyze = async (input: SajuFormInput) => {
    setIsLoading(true);
    try {
      try {
        const res = await fetch('/api/saju/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...input,
            customApiKey: customApiKey || undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setManseryeok(data.manseryeok);
            setReport(data.report);
            setIsAI(data.isAI);
            localStorage.setItem(
              'saju_last_analysis',
              JSON.stringify({
                manseryeok: data.manseryeok,
                report: data.report,
                isAI: data.isAI,
              })
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      } catch {
        // 정적 호스팅(Cloudflare Pages 등)에서는 API 라우트 부재 시 클라이언트 직접 연산 진행
      }

      // 클라이언트 직접 계산 및 Gemini 연동
      const { calculateManseryeok } = await import('@/lib/saju/manseryeok');
      const { analyzeSajuWithGemini } = await import('@/lib/gemini');

      const clientManseryeok = calculateManseryeok({
        year: Number(input.year),
        month: Number(input.month),
        day: Number(input.day),
        hour: input.hasTime && input.hour !== undefined ? Number(input.hour) : undefined,
        minute: input.hasTime && input.minute !== undefined ? Number(input.minute) : undefined,
        isLunar: Boolean(input.isLunar),
        isLeapMonth: Boolean(input.isLeapMonth),
        gender: input.gender,
        name: String(input.name || '내담자'),
        hasTime: Boolean(input.hasTime),
      });

      const { report: clientReport, isAI: clientIsAI } = await analyzeSajuWithGemini(
        clientManseryeok,
        customApiKey || undefined
      );

      setManseryeok(clientManseryeok);
      setReport(clientReport);
      setIsAI(clientIsAI);

      localStorage.setItem(
        'saju_last_analysis',
        JSON.stringify({
          manseryeok: clientManseryeok,
          report: clientReport,
          isAI: clientIsAI,
        })
      );

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Analysis failed:', err);
      alert('사주 분석 중 오류가 발생했습니다. 생년월일을 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 저장 핸들러
  const handleSaveProfile = (newProfileData: Omit<SajuProfile, 'id' | 'createdAt'>) => {
    const profile: SajuProfile = {
      ...newProfileData,
      id: String(Date.now()),
      createdAt: Date.now(),
    };

    const updated = [profile, ...savedProfiles.filter((p) => p.name !== profile.name)];
    setSavedProfiles(updated);
    localStorage.setItem('saju_saved_profiles', JSON.stringify(updated));
  };

  // 프로필 삭제 핸들러
  const handleDeleteProfile = (id: string) => {
    const updated = savedProfiles.filter((p) => p.id !== id);
    setSavedProfiles(updated);
    localStorage.setItem('saju_saved_profiles', JSON.stringify(updated));
  };

  // API 키 저장 핸들러
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (key) {
      localStorage.setItem('saju_custom_gemini_key', key);
    } else {
      localStorage.removeItem('saju_custom_gemini_key');
    }
  };

  // 새 분석 시작 (리셋)
  const handleReset = () => {
    setManseryeok(null);
    setReport(null);
    localStorage.removeItem('saju_last_analysis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* 글로벌 네비게이션 헤더 */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* 브랜드 로고 */}
          <div
            onClick={handleReset}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-neutral-950 flex items-center justify-center font-serif font-black text-amber-400 text-base">
                天
              </div>
            </div>
            <div>
              <span className="font-bold text-white text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                <span>천기누설</span>
                <span className="text-xs font-serif font-normal text-amber-400">
                  (天機漏洩)
                </span>
              </span>
              <p className="text-[10px] text-neutral-400 tracking-wider font-medium">
                AI 모던 사주명리 리포트
              </p>
            </div>
          </div>

          {/* 우측 도구 바 */}
          <div className="flex items-center gap-2 sm:gap-3">
            {manseryeok && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700/80 transition-all"
                title="새로운 사주 풀이하기"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">다시 입력</span>
              </button>
            )}

            <button
              onClick={() => setIsProfileDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700/80 transition-all relative"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">사주 보관함</span>
              {savedProfiles.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center justify-center">
                  {savedProfiles.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700/80 transition-all"
              title="API 설정"
            >
              <Settings className="w-4 h-4 text-neutral-300" />
            </button>
          </div>
        </div>
      </header>

      {/* 메인 본문 콘텐츠 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!manseryeok || !report ? (
          /* 1. 사주 분석 전: 히어로 소개 & 입력 폼 */
          <div className="space-y-10">
            {/* 히어로 헤더 */}
            <div className="text-center max-w-2xl mx-auto space-y-3 pt-4 sm:pt-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>정통 60갑자 만세력 알고리즘 & Gemini AI의 만남</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                나를 이끄는 <span className="text-gold-light">천명(天命)</span>과<br className="hidden sm:inline" />
                2026년 운의 흐름을 꿰뚫다
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal">
                생년월일시를 입력하시면 정밀 4주 8글자와 오행 밸런스를 산출하고,<br className="hidden sm:inline" />
                지혜로운 사주 명리 AI가 나만의 재물·직업·연애·개운법을 풀어드립니다.
              </p>
            </div>

            {/* 입력 폼 컴포넌트 */}
            <div className="max-w-xl mx-auto">
              <SajuInputForm
                onSubmit={handleAnalyze}
                isLoading={isLoading}
                savedProfiles={savedProfiles}
                onSelectProfile={(p) => {
                  handleAnalyze({
                    name: p.name,
                    gender: p.gender,
                    isLunar: p.isLunar,
                    isLeapMonth: p.isLeapMonth,
                    year: p.year,
                    month: p.month,
                    day: p.day,
                    hasTime: p.hasTime,
                    timeSlot: p.timeSlot,
                    hour: p.hour,
                    minute: p.minute,
                  });
                }}
                onSaveProfile={handleSaveProfile}
              />
            </div>

            {/* 특징 소개 카드 4종 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 max-w-5xl mx-auto">
              <div className="card-oriental rounded-2xl p-5 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">정밀 만세력 4주 8자</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  24절기 절입 시각과 한국 표준시를 정밀 반영하여 일주와 십신을 정확하게 도출합니다.
                </p>
              </div>

              <div className="card-oriental rounded-2xl p-5 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Moon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">오행 밸런스 시각화</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  목·화·토·금·수 오행의 과다와 결핍을 한눈에 파악하고 맞춤 개운 처방을 제공합니다.
                </p>
              </div>

              <div className="card-oriental rounded-2xl p-5 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                  <ScrollText className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">4대 핵심 영역 리포트</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  재물복의 그릇, 최적의 커리어, 애정 스타일과 2026년 병오년 세운을 심층 해설합니다.
                </p>
              </div>

              <div className="card-oriental rounded-2xl p-5 border border-neutral-800/80">
                <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">1:1 AI 사주도사 문답</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  리포트를 바탕으로 궁금한 점을 즉시 물어보고 따뜻한 지혜와 처세술을 나눕니다.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* 2. 사주 분석 완료 후: 결과 대시보드 */
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* 상단 브레드크럼 & 사용자 알림 */}
            <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-1.5">
                <span>사주 분석 결과</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-amber-300 font-semibold">{manseryeok.birthDate.name}님</span>
              </div>
              <button
                onClick={handleReset}
                className="text-amber-400 hover:text-amber-300 underline font-medium"
              >
                다른 사주 분석하기
              </button>
            </div>

            {/* 1) 4주 8글자 사주 원국표 */}
            <SajuWonGukView manseryeok={manseryeok} />

            {/* 2) 오행 밸런스 및 보완 차트 */}
            <OhaengChart manseryeok={manseryeok} />

            {/* 3) 4대 핵심운 및 올해 운세 상세 리포트 */}
            <SajuReportView
              report={report}
              manseryeok={manseryeok}
              isAI={isAI}
              onOpenChat={() => setIsChatOpen(true)}
              onOpenShareCard={() => setIsShareCardOpen(true)}
            />
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/80 py-8 px-4 sm:px-6 text-center text-xs text-neutral-400 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>개인정보 안심 보호: 입력하신 생년월일시는 브라우저에만 안전하게 보관됩니다.</span>
        </div>
        <p>© 2026 천기누설(天機漏洩) · 정통 명리학과 Google Gemini AI의 만남</p>
      </footer>

      {/* 모달 레이어 */}
      {manseryeok && report && (
        <>
          <SajuChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            manseryeok={manseryeok}
            report={report}
            customApiKey={customApiKey}
          />
          <SajuShareCard
            isOpen={isShareCardOpen}
            onClose={() => setIsShareCardOpen(false)}
            manseryeok={manseryeok}
            report={report}
          />
        </>
      )}

      <ProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        profiles={savedProfiles}
        onSelect={(p) => {
          handleAnalyze({
            name: p.name,
            gender: p.gender,
            isLunar: p.isLunar,
            isLeapMonth: p.isLeapMonth,
            year: p.year,
            month: p.month,
            day: p.day,
            hasTime: p.hasTime,
            timeSlot: p.timeSlot,
            hour: p.hour,
            minute: p.minute,
          });
        }}
        onDelete={handleDeleteProfile}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customApiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
