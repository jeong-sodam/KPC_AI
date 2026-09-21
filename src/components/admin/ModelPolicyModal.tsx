import React, { useState } from 'react';
import { X, Save, Cpu, Sparkles } from 'lucide-react';
import { AiModelPolicy } from '../../types';

interface ModelPolicyModalProps {
  model: AiModelPolicy | null;
  onClose: () => void;
  onSave: (updated: AiModelPolicy) => void;
  onShowToast: (msg: string) => void;
}

export const ModelPolicyModal: React.FC<ModelPolicyModalProps> = ({
  model,
  onClose,
  onSave,
  onShowToast
}) => {
  if (!model) return null;

  const [monthlyCostCap, setMonthlyCostCap] = useState<number>(model.monthlyCostCap);
  const [monthlyTokenCap, setMonthlyTokenCap] = useState<number>(model.monthlyTokenCap);
  const [rateLimitRpm, setRateLimitRpm] = useState<number>(model.rateLimitRpm);
  const [perUserMonthlyLimit, setPerUserMonthlyLimit] = useState<number>(model.perUserMonthlyLimit);
  const [perTeamMonthlyLimit, setPerTeamMonthlyLimit] = useState<number>(model.perTeamMonthlyLimit);
  const [isActive, setIsActive] = useState<boolean>(model.isActive);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AiModelPolicy = {
      ...model,
      monthlyCostCap,
      monthlyTokenCap,
      rateLimitRpm,
      perUserMonthlyLimit,
      perTeamMonthlyLimit,
      isActive
    };
    onSave(updated);
    onShowToast(`${model.name} 정책이 성공적으로 수정되었습니다.`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="model-policy-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white font-bold text-xs">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{model.name} 사용 정책 & Cost Cap 설정</h3>
              <p className="text-[11px] text-neutral-400">제공자: {model.provider}</p>
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-neutral-700 max-h-[80vh] overflow-y-auto">
          {/* Monthly Cost Cap */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              월 비용 상한 (Monthly Cost Cap)
            </label>
            <div className="relative">
              <input
                type="number"
                step="500000"
                min="500000"
                value={monthlyCostCap}
                onChange={e => setMonthlyCostCap(parseInt(e.target.value, 10) || 500000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">₩ (원)</span>
            </div>
          </div>

          {/* Monthly Token Cap */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              사용 Token 상한 (Monthly Token Cap)
            </label>
            <div className="relative">
              <input
                type="number"
                step="5000000"
                min="5000000"
                value={monthlyTokenCap}
                onChange={e => setMonthlyTokenCap(parseInt(e.target.value, 10) || 5000000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">Token</span>
            </div>
          </div>

          {/* Rate Limit RPM */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              분당 호출 제한 (Rate Limit)
            </label>
            <div className="relative">
              <input
                type="number"
                step="100"
                min="100"
                value={rateLimitRpm}
                onChange={e => setRateLimitRpm(parseInt(e.target.value, 10) || 100)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">RPM (Req/Min)</span>
            </div>
          </div>

          {/* Per User & Team Limits */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-900 block">
                사용자당 월 한도
              </label>
              <input
                type="number"
                step="10000"
                value={perUserMonthlyLimit}
                onChange={e => setPerUserMonthlyLimit(parseInt(e.target.value, 10) || 10000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-bold text-neutral-900 block">
                팀당 월 한도
              </label>
              <input
                type="number"
                step="1000000"
                value={perTeamMonthlyLimit}
                onChange={e => setPerTeamMonthlyLimit(parseInt(e.target.value, 10) || 1000000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
            </div>
          </div>

          {/* Active Status Switch */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-neutral-900 block">모델 활성화 상태</span>
              <span className="text-[11px] text-neutral-500">비활성화 시 전사 호출 및 제안서/채팅 선택 목록에서 제외됩니다.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E60012]"></div>
            </label>
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
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>정책 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
