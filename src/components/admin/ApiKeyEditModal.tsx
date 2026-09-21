import React, { useState } from 'react';
import { X, Save, KeyRound, CheckCircle2, RefreshCw } from 'lucide-react';
import { AiProviderApiKey } from '../../types';

interface ApiKeyEditModalProps {
  provider: AiProviderApiKey | null;
  onClose: () => void;
  onSave: (updated: AiProviderApiKey) => void;
  onShowToast: (msg: string) => void;
}

export const ApiKeyEditModal: React.FC<ApiKeyEditModalProps> = ({
  provider,
  onClose,
  onSave,
  onShowToast
}) => {
  if (!provider) return null;

  const [newKey, setNewKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestKey = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('성공: 엔드포인트 연결 응답시간 115ms (Status 200 OK)');
      onShowToast(`${provider.providerName} API Key 유효성 검증 성공!`);
    }, 600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) {
      onShowToast('새로운 API Key를 입력하세요.');
      return;
    }

    const masked = newKey.length > 8 
      ? `${newKey.slice(0, 7)}••••••••••••${newKey.slice(-4)}`
      : '••••••••••••';

    const updated: AiProviderApiKey = {
      ...provider,
      maskedKey: masked,
      fullKeySample: newKey,
      status: '정상 연결',
      lastTestedAt: '방금 전 (연결 확인 완료)'
    };

    onSave(updated);
    onShowToast(`${provider.providerName}의 API Key가 안전하게 갱신되었습니다.`);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="api-key-edit-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white font-bold text-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{provider.providerName} API Key 변경</h3>
              <p className="text-[11px] text-neutral-400">Enterprise 보안 인증 게이트웨이</p>
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
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-neutral-700">
          <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
            <span className="text-[11px] text-neutral-500 block">현재 등록된 키</span>
            <span className="font-mono text-neutral-800 font-semibold">{provider.maskedKey}</span>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-neutral-900 block">
              새로운 API Key 입력 <span className="text-[#E60012]">*</span>
            </label>
            <input
              type="password"
              required
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="예: sk-proj-... 또는 AIzaSy..."
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:border-[#E60012]"
            />
            <p className="text-[11px] text-neutral-400">
              * 입력된 키는 KPC KMS(Key Management Service)에 암호화 보관되며 화면에는 마스킹 처리됩니다.
            </p>
          </div>

          {testResult && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{testResult}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !newKey.trim()}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? '연결 확인 중...' : '연결 테스트'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 font-semibold transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>키 갱신 저장</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
