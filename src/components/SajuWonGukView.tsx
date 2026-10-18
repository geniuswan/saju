'use client';

import React from 'react';
import { ManseryeokResult, PillarData, Ohaeng } from '@/lib/saju/types';
import { Sparkles, User, HelpCircle } from 'lucide-react';

interface Props {
  manseryeok: ManseryeokResult;
}

// 오행별 색상 스타일 맵핑
export const OHAENG_STYLE: Record<
  Ohaeng,
  {
    bg: string;
    border: string;
    text: string;
    hanja: string;
    name: string;
    lightBg: string;
  }
> = {
  목: {
    bg: 'bg-emerald-950/50',
    border: 'border-emerald-500/40',
    text: 'text-emerald-400',
    hanja: '木',
    name: '목(Wood)',
    lightBg: 'bg-emerald-500/20 text-emerald-300',
  },
  화: {
    bg: 'bg-rose-950/50',
    border: 'border-rose-500/40',
    text: 'text-rose-400',
    hanja: '火',
    name: '화(Fire)',
    lightBg: 'bg-rose-500/20 text-rose-300',
  },
  토: {
    bg: 'bg-amber-950/50',
    border: 'border-amber-500/40',
    text: 'text-amber-400',
    hanja: '土',
    name: '토(Earth)',
    lightBg: 'bg-amber-500/20 text-amber-300',
  },
  금: {
    bg: 'bg-slate-800/60',
    border: 'border-slate-300/40',
    text: 'text-slate-200',
    hanja: '金',
    name: '금(Metal)',
    lightBg: 'bg-slate-300/20 text-slate-100',
  },
  수: {
    bg: 'bg-sky-950/50',
    border: 'border-sky-500/40',
    text: 'text-sky-400',
    hanja: '水',
    name: '수(Water)',
    lightBg: 'bg-sky-500/20 text-sky-300',
  },
};

