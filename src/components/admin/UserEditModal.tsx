import React, { useState } from 'react';
import { X, Save, Sparkles, User, Shield, AlertTriangle, Plus } from 'lucide-react';
import { UserTokenAllocation } from '../../types';

interface UserEditModalProps {
  user: UserTokenAllocation | null;
  onClose: () => void;
  onSave: (updated: UserTokenAllocation) => void;
  onShowToast: (msg: string) => void;
}

const ALL_MODELS = [
  'GPT Enterprise',
  'Claude Enterprise',
  'Gemini 2.5 Pro',
  'Gemini 2.5 Flash',
  'HyperCLOVA X'
];

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  onClose,
  onSave,
  onShowToast
}) => {
  if (!user) return null;

  const [totalQuota, setTotalQuota] = useState<number>(user.totalQuota);
  const [dailyLimit, setDailyLimit] = useState<number>(user.dailyLimit);
  const [allowedModels, setAllowedModels] = useState<string[]>(user.allowedModels);
  const [isThrottled, setIsThrottled] = useState<boolean>(user.isThrottled);
  const [extraTokensToAdd, setExtraTokensToAdd] = useState<number>(0);

  const handleToggleModel = (model: string) => {
    if (allowedModels.includes(model)) {
      if (allowedModels.length === 1) {
        onShowToast('최소 1개 이상의 AI 모델을 선택해야 합니다.');
        return;
      }
      setAllowedModels(allowedModels.filter(m => m !== model));
    } else {
      setAllowedModels([...allowedModels, model]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuota = totalQuota + extraTokensToAdd;
    const finalRemaining = Math.max(0, finalQuota - user.usedTokens);
    
    let finalStatus: UserTokenAllocation['status'] = '정상';
    if (isThrottled || finalRemaining <= 0) {
      finalStatus = '사용 제한';
    } else {
      const usageRate = (user.usedTokens / finalQuota) * 100;
      if (usageRate >= 95) finalStatus = '위험';
      else if (usageRate >= 80) finalStatus = '주의';
      else finalStatus = '정상';
    }

    const updated: UserTokenAllocation = {
      ...user,
      totalQuota: finalQuota,
      remainingTokens: finalRemaining,
      dailyLimit,
      allowedModels,
      isThrottled,
      status: finalStatus
    };

    onSave(updated);
    if (extraTokensToAdd > 0) {
      onShowToast(`${user.name} 님에게 +${extraTokensToAdd.toLocaleString()} Token이 추가 지급되었습니다.`);
    } else {
      onShowToast(`${user.name} 님의 AI 사용 정책이 업데이트되었습니다.`);
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="user-edit-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">사용자별 Token 할당 및 정책 설정</h3>
              <p className="text-[11px] text-neutral-400">{user.name} ({user.team} · {user.role})</p>
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
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-neutral-700 max-h-[80vh] overflow-y-auto">
          {/* Current Info */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="text-neutral-500 block text-[11px]">현재 사용량</span>
              <span className="font-bold text-sm text-neutral-900">{user.usedTokens.toLocaleString()} Token</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-500 block text-[11px]">현재 잔여량</span>
              <span className="font-bold text-sm text-emerald-700">{user.remainingTokens.toLocaleString()} Token</span>
            </div>
          </div>

          {/* 1. 월 Token 할당량 */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              월 Token 할당량 (Monthly Quota)
            </label>
            <div className="relative">
              <input
                type="number"
                step="5000"
                min="10000"
                value={totalQuota}
                onChange={e => setTotalQuota(parseInt(e.target.value, 10) || 10000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">Token</span>
            </div>
          </div>

          {/* 2. 일 Token 제한 */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              일일 Token 제한 (Daily Limit)
            </label>
            <div className="relative">
              <input
                type="number"
                step="1000"
                min="1000"
                value={dailyLimit}
                onChange={e => setDailyLimit(parseInt(e.target.value, 10) || 1000)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#E60012]"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400 font-bold">Token / 일</span>
            </div>
          </div>

          {/* 3. 추가 Token 즉시 지급 */}
          <div className="p-3.5 bg-red-50/40 rounded-xl border border-red-100 space-y-2">
            <label className="font-bold text-neutral-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#E60012]">
                <Plus className="w-3.5 h-3.5" />
                추가 Token 보너스 즉시 지급
              </span>
              <span className="text-[11px] font-normal text-neutral-500">선택 시 즉시 가산</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10000, 50000, 100000].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setExtraTokensToAdd(val)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    extraTokensToAdd === val
                      ? 'bg-[#E60012] text-white border-[#E60012] shadow-xs'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {val === 0 ? '지급 안 함' : `+${val / 1000}K`}
                </button>
              ))}
            </div>
          </div>

          {/* 4. 사용할 수 있는 AI 모델 */}
          <div className="space-y-2">
            <label className="font-bold text-neutral-900 block">
              사용 허용 AI 모델 설정
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_MODELS.map(model => (
                <label 
                  key={model}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={allowedModels.includes(model)}
                    onChange={() => handleToggleModel(model)}
                    className="w-4 h-4 text-[#E60012] rounded border-neutral-300 focus:ring-red-500"
                  />
                  <span className="font-medium text-neutral-800 text-xs">{model}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. AI 사용 일시 제한 (Throttle / Suspend) */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-neutral-900 block">AI 사용 일시 제한 (차단)</span>
              <span className="text-[11px] text-neutral-500">활성화 시 해당 사용자의 모든 신규 AI 요청이 차단됩니다.</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isThrottled}
                onChange={e => setIsThrottled(e.target.checked)}
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
              className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>설정 저장</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
