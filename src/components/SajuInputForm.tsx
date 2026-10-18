'use client';

import React, { useState } from 'react';
import { TIME_SLOTS } from '@/lib/saju/manseryeok';
import { SajuProfile } from '@/lib/saju/types';
import { Sparkles, Calendar, Clock, User, BookmarkPlus, Users } from 'lucide-react';

export interface SajuFormInput {
  name: string;
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
}

interface Props {
  onSubmit: (data: SajuFormInput) => void;
  isLoading: boolean;
  savedProfiles: SajuProfile[];
  onSelectProfile: (profile: SajuProfile) => void;
  onSaveProfile: (profile: Omit<SajuProfile, 'id' | 'createdAt'>) => void;
}

export const SajuInputForm: React.FC<Props> = ({
  onSubmit,
  isLoading,
  savedProfiles,
  onSelectProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState('홍길동');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [isLunar, setIsLunar] = useState(false);
  const [isLeapMonth, setIsLeapMonth] = useState(false);

  // 기본값: 1995년 8월 15일
  const [year, setYear] = useState<number>(1995);
  const [month, setMonth] = useState<number>(8);
  const [day, setDay] = useState<number>(15);

  const [hasTime, setHasTime] = useState(true);
  const [timeMode, setTimeMode] = useState<'slot' | 'exact'>('slot');
  const [timeSlot, setTimeSlot] = useState<string>('5'); // 사시 (09:30 ~ 11:29)
  const [hour, setHour] = useState<number>(10);
  const [minute, setMinute] = useState<number>(30);

  const [saveProfileRelation, setSaveProfileRelation] = useState('본인');
  const [showSaveBox, setShowSaveBox] = useState(false);

  // 연도 목록 (1930 ~ 2026)
  const years = Array.from({ length: 97 }, (_, i) => 2026 - i);
  // 월 목록 (1 ~ 12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  // 일 목록 (해당 월의 최대 일자 계산)
  const maxDays = new Date(year, month, 0).getDate();
  const days = Array.from({ length: maxDays }, (_, i) => i + 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedHour = hour;
    let computedMinute = minute;

    if (hasTime && timeMode === 'slot') {
      const slot = TIME_SLOTS.find((s) => s.id === timeSlot);
      if (slot) {
        computedHour = slot.hour;
        computedMinute = 0;
      }
    }

    const payload: SajuFormInput = {
      name: name.trim() || '내담자',
      gender,
      isLunar,
      isLeapMonth: isLunar && isLeapMonth,
      year: Number(year),
      month: Number(month),
      day: Math.min(Number(day), maxDays),
      hasTime,
      timeSlot,
      hour: hasTime ? computedHour : undefined,
      minute: hasTime ? computedMinute : undefined,
    };

    onSubmit(payload);

    if (showSaveBox) {
      onSaveProfile({
        name: payload.name,
        relation: saveProfileRelation,
        gender: payload.gender,
        isLunar: payload.isLunar,
        isLeapMonth: payload.isLeapMonth,
        year: payload.year,
        month: payload.month,
        day: payload.day,
        hasTime: payload.hasTime,
        timeSlot: payload.timeSlot,
        hour: payload.hour,
        minute: payload.minute,
      });
      setShowSaveBox(false);
    }
  };

  const handleProfileSelect = (p: SajuProfile) => {
    setName(p.name);
    setGender(p.gender);
    setIsLunar(p.isLunar);
    setIsLeapMonth(p.isLeapMonth);
    setYear(p.year);
    setMonth(p.month);
    setDay(p.day);
    setHasTime(p.hasTime);
    if (p.timeSlot) setTimeSlot(p.timeSlot);
    if (p.hour !== undefined) setHour(p.hour);
    if (p.minute !== undefined) setMinute(p.minute);
    onSelectProfile(p);
  };

  return (
    <div className="w-full card-oriental rounded-2xl p-6 sm:p-8">
      {/* 상단 프로필 바로가기 */}
      {savedProfiles.length > 0 && (
        <div className="mb-6 pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-amber-300">
            <Users className="w-3.5 h-3.5" /> 저장된 사주 프로필
          </div>
          <div className="flex flex-wrap gap-2">
            {savedProfiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProfileSelect(p)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 hover:border-amber-500/40 text-xs text-neutral-200 transition-all flex items-center gap-1.5"
              >
                <span className="font-semibold text-white">{p.name}</span>
                <span className="text-[11px] text-amber-400">({p.relation})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 & 성별 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              이름 (또는 별칭)
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 홍길동"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none text-white text-sm"
              />
              <User className="w-4 h-4 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              성별 (대운 계산 필수)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                  gender === 'female'
                    ? 'bg-rose-950/40 text-rose-300 border-rose-500/50 shadow-inner'
                    : 'bg-neutral-900/80 text-neutral-400 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                여성 (Female)
              </button>
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                  gender === 'male'
                    ? 'bg-sky-950/40 text-sky-300 border-sky-500/50 shadow-inner'
                    : 'bg-neutral-900/80 text-neutral-400 border-neutral-700 hover:border-neutral-600'
                }`}
              >
                남성 (Male)
              </button>
            </div>
          </div>
        </div>

        {/* 양력/음력 구분 & 윤달 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> 달력 구분
            </label>
            {isLunar && (
              <label className="flex items-center gap-1.5 text-xs text-amber-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLeapMonth}
                  onChange={(e) => setIsLeapMonth(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-400"
                />
                <span>윤달(閏月) 여부</span>
              </label>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsLunar(false)}
              className={`py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                !isLunar
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              양력 (Solar)
            </button>
            <button
              type="button"
              onClick={() => setIsLunar(true)}
              className={`py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                isLunar
                  ? 'bg-amber-500 text-black font-bold shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 border-neutral-700 hover:border-neutral-600'
              }`}
            >
              음력 (Lunar)
            </button>
          </div>
        </div>

        {/* 생년월일 선택 */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
            생년월일
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* 년 */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>

            {/* 월 */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>

            {/* 일 */}
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 태어난 시간 */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> 태어난 시간
            </label>
            <label className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white cursor-pointer">
              <input
                type="checkbox"
                checked={!hasTime}
                onChange={(e) => setHasTime(!e.target.checked)}
                className="rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-400"
              />
              <span>태어난 시간 모름</span>
            </label>
          </div>

          {hasTime ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setTimeMode('slot')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeMode === 'slot'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  12간지 시간대 선택
                </button>
                <button
                  type="button"
                  onClick={() => setTimeMode('exact')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    timeMode === 'exact'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  직접 시/분 입력
                </button>
              </div>

              {timeMode === 'slot' ? (
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={hour}
                    onChange={(e) => setHour(Number(e.target.value))}
                    className="px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}시
                      </option>
                    ))}
                  </select>
                  <select
                    value={minute}
                    onChange={(e) => setMinute(Number(e.target.value))}
                    className="px-3 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}분
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
              * 시간을 모르시는 경우 시주(時柱)를 제외한 삼주 6글자(연·월·일)를 기준으로 가장 유력한 본성과 운세를 도출합니다.
            </div>
          )}
        </div>

        {/* 프로필 저장 체크 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowSaveBox(!showSaveBox)}
            className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>이 사주 정보를 브라우저에 저장하기</span>
          </button>

          {showSaveBox && (
            <div className="mt-2 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
              <span className="text-xs text-neutral-400 shrink-0">관계 설정:</span>
              <div className="flex flex-wrap gap-1.5">
                {['본인', '배우자', '연인', '가족', '친구'].map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setSaveProfileRelation(rel)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      saveProfileRelation === rel
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 분석 시작 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-base tracking-wide shadow-lg shadow-amber-900/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>하늘의 기운을 풀이하는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>천명(天命) 사주 풀이 시작하기</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
