import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TokenRequest } from '../../types';

interface RequestTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number, reason: string) => void;
  currentQuota: number;
  usedTokens: number;
}

export const RequestTokenModal: React.FC<RequestTokenModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentQuota,
  usedTokens
}) => {
  const [selectedPreset, setSelectedPreset] = useState<number | 'custom'>(50000);
  const [customAmount, setCustomAmount] = useState<string>('30000');
  const [reason, setReason] = useState<string>('이번 주 제안서 작성 및 심층 분석 업무를 위해 추가 사용량이 필요합니다.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getRequestedAmount = () => {
    if (selectedPreset === 'custom') {
      const num = parseInt(customAmount, 10);
      return isNaN(num) || num <= 0 ? 10000 : num;
    }
    return selectedPreset;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = getRequestedAmount();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(amount, reason);
      onClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="request-token-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">추가 AI Token 사용량 요청</h3>
              <p className="text-[11px] text-neutral-400">관리자 승인 즉시 추가 토큰이 계정에 반영됩니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-neutral-700">
          {/* Current Status Box */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-500 block">현재 계정 할당 상태</span>
              <span className="font-bold text-sm text-neutral-900">
                {usedTokens.toLocaleString()} / {currentQuota.toLocaleString()} Token
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-neutral-500 block">잔여 토큰</span>
              <span className={`font-bold text-sm ${currentQuota - usedTokens <= 0 ? 'text-[#E60012]' : 'text-neutral-900'}`}>
                {Math.max(0, currentQuota - usedTokens).toLocaleString()} Token
              </span>
            </div>
          </div>

          {/* Amount Presets */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-900 block">
              추가 요청량 선택 <span className="text-[#E60012]">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10000, 50000, 100000].map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedPreset(amount)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedPreset === amount
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  +{amount >= 1000 ? `${amount / 1000}K` : amount}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setSelectedPreset('custom')}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedPreset === 'custom'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                직접 입력
              </button>
            </div>

            {selectedPreset === 'custom' && (
              <div className="pt-2">
                <div className="relative">
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    max="1000000"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="요청할 토큰 수를 입력하세요 (예: 40000)"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#E60012]"
                  />
                  <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">Token</span>
                </div>
              </div>
            )}
          </div>

          {/* Reason Input */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              사용 목적 및 사유 <span className="text-[#E60012]">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="예: 이번 주 공공기관 AI 제안서 작성 및 회의록 일괄 번역 업무를 위해 추가 사용량이 필요합니다."
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 leading-relaxed focus:outline-none focus:border-[#E60012]"
            />
            <p className="text-[11px] text-neutral-400">
              * KPC AI 관리 가이드라인에 따라 업무 목적의 타당성 검토 후 1시간 내 승인 처리됩니다.
            </p>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white font-bold flex items-center gap-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '요청 전송 중...' : '요청하기'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
