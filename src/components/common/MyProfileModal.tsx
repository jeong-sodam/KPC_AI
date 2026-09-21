import React from 'react';
import { X, User, Mail, Building, ShieldCheck, KeyRound, Cpu, Layers } from 'lucide-react';
import { UserRole } from '../../types';

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  userName?: string;
  department?: string;
  email?: string;
  usedTokens: number;
  totalQuota: number;
}

export const MyProfileModal: React.FC<MyProfileModalProps> = ({
  isOpen,
  onClose,
  userRole,
  userName = '정소담',
  department = 'AI사업본부',
  email = 'jeongsodam0108@gmail.com',
  usedTokens,
  totalQuota
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="my-profile-modal"
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
              <h3 className="font-bold text-sm text-white">내 프로필 정보</h3>
              <p className="text-[11px] text-neutral-400">한국생산성본부(KPC) 사내 단일 인증(SSO) 연동</p>
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
        <div className="p-6 space-y-5 text-xs text-neutral-700">
          {/* User Card */}
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-xs ${
              userRole === 'admin' ? 'bg-[#E60012]' : 'bg-neutral-900'
            }`}>
              {userRole === 'admin' ? '관' : '정'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base text-neutral-900">{userName}</h4>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                  userRole === 'admin' 
                    ? 'bg-red-50 text-[#E60012] border-red-200' 
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}>
                  {userRole === 'admin' ? '시스템 관리자' : '일반 사용자'}
                </span>
              </div>
              <p className="text-neutral-500 mt-0.5">{department} · {userRole === 'admin' ? '수석연구원 / AI사업 총괄' : '선임연구원'}</p>
              <p className="text-neutral-400 text-[11px] font-mono mt-0.5">{email}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
              <span className="text-neutral-500 flex items-center gap-2">
                <Building className="w-4 h-4 text-neutral-400" />
                <span>소속 본부 / 부서</span>
              </span>
              <span className="font-semibold text-neutral-900">{department} (생산성혁신TF)</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
              <span className="text-neutral-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>사내 DLP 보안 등급</span>
              </span>
              <span className="font-semibold text-emerald-700">KPC 1급 기밀 취급 인가</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
              <span className="text-neutral-500 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>기본 생성 AI 엔진</span>
              </span>
              <span className="font-semibold text-neutral-900">Gemini 2.5 Flash / GPT Enterprise</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-neutral-200">
              <span className="text-neutral-500 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>월간 토큰 한도</span>
              </span>
              <span className="font-bold text-neutral-900">
                {usedTokens.toLocaleString()} / {totalQuota.toLocaleString()} Token
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
