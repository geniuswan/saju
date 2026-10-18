'use client';

import React, { useRef, useState } from 'react';
import { ManseryeokResult, SajuAnalysisReport } from '@/lib/saju/types';
import { toPng } from 'html-to-image';
import { X, Download, Sparkles, Check } from 'lucide-react';
import { OHAENG_STYLE } from './SajuWonGukView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  manseryeok: ManseryeokResult;
  report: SajuAnalysisReport;
}

export const SajuShareCard: React.FC<Props> = ({
  isOpen,
  onClose,
  manseryeok,
  report,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);

    try {
      // 폰트 및 렌더링 안정화를 위한 옵션
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${manseryeok.birthDate.name || '사주'}_천명_결과카드.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert('이미지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsDownloading(false);
    }
  };

  const { pillars, ilgan, ilju } = manseryeok;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md card-oriental rounded-2xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        {/* 상단 닫기 바 */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/60">
          <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 사주 결과 카드 내보내기
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 다운로드 대상 카드 영역 (DOM) */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] flex justify-center">
          <div
            ref={cardRef}
            className="w-full rounded-2xl p-6 relative overflow-hidden text-white"
            style={{
              background: 'linear-gradient(145deg, #11141e 0%, #0a0c13 100%)',
              border: '2px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
            }}
          >
            {/* 전통 문양 장식 코너 */}
            <div className="absolute top-2 left-2 text-[10px] text-amber-500/40 font-serif">卍</div>
            <div className="absolute top-2 right-2 text-[10px] text-amber-500/40 font-serif">卍</div>
            <div className="absolute bottom-2 left-2 text-[10px] text-amber-500/40 font-serif">卍</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-amber-500/40 font-serif">卍</div>

            {/* 카드 상단 헤더 */}
            <div className="text-center pb-4 mb-4 border-b border-amber-500/20">
              <span className="text-[11px] font-bold text-amber-400 tracking-widest uppercase">
                天命 · 사주명리 리포트
              </span>
              <h3 className="text-xl font-black mt-1 text-white">
                {manseryeok.birthDate.name || '내담자'}님의 타고난 천명
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {ilju.hangul} ({ilju.hanja}) 일주 · {ilgan.title}
              </p>
            </div>

            {/* 사주 4주 8자 미니 표 */}
            <div className="grid grid-cols-4 gap-1.5 mb-4 text-center">
              {[
                { label: '시주', data: pillars.hour },
                { label: '일주', data: pillars.day, isDay: true },
                { label: '월주', data: pillars.month },
                { label: '연주', data: pillars.year },
              ].map((p, idx) => {
                if (!p.data) {
                  return (
                    <div key={idx} className="p-2 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[10px] text-neutral-400">
                      <div>시주</div>
                      <div className="my-1">-</div>
                      <div>미상</div>
                    </div>
                  );
                }
                const gStyle = OHAENG_STYLE[p.data.gan.ohaeng];
                const jStyle = OHAENG_STYLE[p.data.ji.ohaeng];

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      p.isDay
                        ? 'border-amber-400/80 bg-amber-950/30'
                        : 'border-neutral-800 bg-neutral-900/40'
                    }`}
                  >
                    <div className="text-[10px] text-neutral-400">{p.label}</div>
                    <div className="text-lg font-serif font-black text-white my-0.5 drop-shadow">
                      {p.data.gan.hanja}
                    </div>
                    <div className="text-[10px] font-bold mb-1" style={{ color: gStyle.text.replace('text-', '') }}>
                      {p.data.gan.hangul}
                    </div>
                    <div className="text-lg font-serif font-black text-white drop-shadow">
                      {p.data.ji.hanja}
                    </div>
                    <div className="text-[10px] font-bold" style={{ color: jStyle.text.replace('text-', '') }}>
                      {p.data.ji.hangul}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 핵심 본성 요약 */}
            <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800/80 mb-3 text-xs text-neutral-200 leading-relaxed">
              &quot;{report.personality.summary.slice(0, 100)}...&quot;
            </div>

            {/* 핵심 강점 2가지 */}
            <div className="mb-3 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 block">✨ 타고난 핵심 무기</span>
              {report.personality.strengths.slice(0, 2).map((s, i) => (
                <div key={i} className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{s}</span>
                </div>
              ))}
            </div>

            {/* 2026 올해의 운세 */}
            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 mb-3 text-[11px] text-amber-200">
              <strong>2026 병오년:</strong> {report.currentYearFortune.title}
            </div>

            {/* 개운 칩 */}
            <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] text-neutral-400">
              <div>
                행운 색: <span className="text-white font-medium">{report.kaewun.luckyColors.join(', ')}</span>
              </div>
              <div>
                행운 수: <span className="text-white font-medium">{report.kaewun.luckyNumber}</span>
              </div>
              <div className="font-bold text-amber-400">천기누설 사주</div>
            </div>
          </div>
        </div>

        {/* 하단 다운로드 버튼 */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 flex items-center gap-3">
          <button
            onClick={handleDownloadImage}
            disabled={isDownloading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>다운로드 완료!</span>
              </>
            ) : isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>카드 이미지 생성 중...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>결과 카드 이미지 저장 (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
