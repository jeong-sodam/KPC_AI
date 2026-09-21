import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Building, 
  Database, 
  Cpu, 
  FileText,
  Lock
} from 'lucide-react';
import { CommunityAgent, AgentAuditRequestData } from '../../types';

interface AgentAuditRequestModalProps {
  agent: CommunityAgent;
  isOpen: boolean;
  onClose: () => void;
  onSubmitAudit: (auditData: AgentAuditRequestData) => void;
  onShowToast: (msg: string) => void;
}

export const AgentAuditRequestModal: React.FC<AgentAuditRequestModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSubmitAudit,
  onShowToast
}) => {
  const [reason, setReason] = useState(
    agent.reasonCreated || '사내 다양한 부서에서 반복 수행하는 업무의 생산성을 제고하고 검증된 AI Agent로 전사 보급하기 위함'
  );
  const [keyFeatures, setKeyFeatures] = useState(
    agent.howToUse || '1. 핵심 프롬프트 기반 자동 분석\n2. 사내 표준 양식 문서 출력\n3. 관련 법령 및 규정 검토 보조'
  );
  const [targetAudience, setTargetAudience] = useState('KPC 전사 임직원 및 사업본부 컨설턴트/영업대표');
  const [expectedUsers, setExpectedUsers] = useState('월 500명 이상 (주간 평균 1,200회 실행 예상)');
  const [usedData, setUsedData] = useState(
    agent.knowledgeFiles?.map(f => f.name).join(', ') || 'KPC 사내 지식베이스 RAG, 표준 업무 가이드라인'
  );
  const [usedConnectors, setUsedConnectors] = useState(
    agent.connectors?.filter(c => c.enabled).map(c => c.name).join(', ') || '내부 검색, SharePoint'
  );
  const [hasSensitiveInfo, setHasSensitiveInfo] = useState(false);
  const [sensitiveInfoDetails, setSensitiveInfoDetails] = useState('');
  const [adminNotes, setAdminNotes] = useState(
    '커뮤니티에서 충분한 사내 동료 테스트를 거쳤으며, DLP 및 프롬프트 인젝션 방어 규칙을 적용 완료했습니다.'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      onShowToast('등록 사유를 입력해주세요.');
      return;
    }

    const auditData: AgentAuditRequestData = {
      reason,
      keyFeatures,
      targetAudience,
      expectedUsers,
      usedData,
      usedConnectors,
      hasSensitiveInfo,
      sensitiveInfoDetails: hasSensitiveInfo ? sensitiveInfoDetails : undefined,
      adminNotes,
      requestDate: '2026.09.11'
    };

    onSubmitAudit(auditData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#111111]">공식 AI Agent 등록 신청</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-800">
                  검수 심의
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                심의 통과 시 'AI Agent' 탭에 공식 등재되며 전사 직원이 사용할 수 있습니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-neutral-800">
          
          {/* Target Agent Summary Card */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-neutral-400 block mb-0.5">신청 대상 Agent</span>
              <span className="font-bold text-sm text-neutral-900">{agent.title}</span>
              <span className="ml-2 font-mono text-neutral-500">{agent.version}</span>
            </div>
            <div className="text-right">
              <span className="text-neutral-400 block mb-0.5">신청자 / 부서</span>
              <span className="font-semibold text-neutral-800">{agent.author} ({agent.department})</span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              1. 공식 Agent 등록 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="공식 서비스로 승격하여 전사 임직원에게 제공해야 하는 배경과 필요성을 작성하세요."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm resize-none"
              required
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              2. Agent 주요 기능 요약 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={keyFeatures}
              onChange={e => setKeyFeatures(e.target.value)}
              placeholder="핵심 기능과 처리 로직을 입력하세요."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs resize-none"
              required
            />
          </div>

          {/* Target Audience & Expected Users */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                3. 활용 대상 및 부서 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="예: 전사 임직원, 제안사업본부, 교육사업팀 등"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                4. 예상 사용자 및 트래픽 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={expectedUsers}
                onChange={e => setExpectedUsers(e.target.value)}
                placeholder="예: 월 300명 이상, 일 50회 실행"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs"
                required
              />
            </div>
          </div>

          {/* Used Data & Connectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                5. 연동/사용 데이터
              </label>
              <input
                type="text"
                value={usedData}
                onChange={e => setUsedData(e.target.value)}
                placeholder="지식베이스, 사내 문서 등"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                6. 사용 커넥터
              </label>
              <input
                type="text"
                value={usedConnectors}
                onChange={e => setUsedConnectors(e.target.value)}
                placeholder="내부 검색, SharePoint, Teams 등"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs"
              />
            </div>
          </div>

          {/* Sensitive / Personal Info Toggle */}
          <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/70 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-xs text-neutral-800 flex items-center gap-1.5 cursor-pointer">
                  <Lock className="w-3.5 h-3.5 text-neutral-600" />
                  7. 개인정보 또는 기밀/민감정보 취급 여부
                </label>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  주민등록번호, 고객사 미공개 단가표 등 민감정보를 처리하는지 여부
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSensitiveInfo}
                  onChange={e => setHasSensitiveInfo(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>

            {hasSensitiveInfo && (
              <div className="pt-2 border-t border-neutral-200">
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  민감정보 처리 상세 내역 및 보호 조치
                </label>
                <input
                  type="text"
                  value={sensitiveInfoDetails}
                  onChange={e => setSensitiveInfoDetails(e.target.value)}
                  placeholder="예: 고객명 및 전화번호 마스킹 처리 모듈 적용 완료"
                  className="w-full px-3 py-1.5 bg-white border border-neutral-300 rounded-lg text-xs"
                />
              </div>
            )}
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              8. 관리자(검수위원) 전달사항
            </label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="검수 시 특별히 확인해주었으면 하는 사항을 기재하세요."
              rows={2}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs resize-none"
            />
          </div>

          {/* Process Timeline Note */}
          <div className="p-3 bg-neutral-100 rounded-xl text-xs text-neutral-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>검수 심의 절차:</strong> 신청서 제출 즉시 상태가 <span className="font-semibold text-orange-700">[검수 요청]</span>으로 전환되며, AI 운영 관리자의 보안 및 품질 심의(답변 품질, 보안 필터링, 시스템 리소스)를 거쳐 최종 승인 시 <strong>AI Agent</strong> 공식 탭에 등록됩니다.
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-end gap-2.5 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            검수 요청 제출하기
          </button>
        </div>

      </div>
    </div>
  );
};
