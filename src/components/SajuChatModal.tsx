'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ManseryeokResult, SajuAnalysisReport, ChatMessage } from '@/lib/saju/types';
import { X, Send, Sparkles, User, Bot, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  manseryeok: ManseryeokResult;
  report: SajuAnalysisReport;
  customApiKey?: string;
}

const SUGGESTED_QUESTIONS = [
  '올해 이직이나 진로 변화를 시도해도 좋을까요?',
  '제게 부족한 기운을 가장 빠르게 보완하는 일상 습관은?',
  '재물운을 트이게 하기 위해 조심해야 할 것은 무엇인가요?',
  '나와 가장 잘 맞는 연인이나 동업자의 사주 기운은?',
];

export const SajuChatModal: React.FC<Props> = ({
  isOpen,
  onClose,
  manseryeok,
  report,
  customApiKey,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 모달 오픈 시 초기 환영 메시지 세팅
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcome: ChatMessage = {
        id: 'init',
        role: 'assistant',
        content: `반갑습니다, ${manseryeok.birthDate.name || '내담자'}님. 내담자님의 사주 원국은 ${manseryeok.ilgan.title}의 기운을 바탕으로 ${manseryeok.ilju.traits}을 품고 계시는군요.\n\n올해 흐름이나 재물, 진로, 인간관계 등 마음에 품고 계신 궁금증이 있다면 무엇이든 편안하게 물어보세요. 하늘의 이치와 지혜로 길을 짚어드리겠습니다.`,
        timestamp: Date.now(),
      };
      setMessages([welcome]);
    }
  }, [isOpen, manseryeok, messages.length]);

  // 스크롤 맨 아래로 자동 이동
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const res = await fetch('/api/saju/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            manseryeok,
            report,
            history: [...messages, userMsg],
            message: query,
            customApiKey,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.reply) {
            replyText = data.reply;
          }
        }
      } catch {
        // 정적 호스팅 환경 fallback
      }

      if (!replyText) {
        const { chatWithSajuMaster } = await import('@/lib/gemini');
        replyText = await chatWithSajuMaster(
          manseryeok,
          report,
          [...messages, userMsg],
          query,
          customApiKey
        );
      }

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: '죄송합니다. 도사님과의 연결에 일시적인 지연이 발생했습니다. 잠시 후 다시 질문해 주세요.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl h-[85vh] card-oriental rounded-2xl flex flex-col overflow-hidden border border-amber-500/30 shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-md">
              <div className="w-full h-full rounded-full bg-neutral-950 flex items-center justify-center text-amber-300 font-serif font-black text-sm">
                道
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>AI 사주 명리 스승</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  1:1 상담실
                </span>
              </h3>
              <p className="text-xs text-neutral-400">
                {manseryeok.ilgan.title} · {manseryeok.ilju.hangul}일주 기반 심층 대화
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 메시지 리스트 영역 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* 아바타 */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-neutral-800 text-neutral-300'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* 말풍선 */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-amber-500 text-black font-semibold rounded-tr-none'
                    : 'bg-neutral-900/90 text-neutral-200 border border-neutral-800 rounded-tl-none shadow-sm'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none p-3.5 bg-neutral-900/90 border border-neutral-800 text-neutral-400 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>도사님이 하늘의 괘를 짚어보는 중입니다...</span>
              </div>
            </div>
          )}
        </div>

        {/* 추천 질문 칩 */}
        <div className="px-4 sm:px-6 py-2 border-t border-neutral-800/80 bg-neutral-950/40 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs whitespace-nowrap border border-neutral-800 hover:border-amber-500/40 transition-all disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 하단 입력 폼 */}
        <div className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-900/80">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="사주와 관련된 궁금한 점을 자유롭게 물어보세요..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
