import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  FileText,
  Sliders
} from 'lucide-react';

interface SecurityPolicyViewProps {
  onShowToast: (msg: string) => void;
}

export const SecurityPolicyView: React.FC<SecurityPolicyViewProps> = ({ onShowToast }) => {
  // Security Policy State for 3 Data Grades
  const [publicPolicy, setPublicPolicy] = useState({
    allowedModels: '상용 LLM 및 Enterprise LLM 전체 허용',
    externalTransmission: true,
    logRetentionDays: 90,
    allowFileDownload: true,
    enablePiiMasking: false,
    enableDlp: false
  });

  const [internalPolicy, setInternalPolicy] = useState({
    allowedModels: 'Enterprise LLM 우선 / 상용 LLM 부분 선택',
    externalTransmission: true,
    logRetentionDays: 180,
    allowFileDownload: true,
    enablePiiMasking: true,
    enableDlp: true
  });

  const [sensitivePolicy, setSensitivePolicy] = useState({
    allowedModels: 'Enterprise LLM 전용 (상용 API 절대 금지)',
    externalTransmission: false,
    logRetentionDays: 365,
    allowFileDownload: false,
    enablePiiMasking: true,
    enableDlp: true
  });

  const handleSavePolicy = () => {
    onShowToast('플랫폼 보안 정책 및 DLP 통제 룰이 저장이 성공적으로 완료되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">데이터 보안 정책 및 DLP 통제 센터</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E60012] text-white">
              KPC 데이터 등급별 LLM 라우팅 연동
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            공개, 내부, 민감 등급에 따라 허용 모델, 외부 전송 가능 여부, 개인정보 Masking 및 DLP 정책을 설정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSavePolicy}
          className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>보안 정책 저장</span>
        </button>
      </div>

      {/* 3 Data Security Grades Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. 공개 등급 (Public Grade) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
              1등급: 공개 (Public)
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">가장 유연한 정책</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">사용 가능 AI 모델</label>
              <input
                type="text"
                value={publicPolicy.allowedModels}
                onChange={e => setPublicPolicy(p => ({ ...p, allowedModels: e.target.value }))}
                className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 text-xs font-semibold"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">외부 상용 LLM 전송 허용</span>
              <input
                type="checkbox"
                checked={publicPolicy.externalTransmission}
                onChange={e => setPublicPolicy(p => ({ ...p, externalTransmission: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">개인정보(PII) 자동 Masking</span>
              <input
                type="checkbox"
                checked={publicPolicy.enablePiiMasking}
                onChange={e => setPublicPolicy(p => ({ ...p, enablePiiMasking: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">파일 원문 다운로드 허용</span>
              <input
                type="checkbox"
                checked={publicPolicy.allowFileDownload}
                onChange={e => setPublicPolicy(p => ({ ...p, allowFileDownload: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>
          </div>
        </div>

        {/* 2. 내부 등급 (Internal Grade) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              2등급: 내부 (Internal)
            </span>
            <span className="text-[10px] text-neutral-400 font-mono">기본 사내 정책</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">사용 가능 AI 모델</label>
              <input
                type="text"
                value={internalPolicy.allowedModels}
                onChange={e => setInternalPolicy(p => ({ ...p, allowedModels: e.target.value }))}
                className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 text-xs font-semibold"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">외부 상용 LLM 전송 허용</span>
              <input
                type="checkbox"
                checked={internalPolicy.externalTransmission}
                onChange={e => setInternalPolicy(p => ({ ...p, externalTransmission: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">개인정보(PII) 자동 Masking</span>
              <input
                type="checkbox"
                checked={internalPolicy.enablePiiMasking}
                onChange={e => setInternalPolicy(p => ({ ...p, enablePiiMasking: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">DLP 민감어 유출 차단 엔진</span>
              <input
                type="checkbox"
                checked={internalPolicy.enableDlp}
                onChange={e => setInternalPolicy(p => ({ ...p, enableDlp: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>
          </div>
        </div>

        {/* 3. 민감 등급 (Sensitive Grade) */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-800 border border-red-300">
              3등급: 민감 (Sensitive)
            </span>
            <span className="text-[10px] text-red-600 font-bold">최고 수준 보안 통제</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">사용 가능 AI 모델</label>
              <input
                type="text"
                value={sensitivePolicy.allowedModels}
                onChange={e => setSensitivePolicy(p => ({ ...p, allowedModels: e.target.value }))}
                className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 text-xs font-semibold"
              />
            </div>

            <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 flex items-center justify-between">
              <span className="font-bold text-red-800">외부 상용 LLM 전송 허용</span>
              <input
                type="checkbox"
                checked={sensitivePolicy.externalTransmission}
                onChange={e => setSensitivePolicy(p => ({ ...p, externalTransmission: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <span className="font-bold text-neutral-800">개인정보(PII) 필수 Masking</span>
              <input
                type="checkbox"
                checked={sensitivePolicy.enablePiiMasking}
                onChange={e => setSensitivePolicy(p => ({ ...p, enablePiiMasking: e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>

            <div className="p-3 bg-red-50/70 rounded-xl border border-red-200 flex items-center justify-between">
              <span className="font-bold text-red-800">원문 문서 다운로드 차단</span>
              <input
                type="checkbox"
                checked={!sensitivePolicy.allowFileDownload}
                onChange={e => setSensitivePolicy(p => ({ ...p, allowFileDownload: !e.target.checked }))}
                className="w-4 h-4 rounded text-[#E60012]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
