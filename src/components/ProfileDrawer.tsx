'use client';

import React from 'react';
import { SajuProfile } from '@/lib/saju/types';
import { X, Trash2, UserCheck, Calendar, Users } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  profiles: SajuProfile[];
  onSelect: (profile: SajuProfile) => void;
  onDelete: (id: string) => void;
}

export const ProfileDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  profiles,
  onSelect,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md card-oriental rounded-2xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">저장된 사주 보관함</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-3">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              <p>아직 저장된 사주 프로필이 없습니다.</p>
              <p className="mt-1 text-neutral-400">사주 입력 폼에서 저장하기를 누르면 보관됩니다.</p>
            </div>
          ) : (
            profiles.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40 transition-all flex items-center justify-between gap-3"
              >
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                      {p.relation}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {p.gender === 'male' ? '남' : '여'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-neutral-400" />
                    <span>
                      {p.isLunar ? '음력' : '양력'} {p.year}.{p.month}.{p.day}
                    </span>
                    <span>{p.hasTime ? '시간 입력됨' : '시간 모름'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      onSelect(p);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs transition-colors"
                    title="선택하여 불러오기"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
