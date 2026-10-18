'use client';

import React, { useState } from 'react';
import { SajuAnalysisReport, ManseryeokResult } from '@/lib/saju/types';
import {
  Sparkles,
  Coins,
  Briefcase,
  Heart,
  Calendar,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface Props {
  report: SajuAnalysisReport;
  manseryeok: ManseryeokResult;
  isAI: boolean;
  onOpenChat: () => void;
  onOpenShareCard: () => void;
}

export const SajuReportView: React.FC<Props> = ({
  report,
  manseryeok,
  isAI,
  onOpenChat,
  onOpenShareCard,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'nature' | 'wealth' | 'career' | 'love' | 'year'>('all');

  const tabs = [
    { id: 'all', label: '종합 리포트', icon: Sparkles },
    { id: 'nature', label: '본성 · 잠재력', icon: Lightbulb },
    { id: 'wealth', label: '재물 · 사업운', icon: Coins },
    { id: 'career', label: '직업 · 적성운', icon: Briefcase },
    { id: 'love', label: '연애 · 대인관계', icon: Heart },
    { id: 'year', label: '2026년 올해운', icon: Calendar },
  ];

  return (
    <div className="w-full space-y-6">
      {/* 액션 바: AI 상태 표시 및 챗봇/공유 버튼 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-amber-500/20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">
            {isAI ? 'Google Gemini AI 심층 맞춤 풀이 완료' : '정밀 명리학 로컬 엔진 맞춤 풀이 완료'}
          </span>
          {isAI && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              AI Insight
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenShareCard}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium border border-neutral-700 transition-all hover:border-amber-500/40"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>결과 카드 저장</span>
          </button>

          <button
            onClick={onOpenChat}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-900/30 transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>AI 사주도사와 1:1 대화</span>
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 리포트 콘텐츠 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. 타고난 본성과 잠재력 */}
        {(activeTab === 'all' || activeTab === 'nature') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">타고난 기질과 잠재력</h3>
                  <p className="text-xs text-neutral-400">나를 이끄는 본원의 본성과 그릇</p>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-serif">
                {manseryeok.ilgan.hangul}({manseryeok.ilgan.hanja})
              </span>
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed font-normal">
              {report.personality.summary}
            </p>

            {/* 강점 */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 타고난 핵심 강점
              </span>
              <ul className="space-y-1.5">
                {report.personality.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 주의할 점 */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> 마음 챙김 및 주의할 점
              </span>
              <ul className="space-y-1.5">
                {report.personality.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2 pl-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 지혜의 조언 */}
            <div className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-amber-200/90 leading-relaxed">
              💡 <strong>스승의 조언:</strong> {report.personality.advice}
            </div>
          </div>
        )}

        {/* 2. 재물운 & 사업운 */}
        {(activeTab === 'all' || activeTab === 'wealth') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">재물운 & 부의 그릇</h3>
                  <p className="text-xs text-neutral-400">자산 축적 방식과 재물 전성기</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                재물복: {report.wealth.grade}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-neutral-400 block mb-1">재물 축적 스타일</span>
                <p className="text-sm text-neutral-200 leading-relaxed">{report.wealth.style}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-neutral-400 block mb-1">재물운이 트이는 타이밍</span>
                <p className="text-sm text-amber-200/90 leading-relaxed">{report.wealth.timing}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-neutral-300 leading-relaxed">
                💰 <strong>현실적 부자 실천법:</strong> {report.wealth.actionableTip}
              </div>
            </div>
          </div>
        )}

        {/* 3. 직업 & 적성운 */}
        {(activeTab === 'all' || activeTab === 'career') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">직업 & 진로 적성</h3>
                  <p className="text-xs text-neutral-400">나의 역량이 가장 빛나는 무대</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 block mb-2">추천 직무 및 분야</span>
              <div className="flex flex-wrap gap-2">
                {report.career.bestFields.map((field, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-neutral-800 text-sky-300 text-xs font-medium border border-sky-500/20"
                  >
                    #{field}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 block mb-1">최적의 업무 환경</span>
              <p className="text-sm text-neutral-200 leading-relaxed">{report.career.workStyle}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs text-neutral-300 leading-relaxed">
              🎯 <strong>커리어 도약 포인트:</strong> {report.career.growthPoint}
            </div>
          </div>
        )}

        {/* 4. 연애 & 대인관계 */}
        {(activeTab === 'all' || activeTab === 'love') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">애정 & 대인관계운</h3>
                  <p className="text-xs text-neutral-400">사랑의 결실과 어울리는 인연</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 block mb-1">나의 연애 스타일</span>
              <p className="text-sm text-neutral-200 leading-relaxed">{report.love.style}</p>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-400 block mb-1">복이 되는 찰떡 인연의 유형</span>
              <p className="text-sm text-rose-200/90 leading-relaxed">{report.love.compatibleTypes}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-neutral-300 leading-relaxed">
              ❤️ <strong>행복한 관계를 위한 마음가짐:</strong> {report.love.relationshipAdvice}
            </div>
          </div>
        )}

        {/* 5. 2026년 병오년(丙午年) 올해 운세 */}
        {(activeTab === 'all' || activeTab === 'year') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {report.currentYearFortune.year}년 병오년(丙午年) 운세 총평
                  </h3>
                  <p className="text-xs text-amber-400 font-medium">{report.currentYearFortune.title}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30">
                붉은 말의 해 (赤馬)
              </span>
            </div>

            <p className="text-sm text-neutral-200 leading-relaxed">{report.currentYearFortune.flow}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 올해 반드시 잡아야 할 기회
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">{report.currentYearFortune.opportunity}</p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> 올해 주의하고 삼가야 할 점
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">{report.currentYearFortune.caution}</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. 나만의 맞춤 개운 비결 (開運法) */}
        {(activeTab === 'all' || activeTab === 'nature') && (
          <div className="card-oriental rounded-2xl p-6 sm:p-7 space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">나만의 맞춤 개운법 (開運法)</h3>
                <p className="text-xs text-neutral-400">부족한 기운을 채워 행운과 복을 부르는 비결</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">행운의 컬러</span>
                <div className="flex items-center gap-1.5">
                  {report.kaewun.luckyColors.map((color, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-neutral-800 text-amber-300 text-xs font-medium border border-amber-500/20"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">행운의 숫자</span>
                <span className="text-sm font-bold text-white">{report.kaewun.luckyNumber}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <span className="text-xs text-neutral-400 block mb-1">길한 방위</span>
                <span className="text-sm font-bold text-white">{report.kaewun.luckyDirection}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-neutral-300 leading-relaxed">
              🌿 <strong>일상 개운 습관:</strong> {report.kaewun.mindset}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