export const SajuWonGukView: React.FC<Props> = ({ manseryeok }) => {
  const { pillars, ilgan, ilju } = manseryeok;

  // 전통 표기 순서: 시주(時) -> 일주(日) -> 월주(月) -> 연주(年)
  const pillarList: {
    title: string;
    hanja: string;
    sub: string;
    data: PillarData | null;
    isDayPillar?: boolean;
  }[] = [
    {
      title: '시주',
      hanja: '時柱',
      sub: '말년 · 자녀 · 결실',
      data: pillars.hour,
    },
    {
      title: '일주',
      hanja: '日柱',
      sub: '나(본원) · 배우자 · 중년',
      data: pillars.day,
      isDayPillar: true,
    },
    {
      title: '월주',
      hanja: '月柱',
      sub: '사회 · 부모 · 청년',
      data: pillars.month,
    },
    {
      title: '연주',
      hanja: '年柱',
      sub: '뿌리 · 조상 · 초년',
      data: pillars.year,
    },
  ];

  return (
    <div className="w-full card-oriental rounded-2xl p-6 sm:p-8">
      {/* 상단 헤더: 일간 요약 배너 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              천명(天命) 사주 원국
            </span>
            <span className="text-xs text-neutral-400">
              {manseryeok.birthDate.isLunar ? '음력' : '양력'} {manseryeok.birthDate.solarYear}년{' '}
              {manseryeok.birthDate.solarMonth}월 {manseryeok.birthDate.solarDay}일생
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>{manseryeok.birthDate.name || '내담자'}님의 4주 8글자</span>
            <span className="text-amber-400 text-sm font-normal">
              [{ilju.hangul} ({ilju.hanja}) 일주]
            </span>
          </h2>
        </div>

        {/* 나를 나타내는 일간 뱃지 */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 shadow-inner">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/50">
            {ilgan.hanja}
          </div>
          <div>
            <div className="text-xs text-amber-300/80 flex items-center gap-1 font-medium">
              <User className="w-3 h-3" /> 나를 상징하는 본원(日干)
            </div>
            <div className="text-sm font-bold text-white">
              {ilgan.title}
            </div>
          </div>
        </div>
      </div>

      {/* 4주 8글자 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {pillarList.map((col, idx) => {
          if (!col.data) {
            // 시간 모름 (시주 미입력)
            return (
              <div
                key={idx}
                className="flex flex-col rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-4 items-center justify-center text-center min-h-[300px]"
              >
                <div className="text-xs font-semibold text-neutral-400 mb-1">{col.title} ({col.hanja})</div>
                <div className="text-[11px] text-neutral-400 mb-6">{col.sub}</div>
                <HelpCircle className="w-8 h-8 text-neutral-400 mb-2" />
                <span className="text-sm font-medium text-neutral-400">태어난 시 미입력</span>
                <span className="text-xs text-neutral-400 mt-1">삼주(6자) 기반 분석</span>
              </div>
            );
          }

          const { gan, ji } = col.data;
          const ganStyle = OHAENG_STYLE[gan.ohaeng];
          const jiStyle = OHAENG_STYLE[ji.ohaeng];

          return (
            <div
              key={idx}
              className={`flex flex-col rounded-xl border transition-all duration-300 relative overflow-hidden ${
                col.isDayPillar
                  ? 'border-amber-400/60 bg-gradient-to-b from-amber-950/30 to-black/60 shadow-[0_0_20px_rgba(212,175,55,0.15)] ring-1 ring-amber-400/40'
                  : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
              }`}
            >
              {/* 일주(나) 강조 리본 */}
              {col.isDayPillar && (
                <div className="bg-amber-500/90 text-black text-[10px] font-bold py-0.5 px-3 text-center tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 나의 일주 (본인)
                </div>
              )}

              {/* 기둥 타이틀 */}
              <div className="text-center py-2.5 px-2 border-b border-neutral-800/80 bg-neutral-900/40">
                <span className="text-sm font-bold text-white tracking-wide">
                  {col.title}
                </span>{' '}
                <span className="text-xs text-amber-400/80 font-serif">
                  ({col.hanja})
                </span>
                <p className="text-[11px] text-neutral-400 mt-0.5">{col.sub}</p>
              </div>

              {/* 천간 (상단 글자) */}
              <div
                className={`p-4 flex flex-col items-center justify-center border-b border-neutral-800/60 ${ganStyle.bg}`}
              >
                {/* 십신 뱃지 */}
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full mb-1.5 ${ganStyle.lightBg}`}>
                  {gan.sipsin}
                </span>
                {/* 한자 */}
                <div className="text-4xl font-serif font-black text-white drop-shadow-md my-0.5">
                  {gan.hanja}
                </div>
                {/* 한글 & 오행 */}
                <div className="text-xs text-neutral-300 font-medium flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-white text-sm">{gan.hangul}</span>
                  <span className={`text-[11px] font-medium ${ganStyle.text}`}>
                    {ganStyle.name} ({gan.eumyang})
                  </span>
                </div>
              </div>

              {/* 지지 (하단 글자) */}
              <div
                className={`p-4 flex flex-col items-center justify-center flex-1 ${jiStyle.bg}`}
              >
                {/* 십신 뱃지 */}
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full mb-1.5 ${jiStyle.lightBg}`}>
                  {ji.sipsin}
                </span>
                {/* 한자 */}
                <div className="text-4xl font-serif font-black text-white drop-shadow-md my-0.5">
                  {ji.hanja}
                </div>
                {/* 한글 & 띠 동물 */}
                <div className="text-xs text-neutral-300 font-medium flex items-center gap-1.5 mt-1">
                  <span className="font-bold text-white text-sm">{ji.hangul}</span>
                  <span className={`text-[11px] font-medium ${jiStyle.text}`}>
                    {jiStyle.name} ({ji.animal})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 범례 */}
      <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-neutral-400">
        <span className="text-neutral-400 font-medium">오행 범례:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> 목 (木 · 푸른색)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> 화 (火 · 붉은색)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> 토 (土 · 노란색)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" /> 금 (金 · 흰색)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> 수 (水 · 검은/푸른색)
        </span>
      </div>
    </div>
  );
};
