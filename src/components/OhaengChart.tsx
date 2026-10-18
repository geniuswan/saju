'use client';

import React from 'react';
import { ManseryeokResult, Ohaeng } from '@/lib/saju/types';
import { OHAENG_STYLE } from './SajuWonGukView';
import { OHAENG_KAEWUN } from '@/lib/saju/interpretations';
import { Activity, Flame, TreePine, Mountain, Coins, Droplets, AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  manseryeok: ManseryeokResult;
}

const OHAENG_ICONS: Record<Ohaeng, React.ReactNode> = {
  목: <TreePine className="w-4 h-4 text-emerald-400" />,
  화: <Flame className="w-4 h-4 text-rose-400" />,
  토: <Mountain className="w-4 h-4 text-amber-400" />,
  금: <Coins className="w-4 h-4 text-slate-300" />,
  수: <Droplets className="w-4 h-4 text-sky-400" />,
};

const OHAENG_MEANINGS: Record<Ohaeng, string> = {
  목: '성장 · 추진력 · 어짊(仁)',
  화: '열정 · 표현력 · 예의(禮)',
  토: '안정 · 포용력 · 믿음(信)',
  금: '결단 · 원칙 · 의리(義)',
  수: '지혜 · 유연함 · 통찰(智)',
};

export const OhaengChart: React.FC<Props> = ({ manseryeok }) => {
  const { ohaengCounts, ohaengPercentages, dominantOhaeng, lackingOhaeng } = manseryeok;
  const elements: Ohaeng[] = ['목', '화', '토', '금', '수'];

  return (
    <div className="w-full card-oriental rounded-2xl p-6 sm:p-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
              오행 밸런스 분석
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">
            목·화·토·금·수 오행의 분포와 조화
          </h3>
        </div>
      </div>

      {/* 오행 게이지 막대 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
        {elements.map((el) => {
          const count = ohaengCounts[el];
          const pct = ohaengPercentages[el];
          const style = OHAENG_STYLE[el];
          const isDominant = dominantOhaeng.includes(el);
          const isLacking = lackingOhaeng.includes(el);

          return (
            <div
              key={el}
              className={`rounded-xl p-4 border flex flex-col justify-between transition-all ${
                isDominant
                  ? 'border-amber-400/60 bg-amber-950/20 shadow-md ring-1 ring-amber-400/30'
                  : isLacking
                  ? 'border-neutral-800 bg-neutral-900/30 opacity-75'
                  : 'border-neutral-800 bg-neutral-950/50'
              }`}
            >
              {/* 상단 요소 정보 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {OHAENG_ICONS[el]}
                  <span className="font-bold text-white text-base">
                    {el} <span className="text-xs font-normal text-neutral-400">({style.hanja})</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-white">{count}개</span>
                  <span className="text-xs text-neutral-400">({pct}%)</span>
                </div>
              </div>

              {/* 진행도 바 */}
              <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    el === '목'
                      ? 'bg-emerald-500'
                      : el === '화'
                      ? 'bg-rose-500'
                      : el === '토'
                      ? 'bg-amber-500'
                      : el === '금'
                      ? 'bg-slate-300'
                      : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, pct))}%` }}
                />
              </div>

              {/* 상태 뱃지 */}
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-800/80">
                <span className="text-neutral-400 truncate">{OHAENG_MEANINGS[el]}</span>
                {isDominant && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 text-[10px]">
                    발달(과다)
                  </span>
                )}
                {isLacking && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium text-[10px]">
                    부족(결핍)
                  </span>
                )}
                {!isDominant && !isLacking && (
                  <span className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 font-medium text-[10px]">
                    적정
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 오행 진단 요약 및 보완 팁 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* 과다 기운 진단 */}
        <div className="rounded-xl p-4 bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">가장 왕성한 에너지</h4>
          </div>
          {dominantOhaeng.length > 0 ? (
            <p className="text-xs text-neutral-300 leading-relaxed">
              사주 내에 <strong className="text-amber-300 font-semibold">{dominantOhaeng.join(', ')}</strong>의 기운이
              가장 강하게 자리잡고 있습니다. 이는 본인의 강력한 무기이자 핵심 재능이지만, 너무 지나칠 경우 에너지가
              한쪽으로 쏠릴 수 있으므로 유연한 중용의 미덕이 필요합니다.
            </p>
          ) : (
            <p className="text-xs text-neutral-300 leading-relaxed">
              오행이 어느 한쪽으로 치우침 없이 비교적 고르고 평온하게 순환하는 <strong className="text-emerald-400">오행구족(五行具足)</strong>의 기운을 지녔습니다.
            </p>
          )}
        </div>

        {/* 결핍 기운 보완(개운) 가이드 */}
        <div className="rounded-xl p-4 bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold text-white">보완하면 운이 트이는 기운 (개운법)</h4>
          </div>
          {lackingOhaeng.length > 0 ? (
            <div className="text-xs text-neutral-300 leading-relaxed space-y-1">
              <p>
                사주에 <strong className="text-sky-300 font-semibold">{lackingOhaeng.join(', ')}</strong> 기운이 부족합니다.
              </p>
              {lackingOhaeng.slice(0, 1).map((lack) => {
                const k = OHAENG_KAEWUN[lack];
                return (
                  <p key={lack} className="text-neutral-400">
                    💡 <span className="text-neutral-200">추천 보완책:</span> {k.colors.join('/')} 계열의 소품/의상, 행운 숫자 {k.numbers}, {k.food} 등을 가까이 하시면 균형이 맞춰집니다.
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-neutral-300 leading-relaxed">
              부족한 오행 없이 5가지 원소가 모두 갖추어져 있습니다. 현재의 균형 감각을 유지하며 일상에서 규칙적인 호흡을 이어가세요.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
