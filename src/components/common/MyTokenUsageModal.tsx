import React from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  HelpCircle, 
  Calendar, 
  MessageSquare, 
  Bot, 
  FileText, 
  Layout, 
  ShieldAlert
} from 'lucide-react';

interface MyTokenUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestMore: () => void;
  usedTokens: number;
  totalQuota: number;
  dailyUsed?: number;
  dailyLimit?: number;
  userName?: string;
  department?: string;
}

export const MyTokenUsageModal: React.FC<MyTokenUsageModalProps> = ({
  isOpen,
  onClose,
  onRequestMore,
  usedTokens,
  totalQuota,
  dailyUsed = 6200,
  dailyLimit = 15000,
  userName = '정소담',
  department = 'AI사업본부'
}) => {
  if (!isOpen) return null;

  const remaining = Math.max(0, totalQuota - usedTokens);
  const percentage = Math.min(100, Math.round((usedTokens / Math.max(1, totalQuota)) * 100));

  // Determine threshold status
  let statusBanner: { type: 'normal' | 'warning' | 'danger'; text: string } | null = null;
  if (percentage >= 100) {
    statusBanner = {
      type: 'danger',
      text: '이번 달 할당된 AI 사용량을 모두 사용했습니다. 추가 승인 전까지 신규 AI 호출이 일시 제한됩니다.'
    };
  } else if (percentage >= 95) {
    statusBanner = {
      type: 'danger',
      text: 'AI 사용 가능량이 얼마 남지 않았습니다. 원활한 업무를 위해 추가 사용량을 요청해 주세요.'
    };
  } else if (percentage >= 80) {
    statusBanner = {
      type: 'warning',
      text: '이번 달 AI 사용 가능량의 80%를 사용했습니다.'
    };
  }

  // Breakdown mock items
  const breakdown = [
    { name: '제안서 생성 & RFP 분석', icon: FileText, tokens: 34200, percentage: 47, color: 'bg-red-500' },
    { name: 'Knowledge AI (지능형 챗봇)', icon: MessageSquare, tokens: 18400, percentage: 25, color: 'bg-blue-500' },
    { name: 'Custom AI (회의록/번역)', icon: Layout, tokens: 11500, percentage: 16, color: 'bg-amber-500' },
    { name: 'AI Agent & Worker', icon: Bot, tokens: 8330, percentage: 12, color: 'bg-purple-500' }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="my-token-usage-modal"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-[#E60012]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-neutral-900">내 AI Token 사용량 현황</h3>
              <p className="text-[11px] text-neutral-500">{department} · {userName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-neutral-700 max-h-[80vh] overflow-y-auto">
          {/* Warning Banner if >= 80% */}
          {statusBanner && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              statusBanner.type === 'danger'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {statusBanner.type === 'danger' ? (
                <ShieldAlert className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold text-xs">{statusBanner.text}</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestMore();
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#E60012] hover:underline cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>지금 추가 사용량 요청하기 &gt;</span>
                </button>
              </div>
            </div>
          )}

          {/* Big Summary Card */}
          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block mb-0.5">이번 달 AI 총 사용률</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-neutral-900 tracking-tight">{percentage}%</span>
                  <span className="text-xs font-semibold text-neutral-500">
                    ({usedTokens.toLocaleString()} / {totalQuota.toLocaleString()} Token)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-neutral-500 block mb-0.5">잔여 사용 가능량</span>
                <span className={`text-xl font-bold ${remaining <= 0 ? 'text-[#E60012]' : 'text-emerald-700'}`}>
                  {remaining.toLocaleString()} <span className="text-xs font-normal">Token</span>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 h-3 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage >= 95 
                    ? 'bg-[#E60012]' 
                    : percentage >= 80 
                    ? 'bg-amber-500' 
                    : 'bg-neutral-900'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Sub metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200/80 text-[11px]">
              <div>
                <span className="text-neutral-500 block">오늘 일일 사용량</span>
                <span className="font-bold text-neutral-800">
                  {dailyUsed.toLocaleString()} / {dailyLimit.toLocaleString()} Token
                </span>
              </div>
              <div className="text-right">
                <span className="text-neutral-500 block">다음 갱신 예정일</span>
                <span className="font-bold text-neutral-800 flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  2026년 10월 1일 (매월 1일)
                </span>
              </div>
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs text-neutral-900 flex items-center justify-between">
              <span>서비스별 Token 소모 비중</span>
              <span className="text-[11px] font-normal text-neutral-400">최근 30일 누적</span>
            </h4>

            <div className="space-y-2.5">
              {breakdown.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-neutral-800">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-neutral-900">{item.tokens.toLocaleString()} Token</span>
                        <span className="text-neutral-400 ml-1.5 font-mono">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidance Note */}
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
            💡 <strong>KPC AI Token 정책 안내:</strong> 제안서 대용량 분석, 다국어 문서 일괄 번역 등 대형 프로젝트 진행 시 추가 토큰이 필요하면 언제든 [추가 사용량 요청]을 통해 승인받으실 수 있습니다.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestMore();
            }}
            className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>추가 사용량 요청</span>
          </button>
        </div>
      </div>
    </div>
  );
};
