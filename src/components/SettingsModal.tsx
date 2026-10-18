'use client';

import React, { useState } from 'react';
import { X, Key, Check, Info, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  customApiKey,
  onSaveApiKey,
}) => {
  const [key, setKey] = useState(customApiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(key.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md card-oriental rounded-2xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Google Gemini API 설정</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 text-xs text-neutral-300">
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              서버 환경변수(<code className="text-amber-300">.env.local</code>의{' '}
              <code className="text-amber-300">GEMINI_API_KEY</code>)가 설정되어 있으면 별도 입력 없이도 동작합니다.
              본인의 개인 API 키를 직접 사용하여 실시간 AI 풀이와 대화를 진행하고 싶으실 경우 아래에 입력해 주세요.
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-sm focus:border-amber-400 outline-none"
            />
            <span className="text-[11px] text-neutral-400 mt-1 block">
              * 입력하신 API 키는 브라우저 로컬 저장소에만 보관되며 외부에 유출되지 않습니다.
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Google AI Studio에서 무료로 API 키를 발급받으실 수 있습니다.</span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>저장 완료</span>
                </>
              ) : (
                <span>설정 저장하기</span>
              )}
            </button>
            {customApiKey && (
              <button
                onClick={() => {
                  setKey('');
                  onSaveApiKey('');
                }}
                className="px-3 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
